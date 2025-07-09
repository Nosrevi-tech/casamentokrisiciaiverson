import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Save, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ExternalLink,
  Trash2,
  Settings,
  Shield,
  Server
} from 'lucide-react';
import mercadoPagoService from '../services/mercadoPagoService';

interface MercadoPagoCredentials {
  accessToken: string;
  publicKey: string;
  environment: 'sandbox' | 'production';
}

interface CredentialsStatus {
  isConfigured: boolean;
  environment: string;
  isValid: boolean;
  lastTested?: string;
}

export default function MercadoPagoSettings() {
  const [credentials, setCredentials] = useState<MercadoPagoCredentials>({
    accessToken: '',
    publicKey: '',
    environment: 'sandbox'
  });
  
  const [status, setStatus] = useState<CredentialsStatus>({
    isConfigured: false,
    environment: 'demo',
    isValid: false
  });
  
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCredentialsStatus();
  }, []);

  const loadCredentialsStatus = async () => {
    setIsLoading(true);
    try {
      const credentialsStatus = await mercadoPagoService.getCredentialsStatus();
      setStatus(credentialsStatus);
    } catch (error) {
      console.error('Erro ao carregar status das credenciais:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCredentials = async () => {
    setIsSaving(true);
    setTestResult(null);
    
    try {
      const result = await mercadoPagoService.saveCredentials(credentials);
      
      if (result.success) {
        setTestResult({
          success: true,
          message: result.message
        });
        
        // Recarregar status
        await loadCredentialsStatus();
        
        // Limpar formulário
        setCredentials({
          accessToken: '',
          publicKey: '',
          environment: 'sandbox'
        });
      } else {
        setTestResult({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao salvar credenciais'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const testCredentials = async () => {
    if (!credentials.accessToken) {
      setTestResult({
        success: false,
        message: 'Access Token é obrigatório para o teste'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await mercadoPagoService.testCredentials({
        accessToken: credentials.accessToken,
        environment: credentials.environment
      });
      
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao testar credenciais'
      });
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const clearCredentials = async () => {
    if (confirm('Tem certeza que deseja limpar todas as credenciais do servidor?')) {
      try {
        const result = await mercadoPagoService.clearCredentials();
        
        if (result.success) {
          setTestResult({
            success: true,
            message: result.message
          });
          
          await loadCredentialsStatus();
        } else {
          setTestResult({
            success: false,
            message: result.message
          });
        }
      } catch (error) {
        setTestResult({
          success: false,
          message: 'Erro ao limpar credenciais'
        });
      }
      
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const validateAccessToken = (token: string): boolean => {
    if (credentials.environment === 'sandbox') {
      return token.startsWith('TEST-') && token.length > 20;
    } else {
      return token.startsWith('APP_USR-') && token.length > 20;
    }
  };

  const validatePublicKey = (key: string): boolean => {
    if (credentials.environment === 'sandbox') {
      return key.startsWith('TEST-') && key.length > 20;
    } else {
      return key.startsWith('APP_USR-') && key.length > 20;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-stone-600">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif text-sage-600 flex items-center space-x-2">
            <Shield className="w-6 h-6" />
            <span>Configurações Mercado Pago (Backend Seguro)</span>
          </h3>
          <p className="text-stone-600">Configure suas credenciais de forma segura no servidor</p>
        </div>
        
        {status.isConfigured && (
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-green-600" />
            <div className={`w-3 h-3 rounded-full ${
              status.isValid ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-stone-600">
              {status.isValid ? 'Configurado e validado' : 'Configurado no servidor'}
            </span>
          </div>
        )}
      </div>

      {/* Status Card */}
      <div className={`rounded-lg p-4 border-l-4 ${
        status.isConfigured 
          ? status.isValid 
            ? 'bg-green-50 border-green-400' 
            : 'bg-yellow-50 border-yellow-400'
          : 'bg-blue-50 border-blue-400'
      }`}>
        <div className="flex items-center space-x-2">
          {status.isConfigured ? (
            status.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )
          ) : (
            <Key className="w-5 h-5 text-blue-600" />
          )}
          <div>
            <p className={`font-medium ${
              status.isConfigured 
                ? status.isValid 
                  ? 'text-green-800' 
                  : 'text-yellow-800'
                : 'text-blue-800'
            }`}>
              {status.isConfigured 
                ? status.isValid 
                  ? 'Mercado Pago Configurado e Funcionando'
                  : 'Mercado Pago Configurado - Validação Pendente'
                : 'Mercado Pago Não Configurado'
              }
            </p>
            <p className={`text-sm ${
              status.isConfigured 
                ? status.isValid 
                  ? 'text-green-700' 
                  : 'text-yellow-700'
                : 'text-blue-700'
            }`}>
              {status.isConfigured 
                ? `Ambiente: ${status.environment === 'sandbox' ? 'Teste (Sandbox)' : 'Produção'} • Armazenado no servidor`
                : 'Configure suas credenciais para habilitar pagamentos PIX'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Vantagens do Backend Seguro */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-sage-600 mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Vantagens do Backend Seguro:
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-stone-700">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Credenciais criptografadas no servidor</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Não expostas no navegador</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>API proxy para Mercado Pago</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Validação automática</span>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-stone-50 rounded-lg p-6">
        <h4 className="font-semibold text-sage-600 mb-3">Como obter suas credenciais:</h4>
        <ol className="list-decimal list-inside space-y-2 text-stone-700 text-sm">
          <li>Acesse o <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Mercado Pago Developers <ExternalLink className="w-3 h-3 ml-1" /></a></li>
          <li>Faça login na sua conta</li>
          <li>Crie uma nova aplicação ou acesse uma existente</li>
          <li>Vá em "Credenciais" e copie o Access Token e Public Key</li>
          <li>Para testes, use as credenciais de Sandbox</li>
          <li>Para produção, use as credenciais de Produção</li>
        </ol>
      </div>

      {/* Formulário de Configuração */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-semibold text-sage-600 mb-4">Configurar Credenciais no Servidor</h4>
        
        <div className="space-y-4">
          {/* Ambiente */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Ambiente *
            </label>
            <select
              value={credentials.environment}
              onChange={(e) => setCredentials({
                ...credentials, 
                environment: e.target.value as 'sandbox' | 'production'
              })}
              className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="sandbox">Sandbox (Teste)</option>
              <option value="production">Produção</option>
            </select>
            <p className="text-xs text-stone-500 mt-1">
              Use Sandbox para testes e Produção para pagamentos reais
            </p>
          </div>

          {/* Access Token */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Access Token *
            </label>
            <div className="relative">
              <input
                type={showAccessToken ? 'text' : 'password'}
                value={credentials.accessToken}
                onChange={(e) => setCredentials({
                  ...credentials, 
                  accessToken: e.target.value
                })}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${
                  credentials.accessToken && !validateAccessToken(credentials.accessToken)
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-rose-300 focus:border-primary-500'
                }`}
                placeholder={`${credentials.environment === 'sandbox' ? 'TEST-' : 'APP_USR-'}...`}
              />
              <button
                type="button"
                onClick={() => setShowAccessToken(!showAccessToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showAccessToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {credentials.accessToken && !validateAccessToken(credentials.accessToken) && (
              <p className="text-xs text-red-600 mt-1">
                Token deve começar com {credentials.environment === 'sandbox' ? 'TEST-' : 'APP_USR-'}
              </p>
            )}
          </div>

          {/* Public Key */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Public Key *
            </label>
            <div className="relative">
              <input
                type={showPublicKey ? 'text' : 'password'}
                value={credentials.publicKey}
                onChange={(e) => setCredentials({
                  ...credentials, 
                  publicKey: e.target.value
                })}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${
                  credentials.publicKey && !validatePublicKey(credentials.publicKey)
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-rose-300 focus:border-primary-500'
                }`}
                placeholder={`${credentials.environment === 'sandbox' ? 'TEST-' : 'APP_USR-'}...`}
              />
              <button
                type="button"
                onClick={() => setShowPublicKey(!showPublicKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPublicKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {credentials.publicKey && !validatePublicKey(credentials.publicKey) && (
              <p className="text-xs text-red-600 mt-1">
                Chave deve começar com {credentials.environment === 'sandbox' ? 'TEST-' : 'APP_USR-'}
              </p>
            )}
          </div>
        </div>

        {/* Resultado do Teste */}
        {testResult && (
          <div className={`mt-4 p-3 rounded-lg ${
            testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{testResult.message}</span>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={testCredentials}
            disabled={isTesting || !credentials.accessToken}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Testando...</span>
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                <span>Testar Conexão</span>
              </>
            )}
          </button>

          <button
            onClick={saveCredentials}
            disabled={isSaving || !credentials.accessToken || !credentials.publicKey}
            className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar no Servidor</span>
              </>
            )}
          </button>

          {status.isConfigured && (
            <button
              onClick={clearCredentials}
              className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar do Servidor</span>
            </button>
          )}
        </div>

        {/* Informações Adicionais */}
        {status.lastTested && (
          <div className="mt-4 text-xs text-stone-500">
            Última verificação: {new Date(status.lastTested).toLocaleString('pt-BR')}
          </div>
        )}
      </div>

      {/* Informações de Segurança */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-green-800">Segurança Aprimorada</h5>
            <p className="text-sm text-green-700 mt-1">
              Suas credenciais são criptografadas e armazenadas de forma segura no servidor backend. 
              Elas nunca são expostas no navegador, garantindo máxima segurança para seus pagamentos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}