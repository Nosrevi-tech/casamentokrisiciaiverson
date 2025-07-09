import React, { useState } from 'react';
import { Send, Users, Utensils, Music } from 'lucide-react';

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    attending: '',
    dietaryRestrictions: '',
    songRequest: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create RSVP entry with unique ID and timestamp
    const rsvpEntry = {
      id: Date.now().toString(),
      ...formData,
      submittedAt: new Date().toISOString()
    };

    // Get existing RSVP data from localStorage
    const existingData = localStorage.getItem('weddingRSVP');
    const rsvpList = existingData ? JSON.parse(existingData) : [];
    
    // Add new entry
    rsvpList.push(rsvpEntry);
    
    // Save back to localStorage
    localStorage.setItem('weddingRSVP', JSON.stringify(rsvpList));
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        guests: '1',
        attending: '',
        dietaryRestrictions: '',
        songRequest: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <section id="presenca" className="py-20 bg-gradient-to-br from-rose-50 to-rose-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="bg-green-100 p-4 rounded-full inline-flex mb-6">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-serif text-sage-600 mb-4">Confirmação Recebida!</h2>
              <p className="text-lg text-stone-600 mb-6">
                Obrigado por confirmar sua presença. Recebemos sua resposta e estamos muito felizes em tê-lo(a) conosco!
              </p>
              <div className="bg-rose-50 p-4 rounded-lg">
                <p className="text-primary-600 font-medium">
                  Sua confirmação foi salva com sucesso. Aguardamos você no nosso grande dia! 💕
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="presenca" className="py-20 bg-gradient-to-br from-rose-50 to-rose-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Confirme sua Presença</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Sua presença é fundamental para tornar nosso dia ainda mais especial. 
            Por favor, confirme até 15 de maio.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-stone-700 mb-2">
                    Número de Acompanhantes
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="1">Apenas eu</option>
                    <option value="2">Eu + 1 acompanhante</option>
                    <option value="3">Eu + 2 acompanhantes</option>
                    <option value="4">Eu + 3 acompanhantes</option>
                    <option value="5">Eu + 4 acompanhantes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-4">
                  Você irá comparecer? *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={handleChange}
                      className="mr-2 text-primary-500 focus:ring-primary-500"
                      required
                    />
                    <span className="text-stone-700">Sim, estarei presente! 🎉</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={handleChange}
                      className="mr-2 text-primary-500 focus:ring-primary-500"
                      required
                    />
                    <span className="text-stone-700">Infelizmente não poderei ir 😢</span>
                  </label>
                </div>
              </div>

              {formData.attending === 'yes' && (
                <div className="space-y-6 bg-rose-50 p-6 rounded-lg">
                  <div>
                    <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-stone-700 mb-2">
                      <Utensils className="inline w-4 h-4 mr-1" />
                      Restrições Alimentares
                    </label>
                    <textarea
                      id="dietaryRestrictions"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Alguma alergia ou restrição alimentar que devemos saber?"
                    />
                  </div>

                  <div>
                    <label htmlFor="songRequest" className="block text-sm font-medium text-stone-700 mb-2">
                      <Music className="inline w-4 h-4 mr-1" />
                      Sugestão Musical
                    </label>
                    <input
                      type="text"
                      id="songRequest"
                      name="songRequest"
                      value={formData.songRequest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Qual música não pode faltar na nossa festa?"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                  Mensagem Especial
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Deixe uma mensagem carinhosa para os noivos..."
                />
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-rose-500 text-white px-12 py-4 rounded-full font-semibold hover:from-primary-600 hover:to-rose-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  <span>Confirmar Presença</span>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Users className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Prazo de Confirmação</h3>
              <p className="text-stone-600">Até 15 de maio de 2024</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Utensils className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Jantar Completo</h3>
              <p className="text-stone-600">Entrada, prato principal e sobremesa</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Music className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Festa até 2h</h3>
              <p className="text-stone-600">Música, dança e muita diversão</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}