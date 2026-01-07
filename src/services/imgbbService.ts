/**
 * ImgBB Service - Servicio para subir imágenes a ImgBB
 * API gratuita de hosting de imágenes
 * 
 * Para obtener tu API Key gratis:
 * 1. Ve a https://imgbb.com/
 * 2. Crea una cuenta gratuita
 * 3. Ve a https://api.imgbb.com/
 * 4. Copia tu API Key
 */

// API Key de ImgBB - Puedes cambiarla por la tuya
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'TU_API_KEY_AQUI';

export interface ImgBBResponse {
  success: boolean;
  data?: {
    id: string;
    url: string;
    display_url: string;
    title: string;
    thumb: {
      url: string;
    };
    medium?: {
      url: string;
    };
    delete_url: string;
  };
  error?: {
    message: string;
    code: number;
  };
}

export interface UploadResult {
  url: string;
  name: string;
  deleteUrl?: string;
}

/**
 * Convierte un archivo a Base64
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remover el prefijo "data:image/...;base64,"
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Sube una imagen a ImgBB
 * @param file - Archivo de imagen a subir
 * @param name - Nombre opcional para la imagen
 * @returns Objeto con URL y nombre de la imagen
 */
export const uploadToImgBB = async (file: File, name?: string): Promise<UploadResult> => {
  if (IMGBB_API_KEY === 'TU_API_KEY_AQUI') {
    throw new Error('Por favor configura tu API Key de ImgBB en .env (VITE_IMGBB_API_KEY)');
  }

  const imageName = name || file.name.replace(/\.[^/.]+$/, '') || `Imagen_${Date.now()}`;

  try {
    const base64Image = await fileToBase64(file);
    
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Image);
    formData.append('name', imageName);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result: ImgBBResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error?.message || 'Error al subir imagen');
    }

    return {
      url: result.data.display_url,
      name: result.data.title || imageName,
      deleteUrl: result.data.delete_url
    };
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    throw error;
  }
};

/**
 * Sube múltiples imágenes a ImgBB
 * @param files - Array de archivos
 * @param onProgress - Callback de progreso
 * @returns Array de resultados con URL y nombre
 */
export const uploadMultipleToImgBB = async (
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadToImgBB(files[i]);
    results.push(result);
    onProgress?.(i + 1, files.length);
  }
  
  return results;
};

/**
 * Verifica si la API Key está configurada
 */
export const isImgBBConfigured = (): boolean => {
  return IMGBB_API_KEY !== 'TU_API_KEY_AQUI' && IMGBB_API_KEY.length > 10;
};

export default {
  uploadToImgBB,
  uploadMultipleToImgBB,
  isImgBBConfigured,
};
