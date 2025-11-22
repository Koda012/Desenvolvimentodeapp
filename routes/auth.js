const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../userModel');

// ========== ROTA DE REGISTRO ==========
router.post('/register', async (req, res) => {
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

        // Criar usuário (role 'user' é atribuído automaticamente no userModel)
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

// ========== ROTA DE LOGIN ==========
router.post('/login', async (req, res) => {
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

        // Gerar token JWT incluindo userId e userRole
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                userRole: user.role // Incluir role no payload do token
            },
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
                email: user.email,
                role: user.role // Retornar role na resposta
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

module.exports = router;
