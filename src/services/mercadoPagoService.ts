interface PaymentData {
  amount: number;
  description: string;
  payerEmail: string;
  payerName: string;
  externalReference: string;
}

interface MercadoPagoResponse {
  id: string;
  status: string;
  qr_code: string;
  qr_code_base64: string;
  ticket_url: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
}

interface CreatePaymentResponse extends MercadoPagoResponse {
  external_reference: string;
  date_created: string;
  payer: {
    email: string;
    first_name: string;
    last_name: string;
  };
  transaction_amount: number;
  description: string;
}

class MercadoPagoService {
  private accessToken: string;
  private baseUrl = '/api/mercadopago';

  constructor() {
    this.accessToken = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || '';
    
    if (!this.accessToken) {
      console.warn('Mercado Pago access token não configurado. Usando modo de demonstração.');
    }
  }

  async createPixPayment(paymentData: PaymentData): Promise<MercadoPagoResponse> {
    try {
      // Se não tiver token configurado, retorna dados simulados
      if (!this.accessToken || this.accessToken === 'your_access_token_here') {
        const mockPayment = this.createMockPayment(paymentData);
        this.savePaymentToStorage(mockPayment, paymentData);
        return mockPayment;
      }

      const response = await fetch(`${this.baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': paymentData.externalReference
        },
        body: JSON.stringify({
          transaction_amount: paymentData.amount,
          description: paymentData.description,
          payment_method_id: 'pix',
          payer: {
            email: paymentData.payerEmail,
            first_name: paymentData.payerName.split(' ')[0],
            last_name: paymentData.payerName.split(' ').slice(1).join(' ') || 'Silva'
          },
          external_reference: paymentData.externalReference,
          notification_url: `${window.location.origin}/webhook/mercadopago`,
          metadata: {
            wedding_gift: true,
            couple_names: 'Kriscia e Iverson'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
      }

      const data = await response.json();
      this.savePaymentToStorage(data, paymentData);
      return data;
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      // Em caso de erro, retorna dados simulados para demonstração
      const mockPayment = this.createMockPayment(paymentData);
      this.savePaymentToStorage(mockPayment, paymentData);
      return mockPayment;
    }
  }

  private savePaymentToStorage(paymentResponse: MercadoPagoResponse, paymentData: PaymentData) {
    // Salvar pagamento no localStorage para o dashboard
    const payment = {
      id: paymentResponse.id,
      status: 'pending',
      amount: paymentData.amount,
      description: paymentData.description,
      payerName: paymentData.payerName,
      payerEmail: paymentData.payerEmail,
      externalReference: paymentData.externalReference,
      createdAt: new Date().toISOString(),
      pixCode: paymentResponse.qr_code || paymentResponse.point_of_interaction?.transaction_data?.qr_code || '',
      gifts: [], // Será preenchido pelo componente que chama
      messageInfo: {} // Será preenchido pelo componente que chama
    };

    const existingPayments = JSON.parse(localStorage.getItem('mercadoPagoPayments') || '[]');
    existingPayments.push(payment);
    localStorage.setItem('mercadoPagoPayments', JSON.stringify(existingPayments));
  }

  private createMockPayment(paymentData: PaymentData): MercadoPagoResponse {
    // Gera um QR Code PIX simulado para demonstração
    const pixCode = this.generateMockPixCode(paymentData);
    
    return {
      id: `MP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      qr_code: pixCode,
      qr_code_base64: '', // Será gerado pelo componente
      ticket_url: '',
      point_of_interaction: {
        transaction_data: {
          qr_code: pixCode,
          qr_code_base64: '',
          ticket_url: ''
        }
      }
    };
  }

  private generateMockPixCode(paymentData: PaymentData): string {
    // Gera um código PIX simulado seguindo o padrão EMV
    const merchantName = 'KRISCIA E IVERSON';
    const merchantCity = 'BARBACENA';
    const pixKey = 'iverson.paiva11@gmail.com';
    const amount = paymentData.amount.toFixed(2);
    
    // Formato simplificado do PIX EMV QR Code
    return `00020126580014br.gov.bcb.pix0136${pixKey}0208${paymentData.description.substring(0, 25)}5204000053039865802BR5925${merchantName}6011${merchantCity}62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: string; statusDetail: string }> {
    try {
      if (!this.accessToken || this.accessToken === 'your_access_token_here') {
        // Simula status para demonstração
        return {
          status: 'pending',
          statusDetail: 'pending_waiting_payment'
        };
      }

      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao consultar pagamento: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        statusDetail: data.status_detail
      };
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      return {
        status: 'pending',
        statusDetail: 'pending_waiting_payment'
      };
    }
  }
}

export default new MercadoPagoService();