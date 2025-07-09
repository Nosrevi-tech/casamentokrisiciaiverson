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

interface MercadoPagoCredentials {
  accessToken: string;
  publicKey: string;
  environment: 'sandbox' | 'production';
  isConfigured: boolean;
  isValid?: boolean;
}

class MercadoPagoService {
  private credentials: MercadoPagoCredentials | null = null;

  constructor() {
    this.loadCredentials();
    
    // Escutar mudanças nas credenciais
    window.addEventListener('mercadoPagoCredentialsUpdated', () => {
      this.loadCredentials();
    });
  }

  private loadCredentials() {
    try {
      const saved = localStorage.getItem('mercadoPagoCredentials');
      if (saved) {
        this.credentials = JSON.parse(saved);
      } else {
        // Fallback para variáveis de ambiente (compatibilidade)
        const envToken = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
        const envPublicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
        
        if (envToken && envPublicKey) {
          this.credentials = {
            accessToken: envToken,
            publicKey: envPublicKey,
            environment: envToken.startsWith('TEST-') ? 'sandbox' : 'production',
            isConfigured: true,
            isValid: true
          };
        }
      }
    } catch (error) {
      console.error('Erro ao carregar credenciais do Mercado Pago:', error);
      this.credentials = null;
    }
  }

  private getApiUrl(): string {
    if (!this.credentials) return 'https://api.mercadopago.com';
    
    return this.credentials.environment === 'sandbox' 
      ? 'https://api.mercadopago.com'
      : 'https://api.mercadopago.com';
  }

  private isConfigured(): boolean {
    return !!(this.credentials?.isConfigured && this.credentials?.accessToken);
  }

  async createPixPayment(paymentData: PaymentData): Promise<MercadoPagoResponse> {
    try {
      // Verificar se está configurado
      if (!this.isConfigured()) {
        console.warn('Mercado Pago não configurado. Usando modo de demonstração.');
        const mockPayment = this.createMockPayment(paymentData);
        this.savePaymentToStorage(mockPayment, paymentData);
        return mockPayment;
      }

      const apiUrl = this.getApiUrl();
      
      const requestBody = {
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
          couple_names: 'Kriscia e Iverson',
          product_id: paymentData.productId?.toString() || 'multiple'
        }
      };

      const response = await fetch(`${apiUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials!.accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': paymentData.externalReference
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro na API do Mercado Pago: ${response.status} - ${errorData.message || response.statusText}`);
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
      environment: this.credentials?.environment || 'demo',
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
      id: `MP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    const amount = paymentData.amount.toFixed(2);
    
    // Formato simplificado do PIX EMV QR Code
    return `00020126580014br.gov.bcb.pix0136${pixKey}0208${paymentData.description.substring(0, 25)}5204000053039865802BR5925${merchantName}6011${merchantCity}62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: string; statusDetail: string }> {
    try {
      if (!this.isConfigured()) {
        return {
          status: 'pending',
          statusDetail: 'pending_waiting_payment'
        };
      }

      const apiUrl = this.getApiUrl();
      
      const response = await fetch(`${apiUrl}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.credentials!.accessToken}`,
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

  // Método para verificar se as credenciais estão configuradas
  getCredentialsStatus(): {
    isConfigured: boolean;
    environment: string;
    isValid: boolean;
  } {
    return {
      isConfigured: this.isConfigured(),
      environment: this.credentials?.environment || 'demo',
      isValid: this.credentials?.isValid || false
    };
  }

  // Método para testar a conexão com a API
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          message: 'Credenciais não configuradas'
        };
      }

      const apiUrl = this.getApiUrl();
      
      const response = await fetch(`${apiUrl}/v1/account/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.credentials!.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: `Conexão bem-sucedida com ambiente ${this.credentials!.environment}`
        };
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
}

export default new MercadoPagoService();