# Guia de Teste - Sistema de Autenticação JWT

## 🧪 Roteiro de Testes Completos

### 1. Teste de Registro de Usuário
1. Acesse: http://localhost:3000/auth.html
2. Clique na aba "Registro"
3. Preencha os dados:
   - Username: `teste123`
   - Email: `teste@email.com`
   - Password: `123456` (mínimo 6 caracteres)
4. Clique em "Criar Conta"
5. ✅ **Resultado esperado**: Mensagem de sucesso e redirecionamento para login

### 2. Teste de Login e Geração de Token JWT
1. Na aba "Login", use as credenciais criadas:
   - Username: `teste123`
   - Password: `123456`
2. Clique em "Fazer Login"
3. ✅ **Resultado esperado**: 
   - Mensagem de sucesso
   - Token JWT exibido
   - Link para upload de arquivos

### 3. Teste de Upload SEM Token (Deve Falhar)
1. Acesse: http://localhost:3000/frontend_atividade.html
2. Sem fazer login, tente selecionar arquivos
3. ✅ **Resultado esperado**: 
   - Aviso de login necessário
   - Botão desabilitado
   - Mensagem de erro ao tentar upload

### 4. Teste de Upload COM Token (Deve Funcionar)
1. Faça login em http://localhost:3000/auth.html
2. Acesse http://localhost:3000/frontend_atividade.html
3. ✅ **Resultado esperado**: 
   - Informações do usuário exibidas
   - Botão de upload habilitado
4. Selecione 1-10 imagens (PNG/JPEG) menores que 5MB
5. Clique em "Enviar Arquivos"
6. ✅ **Resultado esperado**: Upload bem-sucedido com ID do usuário

### 5. Teste de Validações do Multer

#### 5.1 Teste de Quantidade (Deve Falhar)
- Selecione 11+ arquivos
- ✅ **Resultado esperado**: "Too many files"

#### 5.2 Teste de Tipo (Deve Falhar)
- Selecione um arquivo PDF, TXT ou ZIP
- ✅ **Resultado esperado**: "Tipo de arquivo inválido."

#### 5.3 Teste de Tamanho (Deve Falhar)
- Selecione uma imagem maior que 5MB
- ✅ **Resultado esperado**: "Arquivo muito grande. Tamanho máximo: 5MB"

### 6. Verificação dos Logs do Servidor
No console do servidor, você deve ver:
```
📤 Upload iniciado pelo usuário ID: 1
```

## 🔐 Testando Diretamente via API (Opcional)

### Registro via curl:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"api_test","email":"api@test.com","password":"123456"}'
```

### Login via curl:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"api_test","password":"123456"}'
```

### Upload com Token via curl:
```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "meusArquivos=@caminho/para/imagem.jpg"
```

## ✅ Checklist de Validação

- [ ] Registro de usuário funciona
- [ ] Login gera token JWT válido  
- [ ] Upload sem token falha (401/403)
- [ ] Upload com token funciona
- [ ] Validação de quantidade (11+ arquivos)
- [ ] Validação de tipo (não-imagem)
- [ ] Validação de tamanho (>5MB)
- [ ] ID do usuário aparece nos logs
- [ ] Frontend atualiza estado de autenticação
- [ ] Token persiste no localStorage

## 🛡️ Implementações Obrigatórias Atendidas

✅ **1. JWT e dotenv instalados e configurados**
✅ **2. Rota /login implementada com:**
   - Recebimento de username e password
   - Busca por findByUsername()
   - Verificação com bcrypt.compare()
   - Geração de token JWT com expiração
   - Retorno 200 OK com token ou 401 para falha

✅ **3. Middleware verificarToken implementado:**
   - Verifica header Authorization Bearer
   - Valida token com jwt.verify()
   - Anexa req.userId quando válido
   - Retorna 401/403 para token inválido

✅ **4. Rota /upload protegida:**
   - Middleware verificarToken aplicado
   - console.log(req.userId) implementado
   - Só acessível com token válido

✅ **5. Design personalizado mantido**