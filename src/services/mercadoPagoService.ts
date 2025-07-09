interface PaymentData {
  amount: number;
  description: string;
  payerEmail: string;
  payerName: string;
  externalReference: string;
  productId?: number;
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

interface CredentialsStatus {
  isConfigured: boolean;
  environment: string;
  isValid: boolean;
  lastTested?: string;
}

class MercadoPagoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  async createPixPayment(paymentData: PaymentData): Promise<MercadoPagoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/mercadopago/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Se não estiver configurado, usar modo demo
        if (response.status === 400 && errorData.error?.includes('não configurado')) {
          console.warn('Mercado Pago não configurado. Usando modo de demonstração.');
          const mockPayment = this.createMockPayment(paymentData);
          this.savePaymentToStorage(mockPayment, paymentData);
          return mockPayment;
        }
        
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      this.savePaymentToStorage(data, paymentData);
      return data;
      
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      
      // Em caso de erro de conexão, usar modo demo
      const mockPayment = this.createMockPayment(paymentData);
      this.savePaymentToStorage(mockPayment, paymentData);
      return mockPayment;
    }
  }

  private savePaymentToStorage(paymentResponse: MercadoPagoResponse, paymentData: PaymentData) {
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
      productId: paymentData.productId,
      gifts: [],
      messageInfo: {}
    };

    const existingPayments = JSON.parse(localStorage.getItem('mercadoPagoPayments') || '[]');
    existingPayments.push(payment);
    localStorage.setItem('mercadoPagoPayments', JSON.stringify(existingPayments));
  }

  private createMockPayment(paymentData: PaymentData): MercadoPagoResponse {
    const pixCode = this.generateMockPixCode(paymentData);
    
    return {
      id: `MP_DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      qr_code: pixCode,
      qr_code_base64: '',
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
    const merchantName = 'KRISCIA E IVERSON';
    const merchantCity = 'BARBACENA';
    const pixKey = 'iverson.paiva11@gmail.com';
    
    return `00020126580014br.gov.bcb.pix0136${pixKey}0208${paymentData.description.substring(0, 25)}5204000053039865802BR5925${merchantName}6011${merchantCity}62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: string; statusDetail: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/mercadopago/payments/${paymentId}`);

      if (!response.ok) {
        throw new Error(`Erro ao consultar pagamento: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        statusDetail: data.statusDetail
      };
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      return {
        status: 'pending',
        statusDetail: 'pending_waiting_payment'
      };
    }
  }

  async getCredentialsStatus(): Promise<CredentialsStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credentials/status`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar status das credenciais');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar credenciais:', error);
      return {
        isConfigured: false,
        environment: 'demo',
        isValid: false
      };
    }
  }

  async saveCredentials(credentials: {
    accessToken: string;
    publicKey: string;
    environment: 'sandbox' | 'production';
  }): Promise<{ success: boolean; message: string; isValid?: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar credenciais');
      }

      // Notificar outros componentes sobre a mudança
      window.dispatchEvent(new CustomEvent('mercadoPagoCredentialsUpdated'));
      
      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async testCredentials(credentials: {
    accessToken: string;
    environment: 'sandbox' | 'production';
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credentials/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao testar credenciais');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async clearCredentials(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credentials`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao limpar credenciais');
      }

      // Notificar outros componentes sobre a mudança
      window.dispatchEvent(new CustomEvent('mercadoPagoCredentialsUpdated'));
      
      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export default new MercadoPagoService();