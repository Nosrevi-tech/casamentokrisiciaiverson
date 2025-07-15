import React, { useState, useEffect } from 'react';
import PhotoUpload from './PhotoUpload';
import rsvpService, { RSVPData } from '../services/rsvpService';
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
  Eye,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';

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
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [giftMessages, setGiftMessages] = useState<GiftMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'yes' | 'no'>('all');
  const [selectedRsvp, setSelectedRsvp] = useState<RSVPData | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<GiftMessage | null>(null);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'messages' | 'photos'>('rsvp');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar RSVPs
      const rsvpResult = await rsvpService.getRSVPs();
      if (rsvpResult.success && rsvpResult.data) {
        setRsvps(rsvpResult.data);
      }

      // Carregar mensagens de presentes
      const savedMessages = localStorage.getItem('giftMessages');
      if (savedMessages) {
        setGiftMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    onLogout();
  };

  const deleteRsvp = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta confirmação?')) {
      // Para localStorage, filtrar e salvar
      const updatedRsvps = rsvps.filter(rsvp => rsvp.id !== id);
      setRsvps(updatedRsvps);
      
      // Se estiver usando localStorage como fallback
      if (!rsvpService.isNetlifyEnvironment()) {
        localStorage.setItem('weddingRSVP', JSON.stringify(updatedRsvps));
      }
    }
  };

  const deleteMessage = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
      const updatedMessages = giftMessages.filter(message => message.id !== id);
      setGiftMessages(updatedMessages);
      localStorage.setItem('giftMessages', JSON.stringify(updatedMessages));
    }
  };

  const exportRsvpToCSV = () => {
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Confirmação',
      'Mensagem',
      'Data de Envio'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRsvps.map(rsvp => [
        rsvp.name,
        rsvp.email,
        rsvp.phone,
        rsvp.attending === 'yes' ? 'Sim' : 'Não',
        `"${rsvp.message || ''}"`,
        new Date(rsvp.submittedAt || '').toLocaleString('pt-BR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'confirmacoes-presenca-casamento.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMessagesToCSV = () => {
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
  };

  const filteredRsvps = rsvps.filter(rsvp => {
    const matchesSearch = rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rsvp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || rsvp.attending === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredMessages = giftMessages.filter(message => {
    return message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           message.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           message.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const rsvpStats = {
    total: rsvps.length,
    attending: rsvps.filter(rsvp => rsvp.attending === 'yes').length,
    notAttending: rsvps.filter(rsvp => rsvp.attending === 'no').length
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
                Confirmações de Presença ({rsvpStats.total})
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
        {activeTab === 'rsvp' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Total de Confirmações</p>
                  <p className="text-2xl font-bold text-sage-600">{rsvpStats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-stone-600">Confirmaram Presença</p>
                  <p className="text-2xl font-bold text-sage-600">{rsvpStats.attending}</p>
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
                  <p className="text-2xl font-bold text-sage-600">{rsvpStats.notAttending}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
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

        {/* Content based on active tab */}
        {activeTab === 'rsvp' ? (
          <>
            {/* Filters and Search for RSVPs */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Buscar confirmações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'yes' | 'no')}
                      className="pl-10 pr-8 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">Todos</option>
                      <option value="yes">Confirmaram</option>
                      <option value="no">Não Comparecerão</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={exportRsvpToCSV}
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Database Status Indicator */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                rsvpService.isNetlifyEnvironment() 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {rsvpService.isNetlifyEnvironment() 
                  ? '🔒 Dados salvos no Netlify Database' 
                  : '💾 Modo desenvolvimento (localStorage)'}
              </div>
            </div>

            {/* RSVP Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-stone-500 mt-4">Carregando confirmações...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredRsvps.map((rsvp) => (
                  <div key={rsvp.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-sage-600">{rsvp.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rsvp.attending === 'yes' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {rsvp.attending === 'yes' ? 'Confirmado' : 'Não Comparecerá'}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-stone-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{rsvp.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{rsvp.phone}</span>
                          </div>
                          {rsvp.message && (
                            <div className="flex items-start space-x-2 mt-2">
                              <MessageSquare className="w-4 h-4 mt-0.5" />
                              <span className="italic">"{rsvp.message}"</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 text-xs text-stone-500">
                          Enviado em: {new Date(rsvp.submittedAt || '').toLocaleString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedRsvp(rsvp)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRsvp(rsvp.id!)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredRsvps.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-stone-500">Nenhuma confirmação encontrada</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : activeTab === 'messages' ? (
          <>
            {/* Filters and Search for Messages */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Buscar mensagens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <button
                  onClick={exportMessagesToCSV}
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Gift Messages Grid */}
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
          </>
        ) : null}

        {activeTab === 'photos' && <PhotoUpload />}
      </div>

      {/* Modal for viewing RSVP details */}
      {selectedRsvp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-sage-600">Detalhes da Confirmação</h3>
                <button
                  onClick={() => setSelectedRsvp(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Nome</label>
                  <p className="text-sage-600">{selectedRsvp.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Email</label>
                    <p className="text-sage-600">{selectedRsvp.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Telefone</label>
                    <p className="text-sage-600">{selectedRsvp.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Confirmação</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    selectedRsvp.attending === 'yes' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedRsvp.attending === 'yes' ? 'Confirmou Presença' : 'Não Comparecerá'}
                  </span>
                </div>

                {selectedRsvp.message && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Mensagem</label>
                    <div className="bg-rose-50 p-4 rounded-lg">
                      <p className="text-sage-600 italic">"{selectedRsvp.message}"</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-stone-700">Data de Envio</label>
                  <p className="text-sage-600">
                    {new Date(selectedRsvp.submittedAt || '').toLocaleString('pt-BR')}
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