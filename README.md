# Site de Casamento - Kriscia e Iverson

## Integração Mercado Pago PIX

Este projeto inclui uma integração completa com a API do Mercado Pago para pagamentos PIX seguros e funcionais.

### Configuração

1. **Obtenha suas credenciais do Mercado Pago:**
   - Acesse: https://www.mercadopago.com.br/developers
   - Crie uma aplicação
   - Obtenha o Access Token e Public Key

2. **Configure as variáveis de ambiente:**
   - Renomeie `.env.local` para `.env`
   - Substitua as credenciais:
   ```
   VITE_MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui
   VITE_MERCADO_PAGO_PUBLIC_KEY=sua_public_key_aqui
   ```

### Funcionalidades

#### Sistema de Pagamento PIX
- ✅ Integração real com API do Mercado Pago
- ✅ Geração automática de QR Code PIX
- ✅ Verificação automática de status do pagamento
- ✅ Interface responsiva e intuitiva
- ✅ Tratamento de erros e fallback
- ✅ Timer de expiração (15 minutos)
- ✅ Cópia automática da chave PIX

#### Segurança
- ✅ IDs únicos para cada transação
- ✅ Validação de dados do pagador
- ✅ Webhook para notificações (configurável)
- ✅ Modo de demonstração quando credenciais não configuradas

#### Fluxo de Pagamento
1. Usuário seleciona presentes
2. Informa dados pessoais (nome e email)
3. Sistema cria pagamento via API Mercado Pago
4. QR Code e chave PIX são gerados
5. Verificação automática do status
6. Confirmação automática quando pago

### Modo Demonstração

Quando as credenciais não estão configuradas, o sistema funciona em modo demonstração:
- Gera códigos PIX simulados
- Permite testar toda a interface
- Botão "Simular Pagamento" para testes

### Estrutura do Projeto

```
src/
├── services/
│   └── mercadoPagoService.ts    # Serviço de integração com MP
├── components/
│   ├── PixPayment.tsx           # Modal de pagamento PIX
│   └── GiftList.tsx             # Lista de presentes
└── ...
```

### Tecnologias Utilizadas

- **React + TypeScript**
- **Mercado Pago SDK**
- **QRCode.js** para geração de QR Codes
- **Tailwind CSS** para estilização
- **Lucide React** para ícones

### Próximos Passos

## Como Adicionar a Música de Fundo

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

1. Configure suas credenciais do Mercado Pago
2. Teste em ambiente de sandbox
3. Configure webhook para notificações
4. Deploy em produção

### Suporte

Para dúvidas sobre a integração Mercado Pago:
- Documentação: https://www.mercadopago.com.br/developers/pt/docs
- Suporte: https://www.mercadopago.com.br/ajuda