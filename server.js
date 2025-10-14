const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware para CORS
app.use(cors());

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

// Rota para upload de múltiplos arquivos
app.post('/upload', (req, res) => {
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

// Rota para listar arquivos enviados
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao listar arquivos' });
        }
        res.json({ files: files });
    });
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