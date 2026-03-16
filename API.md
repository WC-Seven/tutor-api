# API Documentation - English Learning App

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Base URL](#base-url)
4. [Endpoints de Perfil](#endpoints-de-perfil)
5. [Endpoints de Chat](#endpoints-de-chat)
6. [Endpoints de Áudio](#endpoints-de-áudio)
7. [Códigos de Erro](#códigos-de-erro)
8. [Rate Limits](#rate-limits)
9. [Exemplos de Uso](#exemplos-de-uso)

---

## 🔍 Visão Geral

A API do English Learning App é um serviço RESTful que gerencia:

- **Perfis de usuários** — Dados pessoais e preferências de aprendizado
- **Conversas com IA** — Processamento de mensagens e geração de respostas
- **Transcrição de áudio** — Conversão de fala em texto
- **Histórico de sessões** — Rastreamento de progresso

**Versão da API:** 1.0.0  
**Última atualização:** Março 2026

---

## 🔐 Autenticação

### Status Atual
No MVP, a autenticação é **opcional**. Cada requisição pode incluir um `userId` opcional.

### Implementação Futura
Quando escalar, será implementado JWT (JSON Web Tokens).

### Header de Autenticação (Futuro)

Authorization: Bearer

---

## 🌐 Base URL

### Desenvolvimento Local
http://localhost:5000/api

### Produção (Futuro)
https://api.englishlearningapp.com/api

---

## 👤 Endpoints de Perfil

### 1. Criar Perfil

Cria um novo perfil de usuário com suas informações e preferências.

**Endpoint:**
POST /profile/create

**Headers:**
Content-Type: application/json

**Body:**

json
Copiar

{
  "name": "Wellington",
  "area": "TI",
  "role": "Programador Node/React",
  "level": "intermediate",
  "goals": "Conversar em entrevistas técnicas e dailies"
}




**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | ✅ | Nome completo do usuário |
| `area` | string | ✅ | Área de atuação (TI, Vendas, Marketing, etc) |
| `role` | string | ✅ | Cargo ou função específica |
| `level` | string | ✅ | Nível de inglês (beginner, intermediate, advanced) |
| `goals` | string | ✅ | Objetivo principal de aprendizado |

**Response (201 Created):**

json
Copiar

{
  "success": true,
  "message": "Perfil criado com sucesso!",
  "profile": {
    "id": 1710604800000,
    "name": "Wellington",
    "area": "TI",
    "role": "Programador Node/React",
    "level": "intermediate",
    "goals": "Conversar em entrevistas técnicas e dailies",
    "createdAt": "2026-03-16T18:37:00Z"
  }
}




**Exemplo cURL:**

bash
Copiar

curl -X POST http://localhost:5000/api/profile/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wellington",
    "area": "TI",
    "role": "Programador Node/React",
    "level": "intermediate",
    "goals": "Conversar em entrevistas técnicas"
  }'




**Exemplo JavaScript (Axios):**

javascript
Copiar

import axios from 'axios';

const createProfile = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/profile/create', {
      name: 'Wellington',
      area: 'TI',
      role: 'Programador Node/React',
      level: 'intermediate',
      goals: 'Conversar em entrevistas técnicas'
    });
    console.log(response.data.profile);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
};




---

### 2. Obter Perfil

Recupera as informações de um perfil existente.

**Endpoint:**
GET /profile/:id

**Parâmetros de URL:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string | ID único do perfil |

**Response (200 OK):**

json
Copiar

{
  "id": 1710604800000,
  "name": "Wellington",
  "area": "TI",
  "role": "Programador Node/React",
  "level": "intermediate",
  "goals": "Conversar em entrevistas técnicas e dailies",
  "createdAt": "2026-03-16T18:37:00Z",
  "lastUpdated": "2026-03-16T18:37:00Z"
}




**Exemplo cURL:**

bash
Copiar

curl -X GET http://localhost:5000/api/profile/1710604800000




**Exemplo JavaScript:**

javascript
Copiar

const getProfile = async (profileId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/profile/${profileId}`);
    console.log(response.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
};




---

### 3. Atualizar Perfil (Futuro)

Atualiza informações de um perfil existente.

**Endpoint:**
PUT /profile/:id

**Body:**

json
Copiar

{
  "goals": "Novo objetivo de aprendizado",
  "level": "advanced"
}




**Response (200 OK):**

json
Copiar

{
  "success": true,
  "message": "Perfil atualizado com sucesso!",
  "profile": { ... }
}




---

## 💬 Endpoints de Chat

### 1. Enviar Mensagem

Envia uma mensagem de texto e recebe uma resposta da IA.

**Endpoint:**
POST /chat/message

**Headers:**
Content-Type: application/json

**Body:**

json
Copiar

{
  "message": "How do I explain REST APIs in English?",
  "profile": {
    "id": 1710604800000,
    "name": "Wellington",
    "area": "TI",
    "role": "Programador Node/React",
    "level": "intermediate",
    "goals": "Conversar em entrevistas técnicas"
  },
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "Hello Wellington! I'm your English tutor..."
    },
    {
      "role": "user",
      "content": "Hi! I want to practice technical conversations."
    }
  ]
}




**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `message` | string | ✅ | Mensagem do usuário |
| `profile` | object | ✅ | Objeto com dados do perfil do usuário |
| `conversationHistory` | array | ✅ | Histórico de mensagens anteriores |

**Response (200 OK):**

json
Copiar

{
  "success": true,
  "message": "REST APIs are a way to communicate between systems. Let me help you explain this in English. You could say: 'A REST API is an architectural style that uses HTTP requests to perform CRUD operations on resources.' How would you explain it to a recruiter?",
  "usage": {
    "prompt_tokens": 245,
    "completion_tokens": 89,
    "total_tokens": 334
  }
}




**Campos de Response:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `success` | boolean | Indica sucesso da operação |
| `message` | string | Resposta da IA |
| `usage` | object | Estatísticas de tokens utilizados |

**Exemplo cURL:**

bash
Copiar

curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I explain REST APIs?",
    "profile": {
      "id": 1710604800000,
      "name": "Wellington",
      "area": "TI",
      "role": "Programador Node/React",
      "level": "intermediate",
      "goals": "Conversar em entrevistas técnicas"
    },
    "conversationHistory": []
  }'




**Exemplo JavaScript:**

javascript
Copiar

const sendMessage = async (message, profile, history) => {
  try {
    const response = await axios.post('http://localhost:5000/api/chat/message', {
      message,
      profile,
      conversationHistory: history
    });
    console.log(response.data.message);
    return response.data.message;
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
};




---

### 2. Obter Histórico de Conversa (Futuro)

Recupera o histórico completo de uma conversa.

**Endpoint:**
GET /chat/history/:conversationId

**Response (200 OK):**

json
Copiar

{
  "conversationId": "conv_123456",
  "profileId": 1710604800000,
  "createdAt": "2026-03-16T18:37:00Z",
  "messages": [
    {
      "id": "msg_1",
      "role": "assistant",
      "content": "Hello Wellington!",
      "timestamp": "2026-03-16T18:37:00Z"
    },
    {
      "id": "msg_2",
      "role": "user",
      "content": "Hi! How are you?",
      "timestamp": "2026-03-16T18:38:00Z"
    }
  ]
}




---

### 3. Obter Feedback de Conversa (Futuro)

Recebe análise e feedback sobre o desempenho na conversa.

**Endpoint:**
POST /chat/feedback

**Body:**

json
Copiar

{
  "conversationId": "conv_123456",
  "profileId": 1710604800000
}




**Response (200 OK):**

json
Copiar

{
  "success": true,
  "feedback": {
    "overallScore": 7.5,
    "strengths": [
      "Boa pronúncia de termos técnicos",
      "Vocabulário apropriado para a área"
    ],
    "improvements": [
      "Trabalhar em tempos verbais (past tense)",
      "Melhorar fluidez em respostas longas"
    ],
    "commonMistakes": [
      {
        "mistake": "Disse 'I go to the meeting' em vez de 'I went to the meeting'",
        "correction": "Use past tense para eventos que já aconteceram",
        "frequency": 2
      }
    ],
    "suggestedTopics": [
      "Past tense practice",
      "Phrasal verbs in tech"
    ]
  }
}




---

## 🎙️ Endpoints de Áudio

### 1. Transcrever Áudio

Converte áudio (fala) em texto usando Whisper.

**Endpoint:**
POST /chat/transcribe

**Headers:**
Content-Type: application/json

**Body:**

json
Copiar

{
  "audioBase64": "UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
}




**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `audioBase64` | string | ✅ | Arquivo de áudio em formato base64 |

**Response (200 OK):**

json
Copiar

{
  "success": true,
  "transcription": "How do I explain REST APIs in English?",
  "confidence": 0.95,
  "duration": 4.5
}




**Campos de Response:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `success` | boolean | Indica sucesso da operação |
| `transcription` | string | Texto transcrito do áudio |
| `confidence` | number | Confiança da transcrição (0-1) |
| `duration` | number | Duração do áudio em segundos |

**Exemplo JavaScript:**

javascript
Copiar

const transcribeAudio = async (audioBlob) => {
  try {
    // Converter blob para base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];

      const response = await axios.post('http://localhost:5000/api/chat/transcribe', {
        audioBase64: base64
      });

      console.log('Transcrição:', response.data.transcription);
      return response.data.transcription;
    };
    reader.readAsDataURL(audioBlob);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
};




---

### 2. Gerar Fala (Text-to-Speech) (Futuro)

Converte texto em áudio usando síntese de voz.

**Endpoint:**
POST /chat/speak

**Body:**

json
Copiar

{
  "text": "A REST API is an architectural style...",
  "language": "en-US",
  "speed": 0.9
}




**Response (200 OK):**

json
Copiar

{
  "success": true,
  "audioUrl": "data:audio/wav;base64,UklGRiYAAABXQVZFZm10...",
  "duration": 5.2
}




---

## ❌ Códigos de Erro

### 400 Bad Request

Requisição inválida ou parâmetros faltando.


json
Copiar

{
  "success": false,
  "error": "Missing required field: message",
  "statusCode": 400
}




---

### 401 Unauthorized

Autenticação necessária (implementado no futuro).


json
Copiar

{
  "success": false,
  "error": "Invalid or missing authentication token",
  "statusCode": 401
}




---

### 404 Not Found

Recurso não encontrado.


json
Copiar

{
  "success": false,
  "error": "Profile not found",
  "statusCode": 404
}




---

### 429 Too Many Requests

Limite de requisições excedido.


json
Copiar

{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "statusCode": 429,
  "retryAfter": 60
}




---

### 500 Internal Server Error

Erro no servidor.


json
Copiar

{
  "success": false,
  "error": "Internal server error",
  "statusCode": 500,
  "details": "Error message from server"
}




---

## ⏱️ Rate Limits

### Groq API Limits (Free Tier)

| Recurso | Limite | Período |
|---------|--------|---------|
| Requisições de Chat | ~30 req/min | Por minuto |
| Tokens por dia | ~14,000 tokens | 24 horas |
| Whisper (áudio) | ~25 min/dia | 24 horas |

**Nota:** Estes limites são aproximados e podem mudar. Consulte a documentação oficial do Groq.

### Backend Rate Limits (Futuro)

| Endpoint | Limite | Período |
|----------|--------|---------|
| `/chat/message` | 30 req | Por minuto |
| `/chat/transcribe` | 10 req | Por minuto |
| `/profile/create` | 5 req | Por hora |

---

## 📚 Exemplos de Uso

### Exemplo 1: Fluxo Completo de Onboarding + Chat


javascript
Copiar

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 1. Criar perfil
const createUserProfile = async () => {
  const response = await axios.post(`${API_URL}/profile/create`, {
    name: 'Wellington',
    area: 'TI',
    role: 'Programador Node/React',
    level: 'intermediate',
    goals: 'Conversar em entrevistas técnicas'
  });
  return response.data.profile;
};

// 2. Iniciar conversa
const startConversation = async (profile) => {
  const messages = [];

  // Mensagem inicial
  const initialResponse = await axios.post(`${API_URL}/chat/message`, {
    message: 'Hello! I want to practice English for technical interviews.',
    profile,
    conversationHistory: messages
  });

  messages.push({
    role: 'assistant',
    content: initialResponse.data.message
  });

  return messages;
};

// 3. Continuar conversa
const continueConversation = async (profile, messages, userMessage) => {
  messages.push({
    role: 'user',
    content: userMessage
  });

  const response = await axios.post(`${API_URL}/chat/message`, {
    message: userMessage,
    profile,
    conversationHistory: messages
  });

  messages.push({
    role: 'assistant',
    content: response.data.message
  });

  return messages;
};

// Executar fluxo
(async () => {
  try {
    // Criar perfil
    const profile = await createUserProfile();
    console.log('Perfil criado:', profile);

    // Iniciar conversa
    let messages = await startConversation(profile);
    console.log('Resposta inicial:', messages[0].content);

    // Continuar conversa
    messages = await continueConversation(
      profile,
      messages,
      'Can you help me explain REST APIs?'
    );
    console.log('Resposta:', messages[messages.length - 1].content);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
})();




---

### Exemplo 2: Praticar com Áudio


javascript
Copiar

// Gravar áudio do microfone
const recordAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];

      // Transcrever áudio
      const transcriptionResponse = await axios.post(
        `${API_URL}/chat/transcribe`,
        { audioBase64: base64 }
      );

      console.log('Você disse:', transcriptionResponse.data.transcription);

      // Enviar transcrição como mensagem
      const chatResponse = await axios.post(`${API_URL}/chat/message`, {
        message: transcriptionResponse.data.transcription,
        profile,
        conversationHistory: messages
      });

      console.log('Tutor respondeu:', chatResponse.data.message);
    };
    reader.readAsDataURL(audioBlob);
  };

  return mediaRecorder;
};




---

### Exemplo 3: Tratamento de Erros


javascript
Copiar

const sendMessageWithErrorHandling = async (message, profile, history) => {
  try {
    const response = await axios.post(`${API_URL}/chat/message`, {
      message,
      profile,
      conversationHistory: history
    });
    return response.data.message;
  } catch (error) {
    if (error.response?.status === 429) {
      console.error('Limite de requisições excedido. Tente novamente em:', 
        error.response.data.retryAfter, 'segundos');
    } else if (error.response?.status === 400) {
      console.error('Requisição inválida:', error.response.data.error);
    } else if (error.response?.status === 500) {
      console.error('Erro no servidor. Tente novamente mais tarde.');
    } else {
      console.error('Erro desconhecido:', error.message);
    }
  }
};




---

## 🔄 Fluxo de Requisição/Resposta
Cliente (Mobile App) ↓ [Requisição HTTP] ↓ Backend (Node.js + Express) ↓ [Validação] ↓ [Processamento] ↓ [Chamada Groq API] ↓ Groq (IA) ↓ [Resposta] ↓ Backend (Node.js) ↓ [Formatação] ↓ [Resposta HTTP] ↓ Cliente (Mobile App)

---

## 🚀 Próximas Implementações

- [ ] Autenticação JWT
- [ ] Banco de dados para persistência
- [ ] Endpoints de histórico
- [ ] Endpoints de feedback
- [ ] Rate limiting no backend
- [ ] Caching de respostas
- [ ] Webhooks para notificações
- [ ] GraphQL (alternativa a REST)

---

## 📞 Suporte

Para dúvidas sobre a API, consulte:

- **Documentação Groq:** https://console.groq.com/docs
- **Documentação Express:** https://expressjs.com
- **Documentação React Native:** https://reactnative.dev

---

**Versão:** 1.0.0  
**Última atualização:** Março 2026  
**Status:** 🟡 Em Desenvolvimento
📥 Como Salvar Este Arquivo
Crie um arquivo API.md na pasta docs/ do seu projeto:

bash
Copiar

# Na raiz do projeto
mkdir -p docs
touch docs/API.md
# Cole o conteúdo acima no arquivo
Ou diretamente:

bash
Copiar

cat > docs/API.md << 'EOF'
[Cole todo o conteúdo acima aqui]
EOF