# 📸 Guia para Captura dos 3 Screenshots Obrigatórios
**Atividade: Sistema de Autenticação JWT - Frontend Integrado**

---

## ⚙️ **PREPARAÇÃO ANTES DE INICIAR**

### 1. Certifique-se que o servidor está rodando:
```bash
cd "c:\Users\lucas maeda\Desktop\Desenvolvimentodeapp"
npm start
```
Aguarde a mensagem: `🚀 Servidor rodando em http://localhost:3000`

### 2. Abra o navegador (Chrome ou Edge recomendado)
- Acesse: **http://localhost:3000/frontend_atividade.html**
- Pressione **F12** para abrir o **DevTools**
- Posicione o DevTools ao lado direito ou embaixo da página

---

## 📸 **SCREENSHOT 1: Upload SEM Login (401/403 Unauthorized)**

### 🎯 Objetivo:
Demonstrar que sem token JWT, o upload é bloqueado pelo servidor.

### 📋 Passos:

1. **Limpar o localStorage:**
   - No DevTools, vá em: **Application** → **Local Storage** → **http://localhost:3000**
   - Clique com botão direito em `authToken` (se existir) → **Delete**
   - Ou execute no **Console**: `localStorage.clear()`

2. **Atualizar a página:**
   - Pressione **F5** ou Ctrl+R
   - Verifique que aparece o aviso vermelho: *"É necessário fazer login para enviar arquivos"*
   - O botão deve estar desabilitado ou com texto *"Login Necessário"*

3. **Tentar fazer upload:**
   - Clique no link **"Faça login aqui"** (apenas para mostrar que reconhece a necessidade)
   - OU tente selecionar arquivos se o botão permitir
   - Uma mensagem de erro deve aparecer na interface

4. **Abrir a aba Network:**
   - No DevTools: **Network** (ou Rede)
   - Tente fazer upload novamente (se possível)
   - Você verá uma requisição `upload` com status **401** ou **403**

5. **📸 CAPTURAR O PRINT:**
   - **Mostre na tela:**
     - A interface com o aviso de login necessário
     - O botão desabilitado
     - A aba **Network** mostrando a requisição falhada (401/403) OU
     - A mensagem de erro na UI dizendo "Você precisa fazer login"
   
   **Use Snipping Tool ou Ferramenta de Recorte:**
   - Windows: Pressione `Win + Shift + S`
   - Selecione a área completa (página + DevTools)
   - Salve como: **`Print1_Upload_Sem_Login.png`**

---

## 📸 **SCREENSHOT 2: Login Bem-Sucedido e UI Atualizada**

### 🎯 Objetivo:
Mostrar que após login, o token é salvo no localStorage e a UI muda.

### 📋 Passos:

1. **Garantir que não há token:**
   - Execute no Console: `localStorage.clear()`
   - Atualize a página (F5)

2. **Abrir o painel de autenticação:**
   - Clique no link **"Faça login aqui"**
   - O painel com abas **Login** e **Registro** deve aparecer

3. **Se ainda não tem usuário, criar um:**
   - Clique na aba **Registro**
   - Preencha:
     - Username: `teste`
     - Email: `teste@email.com`
     - Password: `123456`
   - Clique em **Criar Conta**
   - Aguarde mensagem de sucesso

4. **Fazer Login:**
   - Vá para aba **Login** (ou reabra o painel)
   - Preencha:
     - Username: `teste`
     - Password: `123456`
   - Clique em **Entrar**

5. **Verificar mudanças na UI:**
   - ✅ Mensagem de sucesso deve aparecer: *"Login efetuado com sucesso"*
   - ✅ O aviso vermelho deve DESAPARECER
   - ✅ Aparece: *"Logado como: teste"* (azul)
   - ✅ Botão de upload fica HABILITADO
   - ✅ Botão **"Sair"** aparece

6. **Verificar token no localStorage:**
   - No DevTools: **Application** → **Local Storage** → **http://localhost:3000**
   - Você deve ver a chave `authToken` com um valor longo (JWT)
   - **Expanda o token para mostrar o conteúdo**

7. **📸 CAPTURAR O PRINT:**
   - **Mostre na tela:**
     - A interface atualizada (sem aviso vermelho)
     - Mensagem "Logado como: teste"
     - Botão de upload habilitado
     - Botão "Sair" visível
     - DevTools com **Application/Local Storage** mostrando `authToken`
   
   **Capture:**
   - Windows: `Win + Shift + S`
   - Salve como: **`Print2_Login_Sucesso.png`**

---

## 📸 **SCREENSHOT 3: Upload COM Usuário Logado (200/201 Success)**

### 🎯 Objetivo:
Provar que com token válido, o upload funciona e retorna sucesso.

### 📋 Passos:

1. **Garantir que está logado:**
   - Verifique que `authToken` existe no localStorage
   - A UI deve mostrar "Logado como: teste"
   - Botão de upload deve estar habilitado

2. **Preparar imagens para upload:**
   - Tenha 1 a 3 imagens PNG ou JPEG prontas
   - Tamanho individual < 5MB
   - Formatos válidos: .png, .jpg, .jpeg

3. **Selecionar arquivos:**
   - Clique na área de upload ou arraste imagens
   - Verifique que os arquivos aparecem listados

4. **Abrir a aba Network ANTES de enviar:**
   - No DevTools: vá para **Network** (Rede)
   - ✅ Deixe esta aba ABERTA e VISÍVEL

5. **Enviar arquivos:**
   - Clique no botão **"Enviar Arquivos"**
   - Aguarde o processamento

6. **Verificar resposta do servidor:**
   - Na aba **Network**, procure a requisição `upload`
   - Clique nela para ver detalhes
   - **Verifique:**
     - Status: **200 OK** ou **201 Created**
     - Headers → Request Headers → `Authorization: Bearer ...`
     - Response → Deve mostrar JSON com sucesso

7. **Verificar mensagem de sucesso:**
   - Mensagem verde deve aparecer: *"✅ Sucesso! X arquivo(s) enviado(s)..."*
   - Com o ID do usuário: *"Upload por usuário ID: 1"*

8. **📸 CAPTURAR O PRINT:**
   - **Mostre na tela:**
     - Mensagem de sucesso na interface
     - DevTools com aba **Network** aberta
     - Requisição `upload` selecionada
     - Status **200 OK** visível
     - Headers mostrando `Authorization: Bearer ...`
     - Response mostrando JSON de sucesso
   
   **Capture:**
   - Windows: `Win + Shift + S`
   - Salve como: **`Print3_Upload_Autorizado.png`**

---

## 📄 **MONTANDO O DOCUMENTO PDF/WORD**

### Template para copiar:

```
==========================================
SISTEMA DE AUTENTICAÇÃO JWT - FRONTEND
Aluno: [SEU NOME]
Turma: [SUA TURMA]
Data: 14/11/2025
==========================================

PRINT 1: TENTATIVA DE UPLOAD SEM LOGIN (NÃO AUTORIZADO)
--------------------------------------------------------
[COLAR IMAGEM AQUI: Print1_Upload_Sem_Login.png]

Descrição:
- Interface mostrando aviso de login necessário
- Botão de upload desabilitado
- Tentativa de upload resultando em erro 401/403


PRINT 2: LOGIN BEM-SUCEDIDO E UI ATUALIZADA
--------------------------------------------
[COLAR IMAGEM AQUI: Print2_Login_Sucesso.png]

Descrição:
- Mensagem de login bem-sucedido
- Interface atualizada (sem aviso vermelho)
- Exibição do username logado
- Token JWT salvo no localStorage (visível no DevTools)
- Botão de upload habilitado


PRINT 3: UPLOAD DE ARQUIVO COM USUÁRIO LOGADO (AUTORIZADO)
-----------------------------------------------------------
[COLAR IMAGEM AQUI: Print3_Upload_Autorizado.png]

Descrição:
- Upload realizado com sucesso
- Requisição na aba Network com status 200 OK
- Header Authorization: Bearer [token] enviado
- Resposta JSON do servidor com confirmação
- ID do usuário visível na mensagem de sucesso


==========================================
CONCLUSÃO
==========================================
Os três cenários validam o fluxo completo de autenticação:

1. ✅ Sistema bloqueia upload sem autenticação (401/403)
2. ✅ Login salva token JWT no localStorage e atualiza UI
3. ✅ Upload funciona com token válido (200 OK)

Repositório GitHub: https://github.com/Koda012/Desenvolvimentodeapp
==========================================
```

### Como gerar o PDF:

#### **Opção 1: Microsoft Word**
1. Abra o Word
2. Cole o template acima
3. Insira as 3 imagens nos lugares indicados
4. Ajuste tamanho/qualidade das imagens
5. **Arquivo** → **Salvar Como** → **PDF**
6. Nome: `Validacao_Autenticacao_JWT_[SeuNome].pdf`

#### **Opção 2: Google Docs**
1. Acesse docs.google.com
2. Crie novo documento
3. Cole o template
4. Insira imagens (Inserir → Imagem → Upload)
5. **Arquivo** → **Fazer download** → **PDF**

#### **Opção 3: PowerPoint (Mais Visual)**
1. Crie 3 slides
2. Título de cada slide: Print 1, Print 2, Print 3
3. Cole cada screenshot em um slide
4. Adicione descrição em cada um
5. **Arquivo** → **Exportar** → **Criar PDF**

---

## ✅ **CHECKLIST FINAL**

Antes de entregar, confirme:

- [ ] Os 3 prints estão claros e legíveis
- [ ] DevTools está visível nos prints necessários
- [ ] Status HTTP (401/403/200) está visível
- [ ] Token no localStorage está visível no Print 2
- [ ] Mensagens de sucesso/erro estão visíveis
- [ ] Documento está em PDF (ou Word como permitido)
- [ ] Nome do arquivo é descritivo
- [ ] Link do GitHub está no documento
- [ ] Último commit foi ANTES do prazo

---

## 🚀 **DICAS IMPORTANTES**

1. **Qualidade dos prints:**
   - Use resolução alta
   - Certifique-se que textos estão legíveis
   - Não corte informações importantes

2. **Organização:**
   - Mantenha ordem: Print 1 → Print 2 → Print 3
   - Adicione legendas explicativas
   - Destaque pontos importantes (você pode circular em vermelho)

3. **Evidências técnicas:**
   - Mostre SEMPRE o DevTools
   - Headers da requisição são importantes
   - Status HTTP deve estar visível

---

**Boa sorte na entrega! 🎓**
