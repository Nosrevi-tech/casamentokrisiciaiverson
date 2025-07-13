import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

export default function Venues() {
  const venues = [
    {
      type: 'Cerimônia Religiosa',
      name: 'Memorial da Beata Isabel Cristina',
      address: 'R. Vig. Brito, 26 - Centro, Barbacena - MG, 36200-004',
      time: '17:00',
      phone: '(32) 3331-0270',
      mapUrl: 'https://g.co/kgs/65sRtKA',
      image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqC_dTMb3fHAnaclbOkRZDlvzfPQ63VxrQyEd1JhZx7fEtJGFYgDCpx2klu7PW0UXcQkXi96aUWg3CUkPSPg4di5mW47c2vBfbSviQXU5sY9WfhjV98pMrZdFIulaaEqij5uloD=s680-w680-h510-rw'
    },
    {
      type: 'Festa de Casamento',
      name: 'Espaço Villa Fontana',
      address: 'Av. Paulista, 456 - Jardim Paulista, São Paulo - SP',
      time: '19:00',
      phone: '(11) 2345-6789',
      mapUrl: 'https://g.co/kgs/65sRtKA',
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    }
  ];

  return (
    <section id="enderecos" className="py-20 bg-gradient-to-br from-rose-50 to-rose-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Onde & Quando</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Todos os detalhes sobre os locais da nossa celebração
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {venues.map((venue, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={venue.image} 
                  alt={venue.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {venue.type}
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-serif text-sage-600 mb-4">{venue.name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <span className="text-stone-600">{venue.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-stone-600">{venue.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-stone-600">{venue.phone}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-rose-200">
                  <a 
                    href={venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>Ver no Mapa</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-sage-600 mb-6 text-center">Informações Importantes</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-sage-600 mb-4">Dress Code</h4>
              <p className="text-stone-600 mb-4">
                Traje social completo. Cores claras são bem-vindas, mas evitem branco total (reservado para a noiva).
              </p>
              
              <h4 className="text-lg font-semibold text-sage-600 mb-4">Estacionamento</h4>
              <p className="text-stone-600">
                Ambos os locais possuem estacionamento gratuito para os convidados.
              </p>
            </div>
            
            <div>
              
              
          
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
