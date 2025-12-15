import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

export default function Venues() {
  const venues = [
    {
      type: 'Cerimônia Religiosa',
      name: 'Memorial da Beata Isabel Cristina',
      address: 'R. Vig. Brito, 26 - Centro, Barbacena - MG',
      time: '17:00',
      phone: '(32) 3331-0270',
      mapUrl: 'https://g.co/kgs/65sRtKA',
      image: '/Fotos localizacao/unnamed (1).webp'
    },
    {
      type: 'Festa de Casamento',
      name: 'Benevenuto Deguste Bar e Restaurante',
      address: 'R. Tomaz Gonzaga, 78 - Boa Morte, Barbacena - MG',
      time: '19:00',
      phone: '(32) 3333-7237',
      mapUrl: 'https://share.google/gSFXhaDkfuHmGK4I0',
      image: '/Fotos localizacao/unnamed.webp'  
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Locais do Evento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {venues.map((venue, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={venue.image} alt={venue.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{venue.type}</h3>
                <p className="text-xl font-medium text-gray-700 mb-4">{venue.name}</p>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <p>{venue.address}</p>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                  <p>{venue.time}</p>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Phone className="w-5 h-5 mr-2" />
                  <p>{venue.phone}</p>
                </div>
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Ver no Mapa
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
