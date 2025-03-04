# Administração da Pizzaria - Cordova App

![Cordova](https://img.shields.io/badge/Cordova-Apache-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

## 📌 Visão Geral

Esta aplicação mobile híbrida foi desenvolvida com **Apache Cordova** para a administração de uma pizzaria. Com ela, é possível gerenciar o cadastro de pizzas, incluindo a captura de fotos, cadastro, edição e exclusão por meio de requisições HTTP para um backend remoto.

## 🛠️ Tecnologias Utilizadas

- **Apache Cordova**
- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **Plugins Cordova:**
  - `cordova-plugin-advanced-http`
  - `cordova-plugin-camera`

## 📋 Pré-requisitos

Antes de executar o projeto, instale:

- **[Node.js](https://nodejs.org/)**
- **[Cordova CLI](https://cordova.apache.org/docs/en/latest/guide/cli/)**
- **Um emulador Android** (ex.: Android Studio ou similar)
- **Conexão com a internet** (para acessar os endpoints remotos)

## 📂 Estrutura do Projeto

```
pizzaria-admin/
├── www/
│   ├── css/
│   │   └── index.css         # Estilos da aplicação
│   ├── js/
│   │   └── index.js          # Lógica da aplicação
│   ├── index.html            # Estrutura HTML da aplicação
├── config.xml                # Configurações do Cordova
└── README.md                 # Este arquivo
```

## ⚙️ Configuração e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/henrique-sdc/Cordova-Pizzaria.git
   cd pizzaria-admin
   ```

2. **Adicionar a plataforma (ex: Android):**
   ```bash
   cordova platform add android
   ```

3. **Instalar os plugins necessários:**
   ```bash
   cordova plugin add cordova-plugin-advanced-http
   cordova plugin add cordova-plugin-camera
   ```

4. **Executar a aplicação:**

   - No emulador Android:
     ```bash
     cordova run android
     ```
   - No navegador:
     ```bash
     cordova run browser -lc --target=chrome
     ```

## 🚀 Funcionamento da Aplicação

A aplicação possui duas telas principais:

### 📌 Tela de Listagem

- Exibe a lista de pizzas já cadastradas
- Permite acessar a tela de cadastro para inserir uma nova pizza ou editar uma existente

### 📌 Tela de Cadastro

Permite o cadastro, edição e exclusão de pizzas. Nesta tela, o usuário pode:

- Capturar a foto da pizza utilizando a câmera do dispositivo
- Preencher os campos **Pizza** e **Preço**
- Salvar, excluir ou cancelar o cadastro

## 🌐 Endpoints Utilizados

- **Cadastro/Atualização/Exclusão:**
  ```http
  POST/PUT/DELETE https://pedidos-pizzaria.glitch.me/admin/pizza/
  ```

- **Listagem de Pizzas:**
  ```http
  GET https://pedidos-pizzaria.glitch.me/admin/pizzas/{PIZZARIA_ID}
  ```

## 📌 Melhorias Futuras

- Implementar validações mais robustas nos formulários
- Adicionar feedback visual aprimorado (ex.: loaders, ícones de sucesso/erro)
- Integrar autenticação para acesso administrativo
- Otimizar o gerenciamento de imagens e cache

