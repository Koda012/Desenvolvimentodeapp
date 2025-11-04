# Sistema de Upload com Autenticação JWT - Aulas 3, 4 e 5

Este projeto implementa um sistema completo de upload de múltiplos arquivos com autenticação JWT, frontend responsivo e backend Node.js com validações robustas e proteção de rotas.

## 🎯 Objetivos das Atividades

### Aula 3 - Upload de Múltiplos Arquivos
Implementar a lógica de comunicação no lado do cliente (Frontend) para consumir o endpoint de upload de múltiplos arquivos configurado no servidor Node.js.

### Aula 4 - Sistema de Registro de Usuários
Implementar sistema de cadastro de usuários com validação e hash de senhas usando bcrypt.

### Aula 5 - Autenticação JWT e Proteção de Rotas
Finalizar o ciclo de autenticação, implementando login com JWT e proteção de rotas essenciais usando JSON Web Tokens e Middleware.

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticação (Aula 4 e 5)
- ✅ **Registro de Usuários**: Cadastro com validação de dados
- ✅ **Hash de Senhas**: Proteção usando bcryptjs
- ✅ **Login JWT**: Autenticação com JSON Web Tokens
- ✅ **Middleware de Proteção**: Verificação de tokens em rotas protegidas
- ✅ **Gerenciamento de Sessão**: Persistência de login no frontend

### 📁 Sistema de Upload (Aula 3)
- ✅ Interface moderna e responsiva com gradientes e animações
- ✅ Drag and Drop para seleção de arquivos
- ✅ Visualização dos arquivos selecionados em tempo real
- ✅ **Upload Protegido**: Apenas usuários autenticados podem enviar arquivos
- ✅ Validação visual dos requisitos (formatos, tamanho, quantidade)
- ✅ Feedback visual durante o upload (loading state)
- ✅ Tratamento completo de respostas do servidor

### 🛡️ Backend Seguro
- ✅ Servidor Express.js configurado
- ✅ **Autenticação JWT**: Tokens seguros com expiração
- ✅ **Proteção de Rotas**: Middleware verificarToken()
- ✅ **Hash de Senhas**: bcryptjs com salt rounds
- ✅ **Validação de Dados**: Verificação de entrada em todas as rotas
- ✅ Middleware Multer para upload de arquivos
- ✅ Validações de tipo de arquivo (PNG, JPEG, JPG)
- ✅ Validação de tamanho (máximo 5MB por arquivo)
- ✅ Validação de quantidade (máximo 10 arquivos)
- ✅ CORS habilitado para requisições do frontend

## 🛠️ Implementação da Função enviarArquivos()

A função `enviarArquivos()` foi implementada seguindo exatamente a sequência lógica solicitada:

1. **Instanciar o FormData**: Criação do objeto FormData para empacotar os arquivos
2. **Iterar a FileList**: Loop `for...of` percorrendo `arquivoInput.files`
3. **Anexar Arquivos**: Método `.append()` com a chave 'meusArquivos'
4. **Executar o fetch**: Requisição POST para `http://localhost:3000/upload`
5. **Tratamento de Resposta**: Verificação de `response.ok` e exibição de mensagens

```javascript
async function enviarArquivos() {
    // Verificação inicial
    if (!arquivoInput.files || arquivoInput.files.length === 0) {
        exibirMensagem('Por favor, selecione pelo menos um arquivo!', 'error');
        return;
    }

    alterarEstadoBotao(true);

    try {
        // 1. Instanciar o FormData
        const formData = new FormData();

        // 2. Iterar a FileList
        for (const arquivo of arquivoInput.files) {
            // 3. Anexar Arquivos
            formData.append('meusArquivos', arquivo);
        }

        // 4. Executar o fetch
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });

        // 5. Tratamento de Resposta
        if (response.ok) {
            const resultado = await response.json();
            exibirMensagem(`✅ Sucesso! ${arquivoInput.files.length} arquivo(s) enviado(s) com êxito!`, 'success');
            
            // Limpar seleção após sucesso
            arquivoInput.value = '';
            arquivosSelecionadosDiv.innerHTML = '';
        } else {
            const erro = await response.json();
            exibirMensagem(`❌ Erro: ${erro.message || 'Falha no upload'}`, 'error');
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        exibirMensagem('❌ Erro de conexão com o servidor. Verifique se o servidor está rodando.', 'error');
    } finally {
        alterarEstadoBotao(false);
    }
}
```

## 🎨 Melhorias Estéticas Implementadas

- **Design Moderno**: Gradientes coloridos (azul/roxo) e backdrop blur
- **Animações Suaves**: Transições CSS e animações de loading
- **Interface Intuitiva**: Drag and drop, ícones Font Awesome
- **Responsividade**: Layout adaptativo para dispositivos móveis
- **Feedback Visual**: Estados de hover, loading e mensagens animadas
- **Tipografia Elegante**: Fontes modernas e hierarquia visual clara

## 🧪 Validações Testadas

### ✅ SUCESSO
- Envio de 1 a 10 arquivos PNG/JPEG com tamanho < 5MB

### ❌ ERRO (Validação de Quantidade)
- Tentativa de envio de 11+ arquivos
- **Resposta**: "Too many files"

### ❌ ERRO (Validação de Tipo)
- Tentativa de envio de arquivos não-imagem (PDF, ZIP, etc.)
- **Resposta**: "Tipo de arquivo inválido."

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar ambiente:**
   - O arquivo `.env` já está configurado com JWT_SECRET
   - Modifique conforme necessário para produção

3. **Iniciar o servidor:**
   ```bash
   npm start
   ```

4. **Acessar a aplicação:**
   - **Sistema de Autenticação**: http://localhost:3000/auth.html
   - **Upload de Arquivos**: http://localhost:3000/frontend_atividade.html
   - **Servidor API**: http://localhost:3000

## 📋 Fluxo de Uso Completo

1. **Registrar Usuário**: Acesse `/auth.html` e crie uma conta
2. **Fazer Login**: Use as credenciais para obter um token JWT
3. **Upload de Arquivos**: Use o token para enviar arquivos em `/frontend_atividade.html`
4. **Validações**: O sistema valida automaticamente todas as regras de negócio

## 📁 Estrutura do Projeto

```
📦 sistema-upload-autenticacao-jwt/
├── 📄 server.js                     # Backend Node.js com JWT e validações
├── 📄 userModel.js                  # Modelo de dados do usuário
├── 📄 auth.html                     # Frontend de autenticação (Login/Registro)
├── 📄 frontend_atividade.html       # Frontend de upload protegido
├── 📄 package.json                  # Configurações e dependências
├── 📄 .env                          # Variáveis de ambiente (JWT_SECRET)
├── 📄 .gitignore                    # Arquivos ignorados pelo Git
├── 📄 README.md                     # Documentação completa
└── 📁 uploads/                      # Pasta para arquivos enviados
```

## 🔐 Rotas da API

### Rotas Públicas
- `POST /register` - Cadastro de usuário
- `POST /login` - Autenticação e geração de token
- `GET /` - Página principal (redirecionamento)

### Rotas Protegidas (Requerem JWT)
- `POST /upload` - Upload de múltiplos arquivos
- `GET /files` - Listagem de arquivos enviados  
- `GET /profile` - Informações do usuário logado

## 🛡️ Implementações de Segurança

### Middleware de Proteção (`verificarToken`)
```javascript
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            error: true,
            message: 'Token de acesso necessário'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: true,
                message: 'Token inválido ou expirado'
            });
        }
        
        req.userId = decoded.userId; // Anexar userId ao req
        next();
    });
}
```

### Validações de Upload
- ✅ **Autenticação**: Token JWT válido obrigatório
- ✅ **Tipo de Arquivo**: Apenas PNG, JPEG, JPG
- ✅ **Tamanho**: Máximo 5MB por arquivo
- ✅ **Quantidade**: Máximo 10 arquivos por upload
- ✅ **Log de Auditoria**: ID do usuário registrado no console

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js & Express.js**: Servidor web robusto
- **JWT (jsonwebtoken)**: Autenticação stateless segura
- **bcryptjs**: Hash de senhas com salt
- **Multer**: Upload de arquivos multipart
- **dotenv**: Gerenciamento de variáveis de ambiente
- **CORS**: Controle de acesso cross-origin

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Grid/Flexbox, gradientes, animações, responsividade
- **JavaScript ES6+**: Async/await, fetch API, localStorage
- **Font Awesome 6.0**: Ícones vetoriais

### Segurança
- **JWT Tokens**: Autenticação stateless com expiração
- **bcrypt**: Hash de senhas com salt rounds
- **Middleware**: Proteção de rotas sensíveis
- **Validação de Entrada**: Sanitização em todas as rotas

## 📝 Notas da Implementação

- Código limpo e bem comentado
- Tratamento completo de erros
- Interface responsiva e acessível
- Validações tanto no frontend quanto no backend
- Seguindo exatamente os requisitos da atividade

---

**Desenvolvido por Lucas Maeda - Atividade de Desenvolvimento de Aplicações**