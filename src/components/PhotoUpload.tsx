import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  Plus,
  Download,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

interface UploadedPhoto {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  isActive: boolean;
}

export default function PhotoUpload() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const savedPhotos = localStorage.getItem('weddingPhotos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  };

  const savePhotos = (photoList: UploadedPhoto[]) => {
    localStorage.setItem('weddingPhotos', JSON.stringify(photoList));
    setPhotos(photoList);
    
    // Notificar outros componentes sobre a mudança
    window.dispatchEvent(new CustomEvent('photosUpdated', { 
      detail: { photos: photoList } 
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    // Verificar se não excede o limite de 20 fotos
    if (photos.length + files.length > 20) {
      alert(`Você pode ter no máximo 20 fotos. Atualmente você tem ${photos.length} fotos. Selecione no máximo ${20 - photos.length} fotos.`);
      return;
    }
    
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isImage && isValidSize;
    });

    if (validFiles.length === 0) {
      alert('Por favor, selecione apenas imagens válidas (máximo 10MB cada).');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      
      try {
        const url = await convertFileToBase64(file);
        
        const newPhoto: UploadedPhoto = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: url,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          isActive: true
        };

        const updatedPhotos = [...photos, newPhoto];
        savePhotos(updatedPhotos);
        
        setUploadProgress(((i + 1) / validFiles.length) * 100);
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
      }
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const deletePhoto = (photoId: string) => {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
      const updatedPhotos = photos.filter(photo => photo.id !== photoId);
      savePhotos(updatedPhotos);
    }
  };

  const togglePhotoStatus = (photoId: string) => {
    const updatedPhotos = photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, isActive: !photo.isActive }
        : photo
    );
    savePhotos(updatedPhotos);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const exportPhotos = () => {
    const activePhotos = photos.filter(photo => photo.isActive);
    const photoUrls = activePhotos.map(photo => photo.url);
    
    const dataStr = JSON.stringify(photoUrls, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fotos-casamento.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    if (confirm('Tem certeza que deseja remover todas as fotos personalizadas e voltar às imagens padrão?')) {
      localStorage.removeItem('weddingPhotos');
      setPhotos([]);
      window.dispatchEvent(new CustomEvent('photosUpdated', { 
        detail: { photos: [] } 
      }));
    }
  };

  const activePhotos = photos.filter(photo => photo.isActive);
  const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-serif text-sage-600">Gerenciar Fotos do Slideshow</h3>
          <p className="text-stone-600">Faça upload das suas próprias fotos para o slideshow de fundo</p>
        </div>
        <div className="flex space-x-2">
          {photos.length > 0 && (
            <>
              <button
                onClick={exportPhotos}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center space-x-2 bg-stone-500 text-white px-4 py-2 rounded-lg hover:bg-stone-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Padrão</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-stone-600">Total de Fotos</p>
              <p className="text-xl font-bold text-sage-600">{photos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-stone-600">Fotos Ativas</p>
              <p className="text-xl font-bold text-sage-600">{activePhotos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-stone-600">Tamanho Total</p>
              <p className="text-xl font-bold text-sage-600">{formatFileSize(totalSize)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-stone-600">Limite por Foto</p>
              <p className="text-xl font-bold text-sage-600">20 fotos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-stone-300 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary-100 p-4 rounded-full">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-sage-600 mb-2">
              Faça upload das suas fotos
            </h4>
            <p className="text-stone-600 mb-4">
              Arraste e solte suas imagens aqui ou clique para selecionar
            </p>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="photo-upload"
            />
            
            <label
              htmlFor="photo-upload"
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Selecionar Fotos</span>
            </label>
          </div>
          
          <div className="text-sm text-stone-500">
            <p>Formatos aceitos: JPG, PNG, GIF, WebP</p>
            <p>Tamanho máximo: 10MB por foto • Limite: 20 fotos</p>
            <p>Fotos atuais: {photos.length}/20</p>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      {isUploading && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-sage-600">Fazendo upload...</span>
            <span className="text-sm text-stone-500">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Grid de Fotos */}
      {photos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-sage-600 mb-4">Suas Fotos</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                  photo.isActive ? 'border-green-400' : 'border-stone-300'
                }`}>
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="bg-white text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => togglePhotoStatus(photo.id)}
                      className={`p-2 rounded-full transition-colors ${
                        photo.isActive 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-stone-500 text-white hover:bg-stone-600'
                      }`}
                      title={photo.isActive ? 'Desativar' : 'Ativar'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Indicador de status */}
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                    photo.isActive ? 'bg-green-500' : 'bg-stone-400'
                  }`}></div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm font-medium text-sage-600 truncate" title={photo.name}>
                    {photo.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {formatFileSize(photo.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-sage-600">{selectedPhoto.name}</h3>
                <p className="text-sm text-stone-500">
                  {formatFileSize(selectedPhoto.size)} • 
                  Enviado em {new Date(selectedPhoto.uploadedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
            
            <div className="p-4 border-t border-stone-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  selectedPhoto.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-stone-100 text-stone-800'
                }`}>
                  {selectedPhoto.isActive ? 'Ativa no Slideshow' : 'Inativa'}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => togglePhotoStatus(selectedPhoto.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhoto.isActive 
                      ? 'bg-stone-500 text-white hover:bg-stone-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {selectedPhoto.isActive ? 'Desativar' : 'Ativar'}
                </button>
                
                <button
                  onClick={() => {
                    deletePhoto(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Dicas para melhores resultados:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use imagens em alta resolução (mínimo 1920x1080)</li>
          <li>• Você pode fazer upload de até 20 fotos personalizadas</li>
          <li>• Prefira fotos em formato paisagem (horizontal)</li>
          <li>• Evite imagens muito escuras ou com muito texto</li>
          <li>• As fotos ativas aparecerão automaticamente no slideshow</li>
          <li>• Você pode ativar/desativar fotos a qualquer momento</li>
          <li>• As imagens agora aparecem com mais destaque no fundo</li>
        </ul>
      </div>
    </div>
  );
}