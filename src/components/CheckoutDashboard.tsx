import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Users,
  Package,
  Calendar,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import mercadoPagoService from '../services/mercadoPagoService';

interface Payment {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  amount: number;
  description: string;
  payerName: string;
  payerEmail: string;
  externalReference: string;
  createdAt: string;
  approvedAt?: string;
  pixCode?: string;
  gifts: Array<{
    id: number;
    name: string;
    price: string;
  }>;
  messageInfo?: {
    senderName: string;
    representing: string;
    message: string;
  };
}

export default function CheckoutDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadPayments();
    // Auto-refresh a cada 30 segundos para pagamentos pendentes
    const interval = setInterval(() => {
      refreshPendingPayments();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadPayments = () => {
    // Carregar pagamentos do localStorage (simulando banco de dados)
    const savedPayments = localStorage.getItem('mercadoPagoPayments');
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }
  };

  const savePayments = (paymentList: Payment[]) => {
    localStorage.setItem('mercadoPagoPayments', JSON.stringify(paymentList));
    setPayments(paymentList);
  };

  const refreshPendingPayments = async () => {
    setIsRefreshing(true);
    const pendingPayments = payments.filter(p => p.status === 'pending');
    
    for (const payment of pendingPayments) {
      try {
        const statusResponse = await mercadoPagoService.getPaymentStatus(payment.id);
        if (statusResponse.status !== payment.status) {
          updatePaymentStatus(payment.id, statusResponse.status as Payment['status']);
        }
      } catch (error) {
        console.error(`Erro ao atualizar status do pagamento ${payment.id}:`, error);
      }
    }
    
    setIsRefreshing(false);
  };

  const updatePaymentStatus = (paymentId: string, newStatus: Payment['status']) => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status: newStatus,
          approvedAt: newStatus === 'approved' ? new Date().toISOString() : payment.approvedAt
        };
      }
      return payment;
    });
    
    savePayments(updatedPayments);
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    approved: payments.filter(p => p.status === 'approved').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
    totalRevenue: payments
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0),
    averageTicket: payments.length > 0 
      ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length 
      : 0
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-stone-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-stone-600" />;
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-stone-100 text-stone-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-serif text-sage-600">Dashboard de Pagamentos</h3>
          <p className="text-stone-600">Acompanhe todos os pagamentos PIX em tempo real</p>
        </div>
        <button
          onClick={refreshPendingPayments}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">Total de Pagamentos</p>
              <p className="text-2xl font-bold text-sage-600">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">Pendentes</p>
              <p className="text-2xl font-bold text-sage-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">Aprovados</p>
              <p className="text-2xl font-bold text-sage-600">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">Receita Total</p>
              <p className="text-2xl font-bold text-sage-600">
                R$ {stats.totalRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">Ticket Médio</p>
              <p className="text-xl font-bold text-sage-600">
                R$ {stats.averageTicket.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">Taxa de Conversão</p>
              <p className="text-xl font-bold text-sage-600">
                {stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">Presentes Vendidos</p>
              <p className="text-xl font-bold text-sage-600">
                {payments.reduce((sum, p) => sum + (p.gifts?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary-500 text-white' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Pendentes ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved' 
                ? 'bg-green-500 text-white' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Aprovados ({stats.approved})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejected' 
                ? 'bg-red-500 text-white' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Rejeitados ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Lista de Pagamentos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-rose-200">
            <thead className="bg-rose-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Status
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-rose-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-sage-600">
                        {payment.externalReference}
                      </div>
                      <div className="text-sm text-stone-500">
                        {payment.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-sage-600">
                        {payment.payerName}
                      </div>
                      <div className="text-sm text-stone-500">
                        {payment.payerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sage-600">
                    R$ {payment.amount.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{getStatusText(payment.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    <div>
                      <div>{new Date(payment.createdAt).toLocaleDateString('pt-BR')}</div>
                      <div>{new Date(payment.createdAt).toLocaleTimeString('pt-BR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-500">Nenhum pagamento encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Pagamento */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-sage-600">Detalhes do Pagamento</h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status e Informações Básicas */}
                <div className="bg-rose-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                      {getStatusIcon(selectedPayment.status)}
                      <span className="ml-2">{getStatusText(selectedPayment.status)}</span>
                    </span>
                    <span className="text-2xl font-bold text-primary-500">
                      R$ {selectedPayment.amount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-stone-700">ID:</span>
                      <p className="text-stone-600">{selectedPayment.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-stone-700">Referência:</span>
                      <p className="text-stone-600">{selectedPayment.externalReference}</p>
                    </div>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div>
                  <h4 className="font-semibold text-sage-600 mb-3">Informações do Cliente</h4>
                  <div className="bg-stone-50 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="font-medium text-stone-700">Nome:</span>
                      <span className="ml-2 text-stone-600">{selectedPayment.payerName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-stone-700">Email:</span>
                      <span className="ml-2 text-stone-600">{selectedPayment.payerEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Presentes */}
                {selectedPayment.gifts && selectedPayment.gifts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sage-600 mb-3">Presentes Selecionados</h4>
                    <div className="space-y-2">
                      {selectedPayment.gifts.map((gift, index) => (
                        <div key={index} className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                          <span className="text-stone-700">{gift.name}</span>
                          <span className="font-medium text-primary-500">{gift.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensagem de Felicitações */}
                {selectedPayment.messageInfo && selectedPayment.messageInfo.message && (
                  <div>
                    <h4 className="font-semibold text-sage-600 mb-3">Mensagem de Felicitações</h4>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <div className="mb-2">
                        <span className="font-medium text-stone-700">De:</span>
                        <span className="ml-2 text-stone-600">{selectedPayment.messageInfo.senderName}</span>
                        {selectedPayment.messageInfo.representing && (
                          <span className="text-stone-500"> (representando {selectedPayment.messageInfo.representing})</span>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-stone-700 italic">"{selectedPayment.messageInfo.message}"</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Datas */}
                <div>
                  <h4 className="font-semibold text-sage-600 mb-3">Histórico</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-stone-500" />
                      <span className="text-stone-700">Criado em:</span>
                      <span className="text-stone-600">
                        {new Date(selectedPayment.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    {selectedPayment.approvedAt && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-stone-700">Aprovado em:</span>
                        <span className="text-stone-600">
                          {new Date(selectedPayment.approvedAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}