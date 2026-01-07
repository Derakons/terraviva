/**
 * ImageGallery - Biblioteca de imágenes con CRUD
 * Permite gestionar imágenes usando Supabase + ImgBB para uploads
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Upload, Trash2, Copy, Check, Image, Plus, Search,
    X, Grid, List, ExternalLink, FolderOpen, CloudUpload, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';

import { db } from '../services/storage';
import { GalleryImage } from '../services/supabase';
import { uploadMultipleToImgBB, isImgBBConfigured } from '../services/imgbbService';

interface ImageGalleryProps {
    onSelectImage?: (url: string) => void;
    isModal?: boolean;
}

const CATEGORIES = ['Propiedades', 'Logos', 'Banners', 'Documentos', 'Otros'];

const ImageGallery: React.FC<ImageGalleryProps> = ({ onSelectImage, isModal = false }) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showAddForm, setShowAddForm] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [newImage, setNewImage] = useState({
        url: '',
        name: '',
        category: 'Propiedades'
    });
    
    // Upload states
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const imgbbConfigured = isImgBBConfigured();
    const [isLoading, setIsLoading] = useState(true);

    // Cargar imágenes desde Supabase
    useEffect(() => {
        const loadImages = async () => {
            setIsLoading(true);
            try {
                const cloudImages = await db.getGalleryAsync([]);
                setImages(cloudImages);
            } catch (e) {
                console.error('Error loading gallery:', e);
                setImages([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadImages();
    }, []);

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            filePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [filePreviews]);

    // Guardar cambios (async para Supabase)
    const saveImages = async (newImages: GalleryImage[]) => {
        setImages(newImages);
        await db.saveGallery(newImages);
    };

    // Refrescar desde cloud
    const refreshFromCloud = async () => {
        setIsLoading(true);
        try {
            const cloudImages = await db.getGalleryAsync([]);
            setImages(cloudImages);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle file selection
    const handleFileSelect = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (fileArray.length === 0) {
            setUploadError('Por favor selecciona archivos de imagen válidos');
            return;
        }
        
        // Create previews
        const previews = fileArray.map(file => URL.createObjectURL(file));
        setFilePreviews(prev => {
            prev.forEach(url => URL.revokeObjectURL(url));
            return previews;
        });
        setSelectedFiles(fileArray);
        setUploadError(null);
    }, []);

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
        }
    }, [handleFileSelect]);

    // Upload files to ImgBB
    const handleUploadFiles = async () => {
        if (selectedFiles.length === 0) return;
        
        setIsUploading(true);
        setUploadError(null);
        setUploadProgress({ current: 0, total: selectedFiles.length });
        
        try {
            const results = await uploadMultipleToImgBB(selectedFiles, (current, total) => {
                setUploadProgress({ current, total });
            });
            
            // Agregar cada imagen a Supabase
            const newImages: GalleryImage[] = [];
            for (let idx = 0; idx < results.length; idx++) {
                const result = results[idx];
                const newImage_: GalleryImage = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    url: result.url,
                    name: result.name || selectedFiles[idx]?.name || `Imagen_${Date.now()}`,
                    category: newImage.category,
                    deleteUrl: result.deleteUrl,
                    createdAt: new Date().toISOString()
                };
                await db.addGalleryImage(newImage_);
                newImages.push(newImage_);
            }
            
            setImages(prev => [...newImages, ...prev]);
            
            // Reset form
            setSelectedFiles([]);
            setFilePreviews([]);
            setShowAddForm(false);
            setUploadProgress({ current: 0, total: 0 });
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Error al subir las imágenes');
        } finally {
            setIsUploading(false);
        }
    };

    // Añadir imagen por URL
    const handleAddImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newImage.url || !newImage.name) return;

        const image: GalleryImage = {
            id: Date.now().toString(),
            url: newImage.url,
            name: newImage.name,
            category: newImage.category,
            createdAt: new Date().toISOString()
        };

        await db.addGalleryImage(image);
        setImages(prev => [image, ...prev]);
        setNewImage({ url: '', name: '', category: 'Propiedades' });
        setShowAddForm(false);
    };

    // Eliminar imagen
    const handleDeleteImage = async (id: string) => {
        if (confirm('¿Eliminar esta imagen de la galería?')) {
            await db.deleteGalleryImage(id);
            setImages(prev => prev.filter(img => img.id !== id));
        }
    };

    // Copiar URL
    const handleCopyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filtrar imágenes (proteger contra valores undefined)
    const filteredImages = images.filter(img => {
        const imgName = img.name || '';
        const imgUrl = img.url || '';
        const imgCategory = img.category || '';
        const matchesSearch = imgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            imgUrl.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || imgCategory === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={`${isModal ? '' : 'space-y-6'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <FolderOpen className="text-amber-500" size={24} />
                    <h3 className="text-xl font-bold text-slate-800">Biblioteca de Imágenes</h3>
                    <span className="text-sm text-slate-500">({images.length} imágenes)</span>
                    {db.isCloudEnabled() && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">☁️ Cloud</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={refreshFromCloud}
                        disabled={isLoading}
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        title="Refrescar desde la nube"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                    >
                        <Plus size={18} />
                        Añadir Imagen
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o URL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                >
                    <option value="all">Todas las categorías</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 ${viewMode === 'grid' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 ${viewMode === 'list' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Add Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-bold text-slate-800">Añadir Nueva Imagen</h4>
                            <button onClick={() => {
                                setShowAddForm(false);
                                setSelectedFiles([]);
                                setFilePreviews([]);
                                setUploadError(null);
                            }} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Upload Mode Tabs */}
                        <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                    uploadMode === 'file' 
                                        ? 'bg-white shadow text-slate-800' 
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                <CloudUpload size={16} />
                                Subir Archivo
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('url')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                    uploadMode === 'url' 
                                        ? 'bg-white shadow text-slate-800' 
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                <ExternalLink size={16} />
                                Pegar URL
                            </button>
                        </div>
                        
                        {/* File Upload Mode */}
                        {uploadMode === 'file' && (
                            <div className="space-y-4">
                                {!imgbbConfigured && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                                        <div className="flex gap-2 text-amber-800">
                                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Configuración requerida</p>
                                                <p className="mt-1 text-amber-700">
                                                    Para subir imágenes, necesitas configurar tu API Key de ImgBB.
                                                    Añade <code className="bg-amber-100 px-1 rounded">VITE_IMGBB_API_KEY=tu_api_key</code> en tu archivo <code className="bg-amber-100 px-1 rounded">.env</code>
                                                </p>
                                                <a 
                                                    href="https://api.imgbb.com/" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-2 text-amber-900 underline font-medium"
                                                >
                                                    Obtener API Key gratis →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Drop Zone */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                        isDragging 
                                            ? 'border-amber-500 bg-amber-50' 
                                            : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50'
                                    } ${!imgbbConfigured ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                                        className="hidden"
                                    />
                                    <CloudUpload size={48} className={`mx-auto mb-4 ${isDragging ? 'text-amber-500' : 'text-slate-400'}`} />
                                    <p className="text-slate-700 font-medium">
                                        {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">PNG, JPG, GIF hasta 32MB</p>
                                </div>
                                
                                {/* Selected Files Preview */}
                                {selectedFiles.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-slate-700">
                                            {selectedFiles.length} archivo(s) seleccionado(s)
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {filePreviews.map((preview, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                                                    <img src={preview} alt={selectedFiles[idx].name} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            URL.revokeObjectURL(preview);
                                                            setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                                                            setFilePreviews(prev => prev.filter((_, i) => i !== idx));
                                                        }}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Category selector */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                                    <select
                                        value={newImage.category}
                                        onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Error message */}
                                {uploadError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex gap-2">
                                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                        {uploadError}
                                    </div>
                                )}
                                
                                {/* Upload progress */}
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>Subiendo...</span>
                                            <span>{uploadProgress.current} / {uploadProgress.total}</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-300"
                                                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Action buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setSelectedFiles([]);
                                            setFilePreviews([]);
                                        }}
                                        className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                                        disabled={isUploading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUploadFiles}
                                        disabled={!imgbbConfigured || selectedFiles.length === 0 || isUploading}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Subiendo...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={18} />
                                                Subir {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* URL Mode */}
                        {uploadMode === 'url' && (
                            <form onSubmit={handleAddImage} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">URL de la Imagen *</label>
                                    <input
                                        type="url"
                                        required
                                        value={newImage.url}
                                        onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newImage.name}
                                        onChange={(e) => setNewImage({ ...newImage, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="Ej: Fachada Casa Modelo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                                    <select
                                        value={newImage.category}
                                        onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Preview */}
                                {newImage.url && (
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <img
                                            src={newImage.url}
                                            alt="Preview"
                                            className="w-full h-40 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Error+cargando+imagen';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg"
                                    >
                                        Guardar Imagen
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Gallery Grid/List */}
            {filteredImages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <Image className="mx-auto mb-4 text-slate-300" size={48} />
                    <p>No se encontraron imágenes</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map(img => (
                        <div
                            key={img.id}
                            className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Error';
                                    }}
                                />
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-slate-800 truncate text-sm">{img.name}</p>
                                <span className="text-xs text-slate-500">{img.category}</span>
                            </div>

                            {/* Actions overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleCopyUrl(img.url, img.id)}
                                    className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                                    title="Copiar URL"
                                >
                                    {copiedId === img.id ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                                </button>
                                <a
                                    href={img.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                                    title="Abrir en nueva pestaña"
                                >
                                    <ExternalLink size={18} />
                                </a>
                                {onSelectImage && (
                                    <button
                                        onClick={() => onSelectImage(img.url)}
                                        className="p-2 bg-amber-500 rounded-lg text-white hover:bg-amber-600"
                                        title="Seleccionar"
                                    >
                                        <Check size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteImage(img.id)}
                                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredImages.map(img => (
                        <div
                            key={img.id}
                            className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all group"
                        >
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 truncate">{img.name}</p>
                                <p className="text-xs text-slate-500 truncate">{img.url}</p>
                                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{img.category}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleCopyUrl(img.url, img.id)}
                                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                                >
                                    {copiedId === img.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                </button>
                                {onSelectImage && (
                                    <button
                                        onClick={() => onSelectImage(img.url)}
                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                                    >
                                        <Check size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteImage(img.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Usage hint */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">💡 Consejos:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                    <li>
                        <strong>Subir archivos:</strong> Configura tu API Key de <a href="https://api.imgbb.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium">ImgBB</a> (gratis) para subir imágenes directamente.
                    </li>
                    <li>
                        <strong>Pegar URL:</strong> También puedes usar URLs de <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">ImgBB</a>, <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Imgur</a> o cualquier servidor de imágenes.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ImageGallery;
