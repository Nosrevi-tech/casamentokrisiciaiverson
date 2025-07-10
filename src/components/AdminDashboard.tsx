import React, { useState, useEffect } from 'react';
import ProductManager from './ProductManager';
import CheckoutDashboard from './CheckoutDashboard';
import PendingPayments from './PendingPayments';
import MercadoPagoSettings from './MercadoPagoSettings';
import PhotoUpload from './PhotoUpload';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Download, 
  Search,
  Filter,
  LogOut,
  Trash2,
  Eye
} from 'lucide-react';

interface RSVPData {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  attending: string;
  dietaryRestrictions: string;
  songRequest: string;
  message: string;
  submittedAt: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

interface GiftMessage {
  id: string;
  senderName: string;
  representing: string;
  message: string;
  payerName: string;
  payerEmail: string;
  gifts: Array<{
    id: number;
    name: string;
    price: string;
  }>;
  totalAmount: number;
  paymentId: string;
  submittedAt: string;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([]);
  const [giftMessages, setGiftMessages] = useState<GiftMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<RSVPData | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<GiftMessage | null>(null);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'messages' | 'products' | 'checkout' | 'pending' | 'settings' | 'photos'>('rsvp');

  useEffect(() => {
    loadRSVPData();
    loadGiftMessages();
  }, []);

  const loadRSVPData = () => {
    const savedData = localStorage.getItem('weddingRSVP');
    if (savedData) {
      setRsvpData(JSON.parse(savedData));
    }
  };

  const loadGiftMessages = () => {
    const savedMessages = localStorage.getItem('giftMessages');
    if (savedMessages) {
      setGiftMessages(JSON.parse(savedMessages));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    onLogout();
  };

  const deleteEntry = (id: string) => {
    const updatedData = rsvpData.filter(entry => entry.id !== id);
    setRsvpData(updatedData);
    localStorage.setItem('weddingRSVP', JSON.stringify(updatedData));
  };

  const deleteMessage = (id: string) => {
    const updatedMessages = giftMessages.filter(message => message.id !== id);
    setGiftMessages(updatedMessages);
    localStorage.setItem('giftMessages', JSON.stringify(updatedMessages));
  };

  const exportToCSV = () => {
    if (activeTab === 'rsvp') {
      const headers = [
        'Nome',
        'Email',
        'Telefone',
        'Acompanhantes',
        'Comparecerá',
        'Restrições Alimentares',
        'Sugestão Musical',
        'Mensagem',
        'Data de Envio'
      ];

      const csvContent = [
        headers.join(','),
        ...filteredData.map(entry => [
          entry.name,
          entry.email,
          entry.phone,
          entry.guests,
          entry.attending === 'yes' ? 'Sim' : 'Não',
          entry.dietaryRestrictions || 'Nenhuma',
          entry.songRequest || 'Nenhuma',
          entry.message || 'Nenhuma',
          new Date(entry.submittedAt).toLocaleString('pt-BR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'lista-presenca-casamento.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = [
        'Remetente',
        'Representando',
        'Mensagem',
        'Pagador',
        'Email',
        'Presentes',
        'Valor Total',
        'ID Pagamento',
        'Data'
      ];

      const csvContent = [
        headers.join(','),
        ...giftMessages.map(message => [
          message.senderName,
          message.representing || 'N/A',
          `"${message.message}"`,
          message.payerName,
          message.payerEmail,
          message.gifts.map(g => g.name).join('; '),
          `R$ ${message.totalAmount.toLocaleString('pt-BR')}`,
          message.paymentId,
          new Date(message.submittedAt).toLocaleString('pt-BR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'mensagens-presentes-casamento.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredData = rsvpData.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'attending' && entry.attending === 'yes') ||
                         (filterStatus === 'not-attending' && entry.attending === 'no');
    
    return matchesSearch && matchesFilter;
  });

  const filteredMessages = giftMessages.filter(message => {
    return message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           message.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           message.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: rsvpData.length,
    attending: rsvpData.filter(entry => entry.attending === 'yes').length,
    notAttending: rsvpData.filter(entry => entry.attending === 'no').length,
    totalGuests: rsvpData
      .filter(entry => entry.attending === 'yes')
      .reduce((sum, entry) => sum + parseInt(entry.guests), 0)
  };

  const messageStats = {
    totalMessages: giftMessages.length,
    totalGifts: giftMessages.reduce((sum, message) => sum + message.gifts.length, 0),
    totalValue: giftMessages.reduce((sum, message) => sum + message.totalAmount, 0)
  };

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-serif text-sage-600">Painel Administrativo</h1>
              <p className="text-stone-600">Gerenciamento do Casamento</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-rose-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('rsvp')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rsvp'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Confirmações de Presença ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Mensagens de Presentes ({messageStats.totalMessages})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Gerenciar Produtos
              </button>
              <button
                onClick={() => setActiveTab('checkout')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'checkout'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Dashboard Pagamentos
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Pagamentos Pendentes
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Configurações MP
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'photos'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Gerenciar Fotos
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'rsvp' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Total de Respostas</p>
                  <p className="text-2xl font-bold text-sage-600">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Confirmados</p>
                  <p className="text-2xl font-bold text-sage-600">{stats.attending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Não Comparecerão</p>
                  <p className="text-2xl font-bold text-sage-600">{stats.notAttending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-primary-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Total de Convidados</p>
                  <p className="text-2xl font-bold text-sage-600">{stats.totalGuests}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Total de Mensagens</p>
                  <p className="text-2xl font-bold text-sage-600">{messageStats.totalMessages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Presentes Recebidos</p>
                  <p className="text-2xl font-bold text-sage-600">{messageStats.totalGifts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Valor Total</p>
                  <p className="text-2xl font-bold text-sage-600">R$ {messageStats.totalValue.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'rsvp' ? "Buscar por nome ou email..." : "Buscar mensagens..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {activeTab === 'rsvp' && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                  >
                    <option value="all">Todos</option>
                    <option value="attending">Confirmados</option>
                    <option value="not-attending">Não Comparecerão</option>
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'rsvp' ? (
          /* RSVP Table */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-rose-200">
                <thead className="bg-rose-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Convidado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Acompanhantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-rose-200">
                  {filteredData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-rose-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-sage-600">{entry.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-sage-600">{entry.email}</div>
                        <div className="text-sm text-stone-500">{entry.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.attending === 'yes' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.attending === 'yes' ? 'Confirmado' : 'Não comparecerá'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-600">
                        {entry.guests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                        {new Date(entry.submittedAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-500">Nenhuma confirmação encontrada</p>
              </div>
            )}
          </div>
        ) : (
          /* Gift Messages Grid */
          <div className="grid gap-6">
            {filteredMessages.map((message) => (
              <div key={message.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-sage-600">{message.senderName}</h3>
                      {message.representing && (
                        <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                          {message.representing}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 italic mb-3">"{message.message}"</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {message.gifts.map((gift, index) => (
                        <span key={index} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                          {gift.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-stone-500">
                      <span>Valor: R$ {message.totalAmount.toLocaleString('pt-BR')}</span>
                      <span>{new Date(message.submittedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-500">Nenhuma mensagem encontrada</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && <ProductManager />}
        
        {activeTab === 'checkout' && <CheckoutDashboard />}
        
        {activeTab === 'pending' && <PendingPayments />}
        
        {activeTab === 'settings' && <MercadoPagoSettings />}
        
        {activeTab === 'photos' && <PhotoUpload />}
      </div>

      {/* Modal for viewing details */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-sage-600">Detalhes da Confirmação</h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Nome</label>
                  <p className="text-sage-600">{selectedEntry.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Email</label>
                    <p className="text-sage-600">{selectedEntry.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Telefone</label>
                    <p className="text-sage-600">{selectedEntry.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Status</label>
                    <p className="text-sage-600">
                      {selectedEntry.attending === 'yes' ? 'Confirmado' : 'Não comparecerá'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Acompanhantes</label>
                    <p className="text-sage-600">{selectedEntry.guests}</p>
                  </div>
                </div>

                {selectedEntry.dietaryRestrictions && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Restrições Alimentares</label>
                    <p className="text-sage-600">{selectedEntry.dietaryRestrictions}</p>
                  </div>
                )}

                {selectedEntry.songRequest && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Sugestão Musical</label>
                    <p className="text-sage-600">{selectedEntry.songRequest}</p>
                  </div>
                )}

                {selectedEntry.message && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Mensagem</label>
                    <p className="text-sage-600">{selectedEntry.message}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-stone-700">Data de Envio</label>
                  <p className="text-sage-600">
                    {new Date(selectedEntry.submittedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing gift message details */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-sage-600">Detalhes da Mensagem</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Remetente</label>
                  <p className="text-sage-600">{selectedMessage.senderName}</p>
                </div>

                {selectedMessage.representing && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Representando</label>
                    <p className="text-sage-600">{selectedMessage.representing}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-stone-700">Mensagem</label>
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <p className="text-sage-600 italic">"{selectedMessage.message}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Pagador</label>
                    <p className="text-sage-600">{selectedMessage.payerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Email</label>
                    <p className="text-sage-600">{selectedMessage.payerEmail}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Presentes</label>
                  <div className="space-y-2">
                    {selectedMessage.gifts.map((gift, index) => (
                      <div key={index} className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                        <span className="text-sage-600">{gift.name}</span>
                        <span className="font-medium text-primary-500">{gift.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Valor Total</label>
                    <p className="text-2xl font-bold text-primary-500">
                      R$ {selectedMessage.totalAmount.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">ID do Pagamento</label>
                    <p className="text-sage-600 text-sm">{selectedMessage.paymentId}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Data de Envio</label>
                  <p className="text-sage-600">
                    {new Date(selectedMessage.submittedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}