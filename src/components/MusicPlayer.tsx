import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Configurar áudio
    audio.volume = volume;
    audio.loop = true;

    // Auto-play após interação do usuário
    const handleFirstInteraction = () => {
      if (audio && !isPlaying) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      {/* Áudio invisível */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        <source src="/wedding-music.mp3" type="audio/mpeg" />
        <source src="/wedding-music.wav" type="audio/wav" />
        <source src="/wedding-music.ogg" type="audio/ogg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Controles flutuantes */}
      {showControls && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-rose-200 p-4">
            <div className="flex items-center space-x-4">
              {/* Botão Play/Pause */}
              <button
                onClick={togglePlay}
                className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-colors shadow-lg"
                title={isPlaying ? 'Pausar música' : 'Reproduzir música'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              {/* Controle de Volume */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-stone-600 hover:text-primary-500 transition-colors"
                  title={isMuted ? 'Ativar som' : 'Silenciar'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer slider"
                  title="Controle de volume"
                />
              </div>

              {/* Botão para esconder controles */}
              <button
                onClick={() => setShowControls(false)}
                className="text-stone-400 hover:text-stone-600 transition-colors text-sm"
                title="Esconder controles"
              >
                ✕
              </button>
            </div>

            {/* Informações da música */}
            <div className="mt-3 text-center">
              <p className="text-xs text-stone-600 font-medium">🎵 Música do Casamento</p>
              <p className="text-xs text-stone-500">Kriscia & Iverson</p>
            </div>
          </div>
        </div>
      )}

      {/* Botão para mostrar controles quando escondidos */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-xl transition-colors"
          title="Mostrar controles de música"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      )}

      {/* Estilos para o slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e8b8b6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e8b8b6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}