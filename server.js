const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

// ========== IMPORTAR ROTAS MODULARIZADAS ==========
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');

// Importar middlewares
const { verificarToken } = require('./middleware/auth');
const userModel = require('./userModel');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARES GLOBAIS ==========

// Middleware para CORS
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static('.'));

// ========== CRIAR PASTA UPLOADS SE NÃO EXISTIR ==========
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
    console.log('📁 Pasta uploads/ criada');
}

// ========== MONTAGEM DAS ROTAS MODULARIZADAS ==========

// Rotas de autenticação (prefixo /auth)
app.use('/auth', authRoutes);

// Rotas de arquivos (prefixo /file)
app.use('/file', fileRoutes);

// ========== ROTAS GERAIS ==========

// Rota para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend_atividade.html'));
});

// Rota para obter informações do usuário logado (PROTEGIDA)
app.get('/profile', verificarToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({
            error: true,
            message: 'Erro interno do servidor'
        });
    }
});

// ========== MIDDLEWARE DE TRATAMENTO DE ERROS ==========
app.use((error, req, res, next) => {
    console.error('Erro capturado:', error);
    res.status(500).json({ 
        error: true, 
        message: 'Erro interno do servidor' 
    });
});

// ========== INICIAR O SERVIDOR ==========
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Servidor iniciado com RBAC e Modularização!');
    console.log('='.repeat(60));
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📁 Frontend: http://localhost:${PORT}`);
    console.log('');
    console.log('🔐 Rotas de Autenticação (Modularizadas):');
    console.log(`   POST http://localhost:${PORT}/auth/register - Criar usuário`);
    console.log(`   POST http://localhost:${PORT}/auth/login - Fazer login`);
    console.log('');
    console.log('📤 Rotas de Arquivos (Modularizadas):');
    console.log(`   POST   http://localhost:${PORT}/file/upload - Upload (Autenticado)`);
    console.log(`   GET    http://localhost:${PORT}/file/list - Listar (Autenticado)`);
    console.log(`   DELETE http://localhost:${PORT}/file/delete/:filename - Deletar (Admin)`);
    console.log('');
    console.log('👤 Credenciais do Admin de Teste:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('');
    console.log('✅ Sistema RBAC ativo:');
    console.log('   - Usuários comuns: Podem fazer upload e listar');
    console.log('   - Administradores: Podem deletar arquivos');
    console.log('='.repeat(60));
});

module.exports = app;