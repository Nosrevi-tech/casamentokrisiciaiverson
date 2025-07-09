import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, QrCode, CreditCard, Clock, AlertCircle, Loader } from 'lucide-react';
import QRCode from 'qrcode';
import mercadoPagoService from '../services/mercadoPagoService';

function EnvironmentBadge() {
  const status = mercadoPagoService.getCredentialsStatus();
  
  if (!status.isConfigured) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Demo
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
      status.environment === 'sandbox' 
        ? 'bg-yellow-100 text-yellow-800' 
        : 'bg-green-100 text-green-800'
    }`}>
      {status.environment === 'sandbox' ? 'Teste' : 'Produção'}
    </span>
  );
}

interface PixPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  selectedGifts: Array<{
    id: number;
    name: string;
    price: string;
  }>;
  payerInfo?: {
    name: string;
    email: string;
  };
  messageInfo?: {
    senderName: string;
    representing: string;
    message: string;
  };
}

export default function PixPayment({ 
  isOpen, 
  onClose, 
  totalAmount, 
  selectedGifts,
  payerInfo = { name: 'Convidado', email: 'convidado@email.com' },
  messageInfo = { senderName: '', representing: '', message: '' }
}: PixPaymentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const [paymentStatus, setPaymentStatus] = useState<'creating' | 'pending' | 'approved' | 'rejected' | 'error'>('creating');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      createPixPayment();
      startTimer();
    }
  }, [isOpen, totalAmount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentId && paymentStatus === 'pending') {
      // Verifica o status do pagamento a cada 5 segundos
      interval = setInterval(async () => {
        try {
          const status = await mercadoPagoService.getPaymentStatus(paymentId);
          if (status.status === 'approved') {
            setPaymentStatus('approved');
            clearInterval(interval);
          } else if (status.status === 'rejected' || status.status === 'cancelled') {
            setPaymentStatus('rejected');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentId, paymentStatus]);

  const createPixPayment = async () => {
    setIsLoading(true);
    setError('');
    setPaymentStatus('creating');

    try {
      const externalReference = `CASAMENTO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const paymentData = {
        amount: totalAmount,
        description: `Presente de Casamento - ${selectedGifts.length} item${selectedGifts.length > 1 ? 's' : ''}`,
        payerEmail: payerInfo.email,
        payerName: payerInfo.name,
        externalReference,
        productId: selectedGifts.length === 1 ? selectedGifts[0].id : undefined
      };

      const response = await mercadoPagoService.createPixPayment(paymentData);
      
      setPaymentId(response.id);
      setPixCode(response.qr_code || response.point_of_interaction?.transaction_data?.qr_code || '');
      setPaymentStatus('pending');

      // Atualizar dados do pagamento no localStorage com informações completas
      const existingPayments = JSON.parse(localStorage.getItem('mercadoPagoPayments') || '[]');
      const updatedPayments = existingPayments.map((payment: any) => {
        if (payment.id === response.id) {
          return {
            ...payment,
            gifts: selectedGifts,
            messageInfo: messageInfo
          };
        }
        return payment;
      });
      localStorage.setItem('mercadoPagoPayments', JSON.stringify(updatedPayments));

      // Gerar QR Code visual
      if (response.qr_code || response.point_of_interaction?.transaction_data?.qr_code) {
        const qrData = response.qr_code || response.point_of_interaction.transaction_data.qr_code;
        const qrUrl = await QRCode.toDataURL(qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrUrl);
      }

    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      setError('Erro ao criar pagamento. Tente novamente.');
      setPaymentStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleClose = () => {
    setQrCodeUrl('');
    setPixCode('');
    setCopied(false);
    setPaymentId('');
    setTimeLeft(900);
    setPaymentStatus('creating');
    setError('');
    onClose();
  };

  const handlePaymentComplete = () => {
    // Salvar informação do presente como pago
    const giftsPurchased = selectedGifts.map(gift => gift.id);
    const existingPurchases = JSON.parse(localStorage.getItem('purchasedGifts') || '[]');
    const updatedPurchases = [...existingPurchases, ...giftsPurchased];
    localStorage.setItem('purchasedGifts', JSON.stringify(updatedPurchases));
    
    // Salvar mensagem de felicitações
    if (messageInfo.senderName && messageInfo.message) {
      const giftMessage = {
        id: Date.now().toString(),
        senderName: messageInfo.senderName,
        representing: messageInfo.representing,
        message: messageInfo.message,
        payerName: payerInfo.name,
        payerEmail: payerInfo.email,
        gifts: selectedGifts,
        totalAmount: totalAmount,
        paymentId: paymentId,
        submittedAt: new Date().toISOString()
      };
      
      const existingMessages = JSON.parse(localStorage.getItem('giftMessages') || '[]');
      existingMessages.push(giftMessage);
      localStorage.setItem('giftMessages', JSON.stringify(existingMessages));
    }
    
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-serif text-sage-600">Pagamento PIX</h3>
              <div className="flex items-center space-x-2">
                <p className="text-stone-600">Mercado Pago - Seguro e Confiável</p>
                <EnvironmentBadge />
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status do Pagamento */}
          {paymentStatus === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="text-green-800 font-semibold">Pagamento Aprovado!</h4>
                  <p className="text-green-700 text-sm">Seu presente foi confirmado com sucesso.</p>
                </div>
              </div>
              <button
                onClick={handlePaymentComplete}
                className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Finalizar
              </button>
            </div>
          )}

          {paymentStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="text-red-800 font-semibold">Pagamento Rejeitado</h4>
                  <p className="text-red-700 text-sm">Houve um problema com o pagamento. Tente novamente.</p>
                </div>
              </div>
              <button
                onClick={createPixPayment}
                className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Timer */}
          {paymentStatus === 'pending' && timeLeft > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  Tempo restante: {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-orange-700 text-sm mt-1">
                Este PIX expira em 15 minutos por segurança
              </p>
            </div>
          )}

          {/* Resumo do Pedido */}
          <div className="bg-rose-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-sage-600 mb-4">Resumo do Presente</h4>
            <div className="space-y-2 mb-4">
              {selectedGifts.map((gift) => (
                <div key={gift.id} className="flex justify-between items-center">
                  <span className="text-stone-700">{gift.name}</span>
                  <span className="font-medium text-sage-600">{gift.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-rose-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-sage-600">Total:</span>
                <span className="text-2xl font-bold text-primary-500">
                  R$ {totalAmount.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            
            {/* Informações da Mensagem */}
            {messageInfo.senderName && messageInfo.message && (
              <div className="mt-4 pt-4 border-t border-rose-200">
                <h5 className="text-sm font-semibold text-sage-600 mb-2">Mensagem de Felicitações:</h5>
                <div className="bg-white rounded-lg p-3 text-sm">
                  <p className="text-stone-700 mb-2">
                    <strong>De:</strong> {messageInfo.senderName}
                    {messageInfo.representing && (
                      <span className="text-stone-500"> (representando {messageInfo.representing})</span>
                    )}
                  </p>
                  <p className="text-stone-600 italic">"{messageInfo.message}"</p>
                </div>
              </div>
            )}
            
            {paymentId && (
              <div className="mt-4 pt-4 border-t border-rose-200">
                <p className="text-sm text-stone-600">
                  <strong>ID do Pagamento:</strong> {paymentId}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-stone-600">Criando pagamento PIX...</p>
            </div>
          )}

          {/* QR Code e Instruções */}
          {paymentStatus === 'pending' && !isLoading && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="text-center">
                <div className="bg-rose-50 rounded-lg p-6 mb-4">
                  {qrCodeUrl ? (
                    <div>
                      <QrCode className="w-8 h-8 text-stone-600 mx-auto mb-4" />
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code PIX" 
                        className="mx-auto rounded-lg shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <div className="w-64 h-64 bg-stone-300 rounded-lg mx-auto"></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-stone-600">
                  Escaneie o QR Code com seu app do banco
                </p>
              </div>

              {/* Chave PIX */}
              <div>
                <h5 className="font-semibold text-sage-600 mb-3">Ou copie a chave PIX:</h5>
                <div className="bg-rose-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-stone-700 break-all flex-1 mr-2">
                      {pixCode || 'Gerando chave PIX...'}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      disabled={!pixCode}
                      className="flex items-center space-x-1 bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dados do Pagamento */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Beneficiário:</label>
                    <p className="text-sage-600">Iverson dos Santos de Paiva</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Processado por:</label>
                    <p className="text-sage-600">Mercado Pago</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instruções */}
          {paymentStatus === 'pending' && !isLoading && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6">
              <h5 className="font-semibold text-blue-800 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Como pagar:
              </h5>
              <ol className="list-decimal list-inside space-y-2 text-blue-700">
                <li>Abra o app do seu banco</li>
                <li>Escolha a opção PIX</li>
                <li>Escaneie o QR Code ou cole a chave PIX</li>
                <li>Confirme os dados e o valor</li>
                <li>Finalize o pagamento</li>
              </ol>
              <p className="text-blue-600 text-sm mt-4">
                💝 O pagamento será confirmado automaticamente em alguns segundos!
              </p>
            </div>
          )}

          {/* Botões */}
          {paymentStatus !== 'approved' && (
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
              >
                Cancelar
              </button>
              {paymentStatus === 'pending' && (
                <button
                  onClick={() => setPaymentStatus('approved')}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Simular Pagamento (Demo)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}