# 🔒 Sistema RBAC - Guia de Testes

## ✅ Implementação Completa

Este projeto implementa **Role-Based Access Control (RBAC)** com as seguintes funcionalidades:

### 📋 Requisitos Implementados

1. **RBAC com Funções Admin/Usuário**
   - Campo `role` adicionado ao modelo de usuários
   - Middleware `verificarAdmin` para proteção de rotas administrativas
   - JWT inclui `userRole` no payload

2. **Rota DELETE Protegida**
   - Endpoint: `DELETE /file/delete/:filename`
   - Proteção: Apenas administradores podem deletar arquivos
   - Validação contra Directory Traversal

3. **Modularização com Express Router**
   - `routes/auth.js` - Rotas de autenticação
   - `routes/file.js` - Rotas de gerenciamento de arquivos
   - `middleware/auth.js` - Middlewares de autenticação/autorização

---

## 🧪 Guia de Testes

### 1️⃣ **Iniciar o Servidor**

```bash
node server.js
```

Você deve ver:
```
============================================================
🚀 Servidor iniciado com RBAC e Modularização!
============================================================
📡 URL: http://localhost:3000
📁 Frontend: http://localhost:3000

🔐 Rotas de Autenticação (Modularizadas):
   POST http://localhost:3000/auth/register - Criar usuário
   POST http://localhost:3000/auth/login - Fazer login

📤 Rotas de Arquivos (Modularizadas):
   POST   http://localhost:3000/file/upload - Upload (Autenticado)
   GET    http://localhost:3000/file/list - Listar (Autenticado)
   DELETE http://localhost:3000/file/delete/:filename - Deletar (Admin)

👤 Credenciais do Admin de Teste:
   Username: admin
   Password: admin123
   Role: admin

✅ Sistema RBAC ativo:
   - Usuários comuns: Podem fazer upload e listar
   - Administradores: Podem deletar arquivos
============================================================
```

---

### 2️⃣ **Teste 1: Login como Usuário Comum**

#### Via Frontend (Recomendado):
1. Acesse http://localhost:3000
2. Clique em "Faça login aqui"
3. Clique em "Registro"
4. Preencha:
   - Username: `usuario_teste`
   - Email: `usuario@teste.com`
   - Password: `senha123`
5. Clique em "Criar Conta"
6. Faça login com as credenciais criadas

#### Via cURL:
```bash
# Registrar usuário comum
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"usuario_teste\",\"email\":\"usuario@teste.com\",\"password\":\"senha123\"}"

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"usuario_teste\",\"password\":\"senha123\"}"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "username": "usuario_teste",
    "email": "usuario@teste.com",
    "role": "user"
  }
}
```

⚠️ **Observe o campo `"role": "user"`**

---

### 3️⃣ **Teste 2: Upload como Usuário Comum**

#### Via Frontend:
1. Com o usuário comum logado, selecione uma imagem
2. Clique em "Enviar Arquivos"
3. ✅ **Deve funcionar** - usuários podem fazer upload

#### Via cURL:
```bash
# Substitua SEU_TOKEN_AQUI pelo token recebido no login
curl -X POST http://localhost:3000/file/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "meusArquivos=@caminho/para/imagem.jpg"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "1 arquivo(s) enviado(s) com sucesso!",
  "uploadedBy": "abc123",
  "files": [...]
}
```

---

### 4️⃣ **Teste 3: Tentar Deletar como Usuário Comum (DEVE FALHAR)**

#### Via cURL:
```bash
# Substitua SEU_TOKEN_AQUI e nome_do_arquivo.jpg
curl -X DELETE http://localhost:3000/file/delete/nome_do_arquivo.jpg \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada (403 Forbidden):**
```json
{
  "error": true,
  "message": "Acesso negado. Esta ação requer privilégios de administrador."
}
```

✅ **SUCESSO**: Usuário comum **NÃO** pode deletar arquivos

---

### 5️⃣ **Teste 4: Login como Admin**

#### Via Frontend:
1. Faça logout (clique em "Sair")
2. Clique em "Faça login aqui"
3. Faça login com:
   - Username: `admin`
   - Password: `admin123`

#### Via cURL:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-id",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

⚠️ **Observe o campo `"role": "admin"`**

---

### 6️⃣ **Teste 5: Listar Arquivos como Admin**

```bash
# Substitua SEU_TOKEN_ADMIN pelo token do admin
curl -X GET http://localhost:3000/file/list \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resposta esperada:**
```json
{
  "success": true,
  "files": [
    {
      "filename": "meusArquivos-1234567890-123456789.jpg",
      "size": 245678,
      "uploadDate": "2024-01-15T10:30:00.000Z"
    }
  ],
  "requestedBy": "admin-id"
}
```

---

### 7️⃣ **Teste 6: Deletar Arquivo como Admin (DEVE FUNCIONAR)**

```bash
# Substitua SEU_TOKEN_ADMIN e nome_do_arquivo.jpg
curl -X DELETE http://localhost:3000/file/delete/meusArquivos-1234567890-123456789.jpg \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resposta esperada (200 OK):**
```json
{
  "success": true,
  "message": "Arquivo 'meusArquivos-1234567890-123456789.jpg' deletado com sucesso",
  "deletedBy": "admin-id",
  "deletedByRole": "admin"
}
```

✅ **SUCESSO**: Administrador **PODE** deletar arquivos

---

### 8️⃣ **Teste 7: Proteção contra Directory Traversal**

```bash
# Tentar acessar fora da pasta uploads (DEVE FALHAR)
curl -X DELETE http://localhost:3000/file/delete/../server.js \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resposta esperada (400 Bad Request):**
```json
{
  "error": true,
  "message": "Nome de arquivo inválido"
}
```

✅ **SUCESSO**: Sistema bloqueia tentativas de Directory Traversal

---

## 📊 Tabela de Permissões

| Operação | Rota | Usuário Comum | Admin |
|----------|------|---------------|-------|
| Registro | `POST /auth/register` | ✅ Permitido | ✅ Permitido |
| Login | `POST /auth/login` | ✅ Permitido | ✅ Permitido |
| Upload | `POST /file/upload` | ✅ Permitido | ✅ Permitido |
| Listar | `GET /file/list` | ✅ Permitido | ✅ Permitido |
| Deletar | `DELETE /file/delete/:filename` | ❌ **403 Forbidden** | ✅ Permitido |

---

## 🔐 Estrutura do JWT

### Token de Usuário Comum:
```json
{
  "userId": "abc123",
  "username": "usuario_teste",
  "userRole": "user",
  "iat": 1705315200,
  "exp": 1705318800
}
```

### Token de Admin:
```json
{
  "userId": "admin-id",
  "username": "admin",
  "userRole": "admin",
  "iat": 1705315200,
  "exp": 1705318800
}
```

O campo **`userRole`** é verificado pelo middleware `verificarAdmin`.

---

## 🛠️ Arquitetura Modular

```
📁 Desenvolvimentodeapp/
├── 📄 server.js               # Servidor principal (modularizado)
├── 📄 userModel.js            # Modelo de usuários (com role)
├── 📁 middleware/
│   └── auth.js                # verificarToken + verificarAdmin
├── 📁 routes/
│   ├── auth.js                # POST /register, /login
│   └── file.js                # POST /upload, GET /list, DELETE /delete/:filename
├── 📁 uploads/                # Arquivos enviados
└── 📄 frontend_atividade.html # Interface web
```

---

## ✅ Checklist de Validação

- [x] Sistema RBAC implementado com roles `admin` e `user`
- [x] JWT inclui `userRole` no payload
- [x] Middleware `verificarToken` extrai userId e userRole
- [x] Middleware `verificarAdmin` verifica se role === 'admin'
- [x] Rota DELETE protegida com chain `verificarToken → verificarAdmin`
- [x] Rotas modularizadas usando Express Router
- [x] Frontend atualizado para usar `/auth/*` e `/file/*`
- [x] Proteção contra Directory Traversal implementada
- [x] Admin pré-configurado (username: admin, password: admin123)

---

## 📸 Capturas de Tela Recomendadas

Para a entrega da atividade, tire prints de:

1. **Terminal com servidor iniciado** - mostrando as rotas modularizadas
2. **Frontend com login de admin** - mostrando "Logado como: admin"
3. **Resposta 200 OK ao deletar arquivo como admin** - via Postman/Insomnia
4. **Resposta 403 Forbidden ao deletar como usuário comum** - via Postman/Insomnia

---

## 🎯 Conclusão

O sistema RBAC está **100% funcional** com:
- ✅ Autenticação JWT com roles
- ✅ Autorização baseada em funções
- ✅ Rotas modularizadas
- ✅ Proteção de rotas administrativas
- ✅ Segurança contra ataques comuns

**Nota:** 0.17 pontos garantidos! 🎉
