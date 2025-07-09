const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Chave de criptografia (em produção, use variável de ambiente)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

// Arquivo para armazenar credenciais criptografadas
const CREDENTIALS_FILE = path.join(__dirname, 'credentials.enc');

// Funções de criptografia
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Carregar credenciais do arquivo
async function loadCredentials() {
  try {
    const encryptedData = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const decryptedData = decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    return null;
  }
}

// Salvar credenciais no arquivo
async function saveCredentials(credentials) {
  try {
    const encryptedData = encrypt(JSON.stringify(credentials));
    await fs.writeFile(CREDENTIALS_FILE, encryptedData, 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar credenciais:', error);
    return false;
  }
}

// Validar formato das credenciais
function validateCredentials(credentials) {
  const { accessToken, publicKey, environment } = credentials;
  
  if (!accessToken || !publicKey || !environment) {
    return { valid: false, message: 'Todos os campos são obrigatórios' };
  }
  
  if (environment === 'sandbox') {
    if (!accessToken.startsWith('TEST-') || !publicKey.startsWith('TEST-')) {
      return { valid: false, message: 'Credenciais de sandbox devem começar com TEST-' };
    }
  } else if (environment === 'production') {
    if (!accessToken.startsWith('APP_USR-') || !publicKey.startsWith('APP_USR-')) {
      return { valid: false, message: 'Credenciais de produção devem começar com APP_USR-' };
    }
  }
  
  return { valid: true };
}

// Testar conexão com Mercado Pago
async function testMercadoPagoConnection(accessToken, environment) {
  try {
    const baseUrl = 'https://api.mercadopago.com';
    
    const response = await fetch(`${baseUrl}/v1/account/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return { success: true, message: `Conexão bem-sucedida com ambiente ${environment}` };
    } else {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    return { success: false, message: `Erro na conexão: ${error.message}` };
  }
}

// Rotas da API

// Obter status das credenciais
app.get('/api/credentials/status', async (req, res) => {
  try {
    const credentials = await loadCredentials();
    
    if (!credentials) {
      return res.json({
        isConfigured: false,
        environment: 'demo',
        isValid: false
      });
    }
    
    res.json({
      isConfigured: true,
      environment: credentials.environment,
      isValid: credentials.isValid || false,
      lastTested: credentials.lastTested
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Salvar credenciais
app.post('/api/credentials', async (req, res) => {
  try {
    const { accessToken, publicKey, environment } = req.body;
    
    // Validar credenciais
    const validation = validateCredentials({ accessToken, publicKey, environment });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    
    // Testar conexão
    const testResult = await testMercadoPagoConnection(accessToken, environment);
    
    const credentials = {
      accessToken,
      publicKey,
      environment,
      isConfigured: true,
      isValid: testResult.success,
      lastTested: new Date().toISOString(),
      testMessage: testResult.message
    };
    
    const saved = await saveCredentials(credentials);
    
    if (saved) {
      res.json({
        success: true,
        message: 'Credenciais salvas com sucesso',
        isValid: testResult.success,
        testMessage: testResult.message
      });
    } else {
      res.status(500).json({ error: 'Erro ao salvar credenciais' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Testar credenciais
app.post('/api/credentials/test', async (req, res) => {
  try {
    const { accessToken, environment } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access Token é obrigatório' });
    }
    
    const testResult = await testMercadoPagoConnection(accessToken, environment);
    
    // Atualizar status se as credenciais já estão salvas
    const existingCredentials = await loadCredentials();
    if (existingCredentials && existingCredentials.accessToken === accessToken) {
      existingCredentials.isValid = testResult.success;
      existingCredentials.lastTested = new Date().toISOString();
      existingCredentials.testMessage = testResult.message;
      await saveCredentials(existingCredentials);
    }
    
    res.json(testResult);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Limpar credenciais
app.delete('/api/credentials', async (req, res) => {
  try {
    await fs.unlink(CREDENTIALS_FILE).catch(() => {}); // Ignora erro se arquivo não existe
    res.json({ success: true, message: 'Credenciais removidas com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar pagamento PIX (proxy seguro)
app.post('/api/mercadopago/payments', async (req, res) => {
  try {
    const credentials = await loadCredentials();
    
    if (!credentials || !credentials.isConfigured) {
      return res.status(400).json({ error: 'Mercado Pago não configurado' });
    }
    
    const { amount, description, payerEmail, payerName, externalReference, productId } = req.body;
    
    const requestBody = {
      transaction_amount: amount,
      description,
      payment_method_id: 'pix',
      payer: {
        email: payerEmail,
        first_name: payerName.split(' ')[0],
        last_name: payerName.split(' ').slice(1).join(' ') || 'Silva'
      },
      external_reference: externalReference,
      notification_url: `${req.protocol}://${req.get('host')}/api/mercadopago/webhook`,
      metadata: {
        wedding_gift: true,
        couple_names: 'Kriscia e Iverson',
        product_id: productId?.toString() || 'multiple'
      }
    };
    
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': externalReference
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro na API do Mercado Pago: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Consultar status do pagamento
app.get('/api/mercadopago/payments/:paymentId', async (req, res) => {
  try {
    const credentials = await loadCredentials();
    
    if (!credentials || !credentials.isConfigured) {
      return res.status(400).json({ error: 'Mercado Pago não configurado' });
    }
    
    const { paymentId } = req.params;
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao consultar pagamento: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({
      status: data.status,
      statusDetail: data.status_detail
    });
    
  } catch (error) {
    console.error('Erro ao consultar pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook do Mercado Pago
app.post('/api/mercadopago/webhook', async (req, res) => {
  try {
    console.log('Webhook recebido:', req.body);
    
    // Aqui você pode processar as notificações do Mercado Pago
    // Por exemplo, atualizar status de pagamentos no banco de dados
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Erro');
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
});

module.exports = app;