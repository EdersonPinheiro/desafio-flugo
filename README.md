# Desafio Flugo - Cadastro de Colaboradores

Este projeto é uma aplicação web para cadastro de colaboradores, desenvolvida como parte do desafio técnico da Flugo.

## Tecnologias Utilizadas

- **ReactJS** com **TypeScript** e **Vite**
- **Material UI (MUI)** para estilização
- **Firebase Firestore** para persistência de dados
- **React Hook Form** + **Yup** para gerenciamento de formulários e validação

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Adicione uma aplicação web ao seu projeto.
3. No painel do Firestore Database, crie um banco de dados e configure as regras de segurança (para teste, você pode usar o modo de teste).
4. Copie as configurações do SDK do Firebase.
5. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (baseado no `.env.example`):

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

## Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd desafio-flugo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no navegador (geralmente em http://localhost:5173).

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis (Layout, Sidebar).
- `src/pages`: Páginas da aplicação (Lista de Colaboradores, Formulário).
- `src/services`: Serviços de API e configuração do Firebase.
- `src/types`: Definições de tipos TypeScript.
- `src/theme`: Configurações de tema do Material UI.

## Funcionalidades

- Listagem de colaboradores com avatar.
- Formulário de cadastro multi-etapa.
- Validação de campos obrigatórios.
- Persistência de dados no Firebase.

## Hospedando no Firebase

1. Instale o Firebase CLI globalmente:
   ```bash
   npm install -g firebase-tools
   ```

2. Faça login no Firebase:
   ```bash
   firebase login
   ```

3. Inicialize o projeto (caso ainda não esteja inicializado):
   ```bash
   firebase init
   ```
   - Selecione **Hosting** e **Firestore**.
   - Use o projeto criado anteriormente.
   - Defina o diretório público como `dist`.
   - Configure como SPA (Single Page App) respondendo "Yes" para reescrever todas as URLs para `index.html`.

4. Faça o build da aplicação:
   ```bash
   npm run build
   ```

5. Faça o deploy:
   ```bash
   firebase deploy
   ```

6. Acesse a URL fornecida pelo terminal (ex: `https://seu-projeto.web.app`).
