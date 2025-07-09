import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, CheckCircle, XCircle, Copy, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import mercadoPagoService from '../services/mercadoPagoService';

interface PendingPayment {
  id: string;
  amount: number;
  description: string;
  payerName: string;
  payerEmail: string;
  externalReference: string;
  createdAt: string;
  pixCode: string;
  qrCodeUrl?: string;
  timeLeft: number; // em segundos
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

export default function PendingPayments() {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingPayments();
    
    // Timer para atualizar tempo restante
    const timer = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    // Auto-refresh dos status a cada 10 segundos
    const refreshTimer = setInterval(() => {
      refreshPaymentStatuses();
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(refreshTimer);
    };
  }, []);

  const loadPendingPayments = () => {
    const allPayments = JSON.parse(localStorage.getItem('mercadoPagoPayments') || '[]');
    const pending = allPayments
      .filter((payment: any) => payment.status === 'pending')
      .map((payment: any) => ({
        ...payment,
        timeLeft: calculateTimeLeft(payment.createdAt)
      }));
    
    setPendingPayments(pending);
    generateQRCodes(pending);
  };

  const generateQRCodes = async (payments: PendingPayment[]) => {
    const updatedPayments = await Promise.all(
      payments.map(async (payment) => {
        if (payment.pixCode && !payment.qrCodeUrl) {
          try {
            const qrUrl = await QRCode.toDataURL(payment.pixCode, {
              width: 200,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            return { ...payment, qrCodeUrl: qrUrl };
          } catch (error) {
            console.error('Erro ao gerar QR Code:', error);
            return payment;
          }
        }
        return payment;
      })
    );
    
    setPendingPayments(updatedPayments);
  };

  const calculateTimeLeft = (createdAt: string): number => {
    const created = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const elapsed = (now - created) / 1000; // em segundos
    const timeLimit = 15 * 60; // 15 minutos em segundos
    
    return Math.max(0, timeLimit - elapsed);
  };

  const updateTimeLeft = () => {
    setPendingPayments(prev => 
      prev.map(payment => ({
        ...payment,
        timeLeft: calculateTimeLeft(payment.createdAt)
      })).filter(payment => payment.timeLeft > 0) // Remove pagamentos expirados
    );
  };

  const refreshPaymentStatuses = async () => {
    setIsRefreshing(true);
    
    for (const payment of pendingPayments) {
      try {
        const statusResponse = await mercadoPagoService.getPaymentStatus(payment.id);
        if (statusResponse.status !== 'pending') {
          // Remove da lista de pendentes se foi aprovado/rejeitado
          setPendingPayments(prev => prev.filter(p => p.id !== payment.id));
          
          // Atualizar no localStorage
          const allPayments = JSON.parse(localStorage.getItem('mercadoPagoPayments') || '[]');
          const updatedPayments = allPayments.map((p: any) => 
            p.id === payment.id 
              ? { ...p, status: statusResponse.status, approvedAt: new Date().toISOString() }
              : p
          );
          localStorage.setItem('mercadoPagoPayments', JSON.stringify(updatedPayments));
        }
      } catch (error) {
        console.error(`Erro ao verificar status do pagamento ${payment.id}:`, error);
      }
    }
    
    setIsRefreshing(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyPixCode = async (pixCode: string, paymentId: string) => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopiedId(paymentId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar PIX:', error);
    }
  };

  const simulatePayment = (paymentId: string) => {
    // Simular aprovação do pagamento
    const allPayments = JSON.parse(localStorage.getItem('mercadoPagoPayments') || '[]');
    const updatedPayments = allPayments.map((p: any) => 
      p.id === paymentId 
        ? { ...p, status: 'approved', approvedAt: new Date().toISOString() }
        : p
    );
    localStorage.setItem('mercadoPagoPayments', JSON.stringify(updatedPayments));
    
    // Remove da lista de pendentes
    setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    
    // Marcar presentes como comprados
    const payment = pendingPayments.find(p => p.id === paymentId);
    if (payment && payment.gifts) {
      const giftIds = payment.gifts.map(g => g.id);
      const existingPurchases = JSON.parse(localStorage.getItem('purchasedGifts') || '[]');
      const updatedPurchases = [...existingPurchases, ...giftIds];
      localStorage.setItem('purchasedGifts', JSON.stringify(updatedPurchases));
      
      // Salvar mensagem se existir
      if (payment.messageInfo && payment.messageInfo.message) {
        const giftMessage = {
          id: Date.now().toString(),
          senderName: payment.messageInfo.senderName,
          representing: payment.messageInfo.representing,
          message: payment.messageInfo.message,
          payerName: payment.payerName,
          payerEmail: payment.payerEmail,
          gifts: payment.gifts,
          totalAmount: payment.amount,
          paymentId: payment.id,
          submittedAt: new Date().toISOString()
        };
        
        const existingMessages = JSON.parse(localStorage.getItem('giftMessages') || '[]');
        existingMessages.push(giftMessage);
        localStorage.setItem('giftMessages', JSON.stringify(existingMessages));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-serif text-sage-600">Pagamentos Pendentes</h3>
          <p className="text-stone-600">Acompanhe pagamentos PIX aguardando confirmação</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-stone-600">
            {pendingPayments.length} pagamento{pendingPayments.length !== 1 ? 's' : ''} pendente{pendingPayments.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={refreshPaymentStatuses}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Lista de Pagamentos Pendentes */}
      <div className="grid gap-6">
        {pendingPayments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg shadow-sm border-l-4 border-yellow-400 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Informações do Pagamento */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-sage-600">
                    {payment.externalReference}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    payment.timeLeft > 300 
                      ? 'bg-green-100 text-green-800' 
                      : payment.timeLeft > 60
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formatTime(payment.timeLeft)} restantes
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-stone-600">Cliente:</p>
                    <p className="font-medium text-sage-600">{payment.payerName}</p>
                    <p className="text-sm text-stone-500">{payment.payerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600">Valor:</p>
                    <p className="text-2xl font-bold text-primary-500">
                      R$ {payment.amount.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Presentes */}
                {payment.gifts && payment.gifts.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-stone-600 mb-2">Presentes:</p>
                    <div className="flex flex-wrap gap-2">
                      {payment.gifts.map((gift, index) => (
                        <span key={index} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                          {gift.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code e Ações */}
              <div className="flex flex-col items-center space-y-4 lg:ml-6">
                {payment.qrCodeUrl && (
                  <div className="text-center">
                    <img 
                      src={payment.qrCodeUrl} 
                      alt="QR Code PIX" 
                      className="w-32 h-32 rounded-lg shadow-md"
                    />
                    <p className="text-xs text-stone-600 mt-2">QR Code PIX</p>
                  </div>
                )}
                
                <div className="flex flex-col space-y-2 w-full lg:w-auto">
                  <button
                    onClick={() => copyPixCode(payment.pixCode, payment.id)}
                    className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    {copiedId === payment.id ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar PIX</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="flex items-center justify-center space-x-2 bg-stone-500 text-white px-4 py-2 rounded-lg hover:bg-stone-600 transition-colors text-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Detalhes</span>
                  </button>
                  
                  <button
                    onClick={() => simulatePayment(payment.id)}
                    className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Simular Pagamento</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pendingPayments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Clock className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <p className="text-stone-500">Nenhum pagamento pendente no momento</p>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-sage-600">Detalhes do Pagamento Pendente</h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status e Timer */}
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-yellow-800">
                    Tempo restante: {formatTime(selectedPayment.timeLeft)}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Este pagamento expira automaticamente em 15 minutos
                  </p>
                </div>

                {/* QR Code Grande */}
                {selectedPayment.qrCodeUrl && (
                  <div className="text-center">
                    <img 
                      src={selectedPayment.qrCodeUrl} 
                      alt="QR Code PIX" 
                      className="w-64 h-64 mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {/* Chave PIX */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Chave PIX:
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-stone-100 p-3 rounded-lg text-sm break-all">
                      {selectedPayment.pixCode}
                    </code>
                    <button
                      onClick={() => copyPixCode(selectedPayment.pixCode, selectedPayment.id)}
                      className="bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      {copiedId === selectedPayment.id ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Informações do Pagamento */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Valor:</label>
                    <p className="text-2xl font-bold text-primary-500">
                      R$ {selectedPayment.amount.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Referência:</label>
                    <p className="text-sage-600">{selectedPayment.externalReference}</p>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Cliente:</label>
                  <div className="bg-stone-50 rounded-lg p-4">
                    <p className="font-medium text-sage-600">{selectedPayment.payerName}</p>
                    <p className="text-stone-600">{selectedPayment.payerEmail}</p>
                  </div>
                </div>

                {/* Presentes */}
                {selectedPayment.gifts && selectedPayment.gifts.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Presentes:</label>
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

                {/* Mensagem */}
                {selectedPayment.messageInfo && selectedPayment.messageInfo.message && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Mensagem:</label>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-sm text-stone-600 mb-1">
                        <strong>De:</strong> {selectedPayment.messageInfo.senderName}
                        {selectedPayment.messageInfo.representing && (
                          <span> (representando {selectedPayment.messageInfo.representing})</span>
                        )}
                      </p>
                      <p className="text-stone-700 italic">"{selectedPayment.messageInfo.message}"</p>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => simulatePayment(selectedPayment.id)}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Simular Pagamento Aprovado</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}