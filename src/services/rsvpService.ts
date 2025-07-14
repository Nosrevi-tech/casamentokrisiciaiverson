// Service para gerenciar confirmações de presença com Netlify Database

export interface RSVPData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  attending: string;
  message?: string;
  submittedAt?: string;
}

class RSVPService {
  private baseUrl: string;

  constructor() {
    // Em produção no Netlify, usar a URL do site
    // Em desenvolvimento, usar localhost (fallback para localStorage)
    this.baseUrl = import.meta.env.PROD 
      ? window.location.origin 
      : 'http://localhost:8888'; // Netlify Dev default port
  }

  // Salvar confirmação de presença
  async saveRSVP(rsvpData: RSVPData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Tentar salvar no Netlify Database primeiro
      const response = await fetch(`${this.baseUrl}/.netlify/functions/save-rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData),
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, id: result.id };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Netlify Database não disponível, usando localStorage como fallback:', error);
      
      // Fallback para localStorage em desenvolvimento
      return this.saveToLocalStorage(rsvpData);
    }
  }

  // Buscar todas as confirmações (apenas para admin)
  async getRSVPs(): Promise<{ success: boolean; data?: RSVPData[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/.netlify/functions/get-rsvps`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer admin-casamento2026',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result.data };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Netlify Database não disponível, usando localStorage como fallback:', error);
      
      // Fallback para localStorage
      return this.getFromLocalStorage();
    }
  }

  // Fallback: Salvar no localStorage
  private saveToLocalStorage(rsvpData: RSVPData): { success: boolean; id: string } {
    try {
      const rsvpEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...rsvpData,
        submittedAt: new Date().toISOString()
      };

      const existingData = localStorage.getItem('weddingRSVP');
      const rsvpList = existingData ? JSON.parse(existingData) : [];
      
      rsvpList.push(rsvpEntry);
      localStorage.setItem('weddingRSVP', JSON.stringify(rsvpList));
      
      return { success: true, id: rsvpEntry.id };
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return { success: false, id: '' };
    }
  }

  // Fallback: Buscar do localStorage
  private getFromLocalStorage(): { success: boolean; data: RSVPData[] } {
    try {
      const savedData = localStorage.getItem('weddingRSVP');
      const data = savedData ? JSON.parse(savedData) : [];
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao buscar do localStorage:', error);
      return { success: true, data: [] };
    }
  }

  // Verificar se está rodando no Netlify
  isNetlifyEnvironment(): boolean {
    return import.meta.env.PROD && window.location.hostname.includes('netlify');
  }

  // Obter estatísticas
  async getStats(): Promise<{ total: number; attending: number; notAttending: number }> {
    const result = await this.getRSVPs();
    
    if (result.success && result.data) {
      const total = result.data.length;
      const attending = result.data.filter(entry => entry.attending === 'yes').length;
      const notAttending = result.data.filter(entry => entry.attending === 'no').length;
      
      return { total, attending, notAttending };
    }
    
    return { total: 0, attending: 0, notAttending: 0 };
  }
}

export default new RSVPService();