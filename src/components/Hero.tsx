import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [customPhotos, setCustomPhotos] = React.useState<string[]>([]);
  const [loadedImages, setLoadedImages] = React.useState<string[]>([]);
  
  // Array de imagens de casamento - caminhos corretos para pasta public
  const defaultImages = [
    'public/iloveimg-compressed/Casamento civil Kriss e Iverson-110.jpg',
    'public/iloveimg-compressed/Casamento civil Kriss e Iverson-111.jpg',
    
  ];

  // Função para carregar todas as imagens da pasta dinamicamente
  const loadImagesFromFolder = async () => {
    try {
      // Lista de possíveis nomes de arquivos (você pode expandir esta lista)
      const possibleImages = [
        'Casamento civil Kriss e Iverson-110.jpg',
        'Casamento civil Kriss e Iverson-111.jpg',
       
      ];

      const validImages: string[] = [];

      // Verificar quais imagens existem
      for (const imageName of possibleImages) {
        const imagePath = `/iloveimg-compressed/${imageName}`;
        try {
          const response = await fetch(imagePath, { method: 'HEAD' });
          if (response.ok) {
            validImages.push(imagePath);
          }
        } catch (error) {
          // Imagem não existe, continuar
          console.log(`Imagem não encontrada: ${imagePath}`);
        }
      }

      if (validImages.length > 0) {
        setLoadedImages(validImages);
      } else {
        // Se nenhuma imagem for encontrada, usar as padrão
        setLoadedImages(defaultImages);
      }
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      setLoadedImages(defaultImages);
    }
  };

  // Usar fotos personalizadas se disponíveis, senão usar as carregadas da pasta
  const backgroundImages = customPhotos.length > 0 ? customPhotos : loadedImages;

  React.useEffect(() => {
    // Carregar imagens da pasta
    loadImagesFromFolder();

    // Carregar fotos personalizadas do localStorage
    const loadCustomPhotos = () => {
      const savedPhotos = localStorage.getItem('weddingPhotos');
      if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        const activePhotos = photos
          .filter((photo: any) => photo.isActive)
          .map((photo: any) => photo.url);
        setCustomPhotos(activePhotos);
      }
    };

    loadCustomPhotos();

    // Escutar mudanças nas fotos
    const handlePhotosUpdate = () => {
      loadCustomPhotos();
    };

    window.addEventListener('photosUpdated', handlePhotosUpdate);
    return () => window.removeEventListener('photosUpdated', handlePhotosUpdate);
  }, []);

  React.useEffect(() => {
    if (backgroundImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Função para pré-carregar imagens
  React.useEffect(() => {
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [backgroundImages]);

  return (
    <section id="inicio" className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center relative overflow-hidden">
      {/* Slideshow de Imagens de Fundo */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-80' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`
            }}
            onError={(e) => {
              console.error(`Erro ao carregar imagem: ${image}`);
              // Remover imagem com erro da lista
              setLoadedImages(prev => prev.filter(img => img !== image));
            }}
          />
        ))}
      </div>
      
      {/* Overlay gradiente para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 to-rose-100/60"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-serif text-sage-600 mb-6 animate-fade-in">
            Kriscia <span className="text-primary-500">&</span> Iverson
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-600 mb-8 font-light">
            Estamos nos casando e queremos você conosco!
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 mb-12">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Calendar className="w-6 h-6 text-primary-500" />
              <span className="text-lg font-medium text-sage-600">27 de Junho, 2026</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-6 h-6 text-primary-500" />
              <span className="text-lg font-medium text-sage-600">Barbacena, MG</span>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-200">
            <h2 className="text-3xl font-serif text-sage-600 mb-4">Contagem Regressiva</h2>
            <CountdownTimer />
          </div>
          
          {/* Indicadores do Slideshow */}
          {backgroundImages.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-primary-500 scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Indicador de fotos personalizadas */}
          {customPhotos.length > 0 && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                ✨ Usando suas fotos personalizadas ({customPhotos.length})
              </span>
            </div>
          )}
          
          {/* Indicador de fotos carregadas da pasta */}
          {customPhotos.length === 0 && loadedImages.length > 0 && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                📁 Carregadas {loadedImages.length} fotos da pasta
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const targetDate = new Date('2026-06-27T16:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{timeLeft.days}</div>
        <div className="text-sm text-stone-600 uppercase tracking-wide">Dias</div>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{timeLeft.hours}</div>
        <div className="text-sm text-stone-600 uppercase tracking-wide">Horas</div>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{timeLeft.minutes}</div>
        <div className="text-sm text-stone-600 uppercase tracking-wide">Minutos</div>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{timeLeft.seconds}</div>
        <div className="text-sm text-stone-600 uppercase tracking-wide">Segundos</div>
      </div>
    </div>
  );
}

