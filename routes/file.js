const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

// ========== CONFIGURAÇÃO DO MULTER ==========
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

// ========== ROTA DE UPLOAD (PROTEGIDA) ==========
router.post('/upload', verificarToken, (req, res) => {
    // Imprimir ID e Role do usuário que está fazendo upload
    console.log(`📤 Upload iniciado pelo usuário ID: ${req.userId} | Role: ${req.userRole}`);
    
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
            uploadedBy: req.userId,
            userRole: req.userRole,
            files: req.files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype
            }))
        });
    });
});

// ========== ROTA DE LISTAGEM DE ARQUIVOS (PROTEGIDA) ==========
router.get('/list', verificarToken, (req, res) => {
    console.log(`📋 Listagem de arquivos solicitada pelo usuário ID: ${req.userId} | Role: ${req.userRole}`);
    
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ 
                error: true,
                message: 'Erro ao listar arquivos' 
            });
        }
        
        // Filtrar apenas arquivos (não diretórios)
        const fileList = files.filter(file => {
            const filePath = path.join('uploads', file);
            return fs.statSync(filePath).isFile();
        });
        
        res.json({ 
            success: true,
            files: fileList,
            requestedBy: req.userId,
            userRole: req.userRole
        });
    });
});

// ========== ROTA DE DELEÇÃO DE ARQUIVO (ADMIN APENAS) ==========
router.delete('/delete/:filename', verificarToken, verificarAdmin, (req, res) => {
    try {
        const filename = req.params.filename;
        
        // Validar nome do arquivo para prevenir Directory Traversal
        if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({
                error: true,
                message: 'Nome de arquivo inválido'
            });
        }
        
        // Construir caminho seguro do arquivo
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        
        // Verificar se o arquivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                error: true,
                message: 'Arquivo não encontrado'
            });
        }
        
        // Deletar o arquivo usando fs.unlink
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Erro ao deletar arquivo:', err);
                return res.status(500).json({
                    error: true,
                    message: 'Erro ao deletar arquivo'
                });
            }
            
            console.log(`🗑️  Arquivo deletado: ${filename} | Admin ID: ${req.userId}`);
            
            res.json({
                success: true,
                message: 'Arquivo deletado com sucesso',
                filename: filename,
                deletedBy: req.userId,
                userRole: req.userRole
            });
        });
        
    } catch (error) {
        console.error('Erro na rota de deleção:', error);
        res.status(500).json({
            error: true,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
