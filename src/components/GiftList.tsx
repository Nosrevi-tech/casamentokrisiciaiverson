import React, { useState, useEffect } from 'react';
import { Gift, ShoppingCart, Heart, CheckCircle } from 'lucide-react';
import PixPayment from './PixPayment';

export default function GiftList() {
  const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [purchasedGifts, setPurchasedGifts] = useState<number[]>([]);
  const [payerInfo, setPayerInfo] = useState({
    name: '',
    email: ''
  });
  const [messageInfo, setMessageInfo] = useState({
    senderName: '',
    representing: '',
    message: ''
  });
  const [showPayerForm, setShowPayerForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);

  useEffect(() => {
    // Carregar presentes já comprados
    const purchased = JSON.parse(localStorage.getItem('purchasedGifts') || '[]');
    setPurchasedGifts(purchased);
    
    // Carregar produtos personalizados se existirem
    const customProducts = JSON.parse(localStorage.getItem('weddingProducts') || '[]');
    if (customProducts.length > 0) {
      updateGiftCategoriesFromProducts(customProducts);
    }
  }, []);

  const updateGiftCategoriesFromProducts = (products: any[]) => {
    // Agrupar produtos por categoria
    const categorizedProducts = products.reduce((acc: any, product: any) => {
      if (!product.active) return acc; // Só incluir produtos ativos
      
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      
      acc[product.category].push({
        id: product.id,
        name: product.name,
        price: `R$ ${product.price.toLocaleString('pt-BR')}`,
        purchased: false
      });
      
      return acc;
    }, {});

    // Atualizar giftCategories com produtos personalizados
    const updatedCategories = Object.keys(categorizedProducts).map(categoryName => ({
      title: categoryName,
      icon: <Gift className="w-6 h-6" />, // Ícone padrão
      items: categorizedProducts[categoryName]
    }));

    // Se houver produtos personalizados, usar eles; senão, manter os padrões
    if (updatedCategories.length > 0) {
      // Substituir as categorias padrão pelas personalizadas
      giftCategories.splice(0, giftCategories.length, ...updatedCategories);
    }
  };

  const giftCategories = [
    {
      title: 'Cozinha',
      icon: <Gift className="w-6 h-6" />,
      items: [
        { id: 1, name: 'Conjunto de Panelas Antiaderentes', price: 'R$ 299', purchased: false },
        { id: 2, name: 'Liquidificador Premium', price: 'R$ 189', purchased: true },
        { id: 3, name: 'Cafeteira Elétrica', price: 'R$ 149', purchased: false },
        { id: 4, name: 'Conjunto de Facas', price: 'R$ 199', purchased: false },
        { id: 5, name: 'Micro-ondas', price: 'R$ 399', purchased: false },
        { id: 6, name: 'Batedeira', price: 'R$ 229', purchased: false },
      ]
    },
    {
      title: 'Casa',
      icon: <Heart className="w-6 h-6" />,
      items: [
        { id: 7, name: 'Jogo de Lençóis Casal', price: 'R$ 159', purchased: false },
        { id: 8, name: 'Conjunto de Toalhas', price: 'R$ 89', purchased: false },
        { id: 9, name: 'Aspirador de Pó', price: 'R$ 299', purchased: true },
        { id: 10, name: 'Ferro de Passar', price: 'R$ 129', purchased: false },
        { id: 11, name: 'Conjunto de Almofadas', price: 'R$ 119', purchased: false },
        { id: 12, name: 'Espelho Decorativo', price: 'R$ 179', purchased: false },
      ]
    },
    {
      title: 'Eletrônicos',
      icon: <ShoppingCart className="w-6 h-6" />,
      items: [
        { id: 13, name: 'Smart TV 43"', price: 'R$ 1.299', purchased: false },
        { id: 14, name: 'Caixa de Som Bluetooth', price: 'R$ 199', purchased: false },
        { id: 15, name: 'Air Fryer', price: 'R$ 349', purchased: true },
        { id: 16, name: 'Notebook', price: 'R$ 2.499', purchased: false },
        { id: 17, name: 'Tablet', price: 'R$ 899', purchased: false },
        { id: 18, name: 'Smartwatch', price: 'R$ 699', purchased: false },
      ]
    }
  ];

  const handleGiftSelect = (giftId: number) => {
    const isPurchased = purchasedGifts.includes(giftId);
    if (isPurchased) return;

    setSelectedGifts(prev => 
      prev.includes(giftId) 
        ? prev.filter(id => id !== giftId)
        : [...prev, giftId]
    );
  };

  const getTotalSelectedValue = () => {
    let total = 0;
    giftCategories.forEach(category => {
      category.items.forEach(item => {
        if (selectedGifts.includes(item.id)) {
          total += parseInt(item.price.replace('R$ ', '').replace('.', ''));
        }
      });
    });
    return total;
  };

  const getSelectedGiftsDetails = () => {
    const gifts: Array<{id: number, name: string, price: string}> = [];
    giftCategories.forEach(category => {
      category.items.forEach(item => {
        if (selectedGifts.includes(item.id)) {
          gifts.push(item);
        }
      });
    });
    return gifts;
  };

  const handlePresentearAgora = () => {
    if (selectedGifts.length > 0) {
      setShowPayerForm(true);
    }
  };

  const handlePayerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payerInfo.name && payerInfo.email) {
      setShowPayerForm(false);
      setShowMessageForm(true);
    }
  };

  const handleMessageFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInfo.senderName && messageInfo.message) {
      setShowMessageForm(false);
      setShowPixPayment(true);
    }
  };

  const handleCloseAll = () => {
    setShowPixPayment(false);
    setShowMessageForm(false);
    setShowPayerForm(false);
    setSelectedGifts([]);
    setPayerInfo({ name: '', email: '' });
    setMessageInfo({ senderName: '', representing: '', message: '' });
  };

  const isGiftPurchased = (giftId: number) => {
    return purchasedGifts.includes(giftId);
  };

  return (
    <section id="presentes" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Lista de Presentes</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Sua presença é o maior presente, mas se quiser nos abençoar com um mimo, 
            preparamos uma lista especial
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {giftCategories.map((category, index) => (
              <div key={index} className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-primary-500 p-3 rounded-full text-white">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-serif text-sage-600">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item) => {
                    const isPurchased = isGiftPurchased(item.id);
                    const isSelected = selectedGifts.includes(item.id);
                    
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isPurchased
                            ? 'border-stone-300 bg-stone-100 opacity-50' 
                            : isSelected
                            ? 'border-primary-500 bg-rose-50'
                            : 'border-rose-200 bg-white hover:border-primary-300'
                        }`}
                        onClick={() => handleGiftSelect(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sage-600">{item.name}</h4>
                            <p className="text-primary-500 font-semibold">{item.price}</p>
                          </div>
                          <div className="ml-4">
                            {isPurchased ? (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">Comprado</span>
                              </div>
                            ) : isSelected ? (
                              <CheckCircle className="w-6 h-6 text-primary-500" />
                            ) : (
                              <div className="w-6 h-6 border-2 border-stone-300 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedGifts.length > 0 && (
            <div className="bg-gradient-to-r from-primary-500 to-rose-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Presentes Selecionados</h3>
                  <p className="text-rose-100">
                    {selectedGifts.length} item{selectedGifts.length !== 1 ? 's' : ''} selecionado{selectedGifts.length !== 1 ? 's' : ''} • 
                    Total: R$ {getTotalSelectedValue().toLocaleString('pt-BR')}
                  </p>
                </div>
                <button 
                  onClick={handlePresentearAgora}
                  className="mt-4 md:mt-0 bg-white text-primary-500 px-8 py-3 rounded-full font-semibold hover:bg-rose-50 transition-colors"
                >
                  Presentear Agora
                </button>
              </div>
            </div>
          )}

          <div className="mt-12 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-serif text-sage-600 mb-4">Outras Opções</h3>
            <p className="text-stone-600 mb-6">
              Preferem fazer um PIX ou contribuir de outra forma? Também ficamos muito gratos!
            </p>
            
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <h4 className="font-semibold text-sage-600 mb-2">Dados para PIX:</h4>
              <p className="text-stone-600 mb-1">Nome: Kriscia e Iverson</p>
              <p className="text-stone-600 mb-1">Chave PIX: iverson.paiva11@gmail.com</p>
              <p className="text-stone-600">Banco: Qualquer banco</p>
            </div>
          </div>
        </div>

        {/* Modal de Informações do Pagador */}
        {showPayerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-serif text-sage-600 mb-4">Informações para Pagamento</h3>
              <form onSubmit={handlePayerFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={payerInfo.name}
                    onChange={(e) => setPayerInfo({...payerInfo, name: e.target.value})}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={payerInfo.email}
                    onChange={(e) => setPayerInfo({...payerInfo, email: e.target.value})}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPayerForm(false)}
                    className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Mensagem de Felicitações */}
        {showMessageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-serif text-sage-600 mb-4">Mensagem de Felicitações</h3>
              <p className="text-stone-600 mb-6 text-sm">
                Deixe uma mensagem carinhosa para os noivos junto com seu presente! 💕
              </p>
              <form onSubmit={handleMessageFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={messageInfo.senderName}
                    onChange={(e) => setMessageInfo({...messageInfo, senderName: e.target.value})}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Como você gostaria de assinar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Representando (opcional)
                  </label>
                  <input
                    type="text"
                    value={messageInfo.representing}
                    onChange={(e) => setMessageInfo({...messageInfo, representing: e.target.value})}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: Família Silva, Amigos da faculdade..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Mensagem de Felicitações *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={messageInfo.message}
                    onChange={(e) => setMessageInfo({...messageInfo, message: e.target.value})}
                    className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Escreva uma mensagem carinhosa para Kriscia e Iverson..."
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Finalizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Pagamento PIX */}
        <PixPayment
          isOpen={showPixPayment}
          onClose={handleCloseAll}
          totalAmount={getTotalSelectedValue()}
          selectedGifts={getSelectedGiftsDetails()}
          payerInfo={payerInfo}
          messageInfo={messageInfo}
        />
      </div>
    </section>
  );
}