const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar o modelo de usuário
const userModel = require('./userModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para CORS
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static('.'));

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Pasta onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
        // Gerar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
    // Verificar se o arquivo é uma imagem
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo inválido.'), false);
    }
};

// Configuração do Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB por arquivo
        files: 10 // Máximo 10 arquivos
    },
    fileFilter: fileFilter
});

// Criar pasta uploads se não existir
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// ========== MIDDLEWARE DE AUTENTICAÇÃO ==========
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
        
        // Anexar o userId ao objeto req
        req.userId = decoded.userId;
        next();
    });
}

// ========== ROTAS DE AUTENTICAÇÃO ==========

// Rota de Registro
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validações básicas
        if (!username || !email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Username, email e password são obrigatórios'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: true,
                message: 'Password deve ter pelo menos 6 caracteres'
            });
        }

        // Criar usuário
        const newUser = await userModel.create({ username, email, password });

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            user: newUser
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(400).json({
            error: true,
            message: error.message || 'Erro ao criar usuário'
        });
    }
});

// Rota de Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validações básicas
        if (!username || !password) {
            return res.status(400).json({
                error: true,
                message: 'Username e password são obrigatórios'
            });
        }

        // Buscar usuário por username
        const user = await userModel.findByUsername(username);
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'Credenciais inválidas'
            });
        }

        // Verificar senha
        const isPasswordValid = await userModel.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: true,
                message: 'Credenciais inválidas'
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            error: true,
            message: 'Erro interno do servidor'
        });
    }
});

// ========== ROTAS PROTEGIDAS ==========

// Rota para upload de múltiplos arquivos (PROTEGIDA)
app.post('/upload', verificarToken, (req, res) => {
    // Imprimir ID do usuário que está fazendo upload (requisito da atividade)
    console.log(`📤 Upload iniciado pelo usuário ID: ${req.userId}`);
    const uploadMiddleware = upload.array('meusArquivos', 10);
    
    uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Erros específicos do Multer
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ 
                    error: true, 
                    message: 'Too many files' 
                });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    error: true, 
                    message: 'Arquivo muito grande. Tamanho máximo: 5MB' 
                });
            }
            return res.status(400).json({ 
                error: true, 
                message: err.message 
            });
        } else if (err) {
            // Outros erros (incluindo filtro de tipo de arquivo)
            return res.status(400).json({ 
                error: true, 
                message: err.message 
            });
        }

        // Sucesso no upload
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                error: true, 
                message: 'Nenhum arquivo foi enviado' 
            });
        }

        // Resposta de sucesso
        res.json({
            success: true,
            message: `${req.files.length} arquivo(s) enviado(s) com sucesso!`,
            uploadedBy: req.userId, // Incluir ID do usuário na resposta
            files: req.files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype
            }))
        });
    });
});

// Rota para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend_atividade.html'));
});

// Rota para listar arquivos enviados (PROTEGIDA)
app.get('/files', verificarToken, (req, res) => {
    console.log(`📋 Listagem de arquivos solicitada pelo usuário ID: ${req.userId}`);
    
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao listar arquivos' });
        }
        res.json({ 
            files: files,
            requestedBy: req.userId
        });
    });
});

// Rota para obter informações do usuário logado
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

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
    res.status(500).json({ 
        error: true, 
        message: 'Erro interno do servidor' 
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Frontend disponível em: http://localhost:${PORT}`);
    console.log(`📤 Endpoint de upload: http://localhost:${PORT}/upload`);
});

module.exports = app;