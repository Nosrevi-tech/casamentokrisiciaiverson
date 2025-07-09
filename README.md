# Site de Casamento - Kriscia e Iverson

## 🎉 Sistema Completo de Casamento com Pagamentos PIX

Este projeto é um site completo de casamento com integração nativa ao Mercado Pago para pagamentos PIX seguros e funcionais.

## 🔧 Configuração do Mercado Pago

### Método 1: Interface Administrativa (Recomendado)
1. **Acesse o painel administrativo** do site
2. **Vá na aba "Configurações MP"**
3. **Configure suas credenciais** diretamente na interface
4. **Teste a conexão** antes de usar

### Método 2: Variáveis de Ambiente (Opcional)
Se preferir usar variáveis de ambiente, crie um arquivo `.env`:
```env
VITE_MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui
VITE_MERCADO_PAGO_PUBLIC_KEY=sua_public_key_aqui
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
- ✅ IDs únicos para cada transação
- ✅ Validação de dados do pagador
- ✅ Validação de formato das credenciais
- ✅ Webhook para notificações (configurável)
- ✅ Armazenamento seguro das credenciais
- ✅ Modo demonstração quando não configurado

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
npm install
npm run dev
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
1. **Use HTTPS** em produção
2. **Configure webhooks** para notificações
3. **Monitore transações** regularmente
4. **Use ambiente Sandbox** para testes
5. **Mantenha credenciais seguras**

### Deploy em Produção
```bash
npm run build
# Deploy da pasta dist/ para seu servidor
```

## 📞 Suporte

### Mercado Pago
- Documentação: https://www.mercadopago.com.br/developers/pt/docs
- Suporte: https://www.mercadopago.com.br/ajuda

### Sistema
- Todas as funcionalidades estão integradas
- Interface administrativa completa
- Modo demonstração disponível
- Documentação inline no código

---

💕 **Feito com amor para Kriscia e Iverson** 💕