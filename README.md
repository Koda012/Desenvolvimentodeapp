# Upload de Múltiplos Arquivos - Atividade

Este projeto implementa um sistema completo de upload de múltiplos arquivos com frontend responsivo e backend Node.js com validações robustas.

## 🎯 Objetivo da Atividade

Implementar a lógica de comunicação no lado do cliente (Frontend) para consumir o endpoint de upload de múltiplos arquivos configurado no servidor Node.js, respeitando todas as regras de validação definidas no Backend.

## ✨ Funcionalidades Implementadas

### Frontend
- ✅ Interface moderna e responsiva com gradientes e animações
- ✅ Drag and Drop para seleção de arquivos
- ✅ Visualização dos arquivos selecionados em tempo real
- ✅ Validação visual dos requisitos (formatos, tamanho, quantidade)
- ✅ Feedback visual durante o upload (loading state)
- ✅ Tratamento completo de respostas do servidor
- ✅ Design personalizado com cores, tipografia e efeitos únicos

### Backend
- ✅ Servidor Express.js configurado
- ✅ Middleware Multer para upload de arquivos
- ✅ Validações de tipo de arquivo (PNG, JPEG, JPG)
- ✅ Validação de tamanho (máximo 5MB por arquivo)
- ✅ Validação de quantidade (máximo 10 arquivos)
- ✅ Tratamento de erros personalizado
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

2. **Iniciar o servidor:**
   ```bash
   npm start
   ```

3. **Acessar a aplicação:**
   - Frontend: http://localhost:3000
   - Endpoint de upload: http://localhost:3000/upload

## 📁 Estrutura do Projeto

```
📦 upload-multiplos-arquivos/
├── 📄 frontend_atividade.html    # Frontend com implementação completa
├── 📄 server.js                  # Backend Node.js com validações
├── 📄 package.json              # Configurações e dependências
├── 📄 README.md                 # Documentação do projeto
└── 📁 uploads/                  # Pasta para arquivos enviados
```

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js, Multer
- **Estilo**: CSS Grid/Flexbox, Gradientes, Animações
- **Icons**: Font Awesome 6.0

## 📝 Notas da Implementação

- Código limpo e bem comentado
- Tratamento completo de erros
- Interface responsiva e acessível
- Validações tanto no frontend quanto no backend
- Seguindo exatamente os requisitos da atividade

---

**Desenvolvido por Lucas Maeda - Atividade de Desenvolvimento de Aplicações**