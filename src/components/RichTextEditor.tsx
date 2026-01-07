/**
 * RichTextEditor - Editor WYSIWYG (What You See Is What You Get)
 * El usuario edita directamente el contenido formateado, sin ver etiquetas HTML
 */

import React, { useRef, useEffect, useCallback } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    Link,
    Unlink,
    Undo,
    Redo,
    Type
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    label,
    placeholder = 'Escribe aquí...'
}) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Sincronizar el valor inicial
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, []);

    // Ejecutar comando de formato
    const execCommand = useCallback((command: string, value: string | null = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    }, []);

    // Manejar cambios en el editor
    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Insertar enlace
    const insertLink = () => {
        const url = prompt('Ingresa la URL del enlace:', 'https://');
        if (url) {
            execCommand('createLink', url);
        }
    };

    // Plantillas predefinidas
    const templates = {
        terms: `<h2>Términos y Condiciones</h2>
<h3>1. Aceptación de Términos</h3>
<p>Al utilizar nuestros servicios, usted acepta estos términos y condiciones en su totalidad.</p>
<h3>2. Servicios Ofrecidos</h3>
<p>Terra Viva Grupo Inmobiliario SAC ofrece servicios de intermediación inmobiliaria, incluyendo:</p>
<ul>
<li>Venta de propiedades</li>
<li>Alquiler tradicional</li>
<li>Alquiler temporal (AirBnB)</li>
<li>Asesoría legal inmobiliaria</li>
</ul>
<h3>3. Información de Propiedades</h3>
<p>La información mostrada en nuestro sitio web es referencial y está sujeta a disponibilidad y verificación.</p>
<h3>4. Contacto</h3>
<p>Para consultas: <strong>913 328 866</strong> | terravivasuport@gmail.com</p>`,

        privacy: `<h2>Política de Privacidad</h2>
<h3>1. Datos que Recopilamos</h3>
<p>Recopilamos información personal cuando usted:</p>
<ul>
<li>Completa formularios de contacto</li>
<li>Se registra en nuestro boletín</li>
<li>Solicita información sobre propiedades</li>
</ul>
<h3>2. Uso de la Información</h3>
<p>Sus datos serán utilizados únicamente para:</p>
<ul>
<li>Responder a sus consultas</li>
<li>Enviar información sobre propiedades de su interés</li>
<li>Mejorar nuestros servicios</li>
</ul>
<h3>3. Protección de Datos</h3>
<p>Implementamos medidas de seguridad para proteger su información personal. Sus datos <strong>no serán compartidos</strong> con terceros sin su consentimiento expreso.</p>
<h3>4. Derechos del Usuario</h3>
<p>Puede ejercer sus derechos de acceso, rectificación y eliminación escribiendo a: <strong>terravivasuport@gmail.com</strong></p>`,

        whistleblowing: `<h2>Canal de Denuncias</h2>
<h3>Nuestro Compromiso</h3>
<p>En <strong>Terra Viva Grupo Inmobiliario</strong> estamos comprometidos con la ética, la transparencia y el cumplimiento normativo en todas nuestras operaciones.</p>
<h3>¿Qué Puede Reportar?</h3>
<ul>
<li>Conductas irregulares o antiéticas</li>
<li>Fraude o corrupción</li>
<li>Incumplimiento de políticas internas</li>
<li>Conflictos de interés</li>
<li>Cualquier situación que afecte la integridad de la empresa</li>
</ul>
<h3>Cómo Realizar una Denuncia</h3>
<p>Envíe su reporte de forma <strong>confidencial</strong> a:</p>
<p><strong>Email:</strong> terravivasuport@gmail.com</p>
<p><strong>Teléfono:</strong> 913 328 866</p>
<h3>Garantías</h3>
<p>Garantizamos la <strong>confidencialidad total</strong> de todas las denuncias y la protección del denunciante contra cualquier represalia.</p>`
    };

    const loadTemplate = (key: keyof typeof templates) => {
        if (confirm('¿Deseas cargar esta plantilla? Se reemplazará el contenido actual.')) {
            if (editorRef.current) {
                editorRef.current.innerHTML = templates[key];
                handleInput();
            }
        }
    };

    // Botones de formato
    const formatButtons = [
        { icon: Heading2, label: 'Título', command: () => execCommand('formatBlock', 'h2') },
        { icon: Heading3, label: 'Subtítulo', command: () => execCommand('formatBlock', 'h3') },
        { icon: Type, label: 'Párrafo', command: () => execCommand('formatBlock', 'p') },
        { divider: true },
        { icon: Bold, label: 'Negrita (Ctrl+B)', command: () => execCommand('bold') },
        { icon: Italic, label: 'Cursiva (Ctrl+I)', command: () => execCommand('italic') },
        { icon: Underline, label: 'Subrayado (Ctrl+U)', command: () => execCommand('underline') },
        { divider: true },
        { icon: List, label: 'Lista con viñetas', command: () => execCommand('insertUnorderedList') },
        { icon: ListOrdered, label: 'Lista numerada', command: () => execCommand('insertOrderedList') },
        { divider: true },
        { icon: AlignLeft, label: 'Alinear izquierda', command: () => execCommand('justifyLeft') },
        { icon: AlignCenter, label: 'Centrar', command: () => execCommand('justifyCenter') },
        { divider: true },
        { icon: Link, label: 'Insertar enlace', command: insertLink },
        { icon: Unlink, label: 'Quitar enlace', command: () => execCommand('unlink') },
        { divider: true },
        { icon: Undo, label: 'Deshacer (Ctrl+Z)', command: () => execCommand('undo') },
        { icon: Redo, label: 'Rehacer (Ctrl+Y)', command: () => execCommand('redo') },
    ];

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
                <label className="font-bold text-slate-800 text-lg">{label}</label>
                <span className="text-xs text-slate-400">Editor Visual</span>
            </div>

            {/* Toolbar */}
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1 items-center">
                {formatButtons.map((btn, idx) =>
                    btn.divider ? (
                        <div key={idx} className="w-px h-6 bg-slate-300 mx-1" />
                    ) : (
                        <button
                            key={idx}
                            type="button"
                            onClick={btn.command}
                            title={btn.label}
                            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            {btn.icon && <btn.icon size={16} />}
                        </button>
                    )
                )}
            </div>

            {/* Plantillas rápidas */}
            <div className="px-4 py-2 bg-amber-50/50 border-b border-amber-100 flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-amber-700">📄 Plantillas:</span>
                <button
                    type="button"
                    onClick={() => loadTemplate('terms')}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 text-amber-700 transition-colors"
                >
                    Términos y Condiciones
                </button>
                <button
                    type="button"
                    onClick={() => loadTemplate('privacy')}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 text-amber-700 transition-colors"
                >
                    Política de Privacidad
                </button>
                <button
                    type="button"
                    onClick={() => loadTemplate('whistleblowing')}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 text-amber-700 transition-colors"
                >
                    Canal de Denuncias
                </button>
            </div>

            {/* Editor WYSIWYG */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                className="min-h-[300px] max-h-[500px] overflow-y-auto px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset prose prose-slate max-w-none
          [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mb-4 [&>h2]:mt-6 [&>h2]:first:mt-0 [&>h2]:border-b [&>h2]:border-slate-200 [&>h2]:pb-2
          [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mb-2 [&>h3]:mt-5
          [&>p]:text-slate-600 [&>p]:mb-3 [&>p]:leading-relaxed
          [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:text-slate-600 [&>ul]:mb-3
          [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:text-slate-600 [&>ol]:mb-3
          [&>li]:mb-1
          [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800
          [&_strong]:font-bold [&_strong]:text-slate-800
          [&_em]:italic"
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />

            {/* Footer con ayuda */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                    💡 Selecciona texto y usa los botones para dar formato
                </span>
                <span className="text-xs text-slate-400">
                    Atajos: <kbd className="px-1 bg-slate-200 rounded">Ctrl+B</kbd> Negrita,
                    <kbd className="px-1 bg-slate-200 rounded ml-1">Ctrl+I</kbd> Cursiva
                </span>
            </div>
        </div>
    );
};

export default RichTextEditor;
