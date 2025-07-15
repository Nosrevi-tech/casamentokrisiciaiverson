import React, { useState } from 'react';
import { Users, Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Tentar salvar no Netlify Database primeiro
      const response = await fetch('/.netlify/functions/save-rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          attending: '',
          message: ''
        });
      } else {
        throw new Error('Erro ao salvar confirmação');
      }
    } catch (error) {
      console.error('Erro:', error);
      setSubmitStatus('error');
      setErrorMessage('Erro ao enviar confirmação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="presenca" className="py-20 bg-gradient-to-br from-rose-50 to-rose-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Confirme sua Presença</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Sua presença é fundamental para tornar nosso dia ainda mais especial. 
            Por favor, confirme sua presença através do formulário abaixo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Formulário Principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex justify-center mb-8">
              <div className="bg-primary-500 p-6 rounded-full">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-serif text-sage-600 mb-8 text-center">
              Formulário de Confirmação
            </h3>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700">
                  Confirmação enviada com sucesso! Obrigado por confirmar sua presença.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{errorMessage}</p>
              </div>
            )}
            
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
                    Email *
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="attending" className="block text-sm font-medium text-stone-700 mb-2">
                    Confirmação de Presença *
                  </label>
                  <select
                    id="attending"
                    name="attending"
                    required
                    value={formData.attending}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="yes">Sim, estarei presente</option>
                    <option value="no">Não poderei comparecer</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                  Mensagem (Opcional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Deixe uma mensagem carinhosa para os noivos..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-500 to-rose-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-primary-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
              </button>
            </form>
          </div>

          {/* Cards Informativos */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Calendar className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Prazo de Confirmação</h3>
              <p className="text-stone-600">Até 15 de maio de 2026</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Users className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Confirmação Individual</h3>
              <p className="text-stone-600">Cada pessoa deve confirmar individualmente</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="bg-rose-100 p-3 rounded-full inline-flex mb-4">
                <Clock className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-sage-600 mb-2">Festa até 2h</h3>
              <p className="text-stone-600">Música, dança e muita diversão</p>
            </div>
          </div>

          {/* Informações Importantes */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-serif text-sage-600 mb-6 text-center">Informações Importantes</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-sage-600 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-500" />
                  Horários
                </h4>
                <div className="space-y-2 text-stone-600">
                  <p><strong>Cerimônia:</strong> 17:00</p>
                  <p><strong>Festa:</strong> 19:00 às 02:00</p>
                  <p><strong>Confirmação até:</strong> 15/05/2026</p>
                </div>
                
                <h4 className="text-lg font-semibold text-sage-600 mb-4 mt-6">Dress Code</h4>
                <p className="text-stone-600">
                  Traje social completo. Cores claras são bem-vindas, mas evitem branco total (reservado para a noiva).
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-sage-600 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-500" />
                  Locais
                </h4>
                <div className="space-y-4 text-stone-600">
                  <div>
                    <p><strong>Cerimônia:</strong></p>
                    <p className="text-sm">Memorial da Beata Isabel Cristina</p>
                    <p className="text-sm">Barbacena - MG</p>
                  </div>
                  <div>
                    <p><strong>Festa:</strong></p>
                    <p className="text-sm">Espaço Villa Fontana</p>
                    <p className="text-sm">Barbacena - MG</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-sage-600 mb-4 mt-6">Estacionamento</h4>
                <p className="text-stone-600">
                  Ambos os locais possuem estacionamento gratuito para os convidados.
                </p>
              </div>
            </div>
          </div>

          {/* Dúvidas */}
          <div className="mt-8 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 text-center">
            <h4 className="font-semibold text-sage-600 mb-2">Dúvidas?</h4>
            <p className="text-stone-600 mb-4">
              Entre em contato conosco pelos telefones:
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-6 text-stone-600">
              <p><strong>Kriscia:</strong> (32) 98419-5866</p>
              <p><strong>Iverson:</strong> (32) 98430-3090</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}