# Site de Casamento - Kriscia e Iverson

## 🎉 Sistema Completo de Casamento com Pagamentos PIX

Este projeto é um site completo de casamento com integração nativa ao Mercado Pago para pagamentos PIX seguros e funcionais.

## 🔧 Configuração do Mercado Pago

### Método 1: Backend Seguro (Recomendado)
1. **Acesse o painel administrativo** do site
2. **Vá na aba "Configurações MP"**
3. **Configure suas credenciais** de forma segura no servidor
4. **Teste a conexão** antes de usar

### Método 2: Iniciar Backend
```bash
# Instalar dependências do backend
cd server
npm install

# Iniciar servidor backend
npm run dev

# Em outro terminal, iniciar frontend
cd ..
npm run dev

# Ou iniciar ambos simultaneamente
npm run dev:full
```

### Como Obter Credenciais
1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login na sua conta
3. Crie uma aplicação ou acesse uma existente
4. Vá em "Credenciais" e copie:
   - **Access Token** (para processar pagamentos)
   - **Public Key** (para frontend)
5. **Para testes**: Use credenciais de Sandbox (começam com TEST-)
6. **Para produção**: Use credenciais de Produção (começam com APP_USR-)

## ✨ Funcionalidades Principais

### 💳 Sistema de Pagamento PIX
- ✅ Integração real com API do Mercado Pago
- ✅ Configuração via interface administrativa
- ✅ Suporte a ambientes Sandbox e Produção
- ✅ Geração automática de QR Code PIX
- ✅ Verificação automática de status do pagamento
- ✅ Interface responsiva e intuitiva
- ✅ Tratamento de erros e fallback
- ✅ Timer de expiração (15 minutos)
- ✅ Cópia automática da chave PIX
- ✅ Vinculação de produtos por ID

### 🔒 Segurança
- ✅ **Backend seguro** com credenciais criptografadas
- ✅ **Credenciais nunca expostas** no navegador
- ✅ **API proxy** para Mercado Pago
- ✅ **Validação automática** de credenciais
- ✅ **IDs únicos** para cada transação
- ✅ **Webhook** para notificações
- ✅ **Modo demonstração** quando não configurado

### 📊 Painel Administrativo
- ✅ Dashboard completo de pagamentos
- ✅ Gerenciamento de produtos
- ✅ Configuração de credenciais Mercado Pago
- ✅ Monitoramento de pagamentos pendentes
- ✅ Relatórios e métricas
- ✅ Confirmações de presença
- ✅ Mensagens de felicitações

### 🎁 Sistema de Presentes
- ✅ Lista de presentes personalizável
- ✅ Categorização de produtos
- ✅ Controle de estoque
- ✅ Mensagens personalizadas
- ✅ Pagamento via PIX integrado

### 🎵 Recursos Adicionais
- ✅ Player de música de fundo
- ✅ Contagem regressiva
- ✅ Confirmação de presença
- ✅ Informações dos locais
- ✅ Design responsivo e elegante

## 🔄 Fluxo de Pagamento
1. Usuário seleciona presentes
2. Informa dados pessoais (nome e email)
3. Escreve mensagem de felicitações
3. Sistema cria pagamento via API Mercado Pago
4. QR Code e chave PIX são gerados
5. Verificação automática do status
6. Confirmação automática quando pago
7. Presente marcado como comprado
8. Mensagem salva no sistema

## 🧪 Modo Demonstração

Quando as credenciais não estão configuradas:
- Gera códigos PIX simulados
- Permite testar toda a interface
- Botão "Simular Pagamento" para testes
- Funcionalidade completa sem pagamentos reais

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── AdminDashboard.tsx       # Painel administrativo
│   ├── MercadoPagoSettings.tsx  # Configurações MP
│   ├── ProductManager.tsx       # Gerenciamento de produtos
│   ├── CheckoutDashboard.tsx    # Dashboard de pagamentos
│   ├── PendingPayments.tsx      # Pagamentos pendentes
│   ├── PixPayment.tsx           # Modal de pagamento PIX
│   ├── GiftList.tsx             # Lista de presentes
│   └── ...
├── services/
│   └── mercadoPagoService.ts    # Serviço Mercado Pago
└── ...
```

## 🛠️ Tecnologias Utilizadas

- **React + TypeScript**
- **Mercado Pago API**
- **QRCode.js** para geração de QR Codes
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Vite** para build e desenvolvimento

## 🚀 Como Usar

### 1. Configuração Inicial
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..

# Iniciar ambos
npm run dev:full
```

### 2. Configurar Mercado Pago
- Acesse o painel admin (botão de configurações no header)
- Vá em "Configurações MP"
- Insira suas credenciais
- Teste a conexão

### 3. Gerenciar Produtos
- Acesse "Gerenciar Produtos" no painel
- Cadastre seus presentes
- Configure preços e categorias

### 4. Monitorar Pagamentos
- Use "Dashboard Pagamentos" para métricas
- "Pagamentos Pendentes" para acompanhar PIX

## 🎵 Como Adicionar Música de Fundo

1. **Prepare o arquivo de música:**
   - Converta sua música para formato MP3 (recomendado para compatibilidade)
   - Renomeie o arquivo para `wedding-music.mp3`
   - Opcionalmente, crie versões em outros formatos (WAV, OGG) para melhor compatibilidade

2. **Adicione o arquivo ao projeto:**
   - Coloque o arquivo `wedding-music.mp3` na pasta `public/` do projeto
   - O arquivo deve ficar em: `public/wedding-music.mp3`

3. **Funcionalidades do player:**
   - ✅ Reprodução automática após primeira interação do usuário
   - ✅ Controles de play/pause
   - ✅ Controle de volume
   - ✅ Botão mute/unmute
   - ✅ Loop infinito da música
   - ✅ Interface elegante e discreta
   - ✅ Opção de esconder/mostrar controles

4. **Formatos suportados:**
   - MP3 (recomendado)
   - WAV (alta qualidade)
   - OGG (alternativa open source)

## 🔐 Segurança e Produção

### Recomendações de Segurança
1. **Configure ENCRYPTION_KEY** no servidor
2. **Use HTTPS** em produção
3. **Configure webhooks** para notificações
4. **Monitore transações** regularmente
5. **Use ambiente Sandbox** para testes
6. **Backend seguro** com credenciais criptografadas

### Deploy em Produção
```bash
# Frontend
npm run build

# Backend
cd server
npm start

# Configure variáveis de ambiente
ENCRYPTION_KEY=sua_chave_muito_segura_de_32_caracteres
PORT=3001
NODE_ENV=production
```

### Estrutura de Arquivos
```
projeto/
├── src/                     # Frontend React
├── server/                  # Backend Node.js
│   ├── index.js            # Servidor principal
│   ├── package.json        # Dependências do backend
│   └── credentials.enc     # Credenciais criptografadas
├── package.json            # Dependências do frontend
└── README.md
```

## 📞 Suporte

### Mercado Pago
- Documentação: https://www.mercadopago.com.br/developers/pt/docs
- Suporte: https://www.mercadopago.com.br/ajuda

### Sistema
- **Backend seguro** implementado
- **Interface administrativa** completa
- **Credenciais criptografadas** no servidor
- **API proxy** para Mercado Pago
- **Modo demonstração** disponível

---

💕 **Feito com amor para Kriscia e Iverson** 💕