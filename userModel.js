const bcrypt = require('bcryptjs');

// Simulação de banco de dados em memória (em produção, usar banco real)
let users = [];
let nextUserId = 1;

const userModel = {
    // Criar um novo usuário
    async create(userData) {
        try {
            // Verificar se o usuário já existe
            const existingUser = users.find(user => user.username === userData.username);
            if (existingUser) {
                throw new Error('Usuário já existe');
            }

            // Hash da senha
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            // Criar objeto do usuário
            const newUser = {
                id: nextUserId++,
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                createdAt: new Date()
            };

            // Adicionar à "base de dados"
            users.push(newUser);

            // Retornar usuário sem a senha
            const { password, ...userWithoutPassword } = newUser;
            return userWithoutPassword;

        } catch (error) {
            throw error;
        }
    },

    // Buscar usuário por username
    async findByUsername(username) {
        try {
            const user = users.find(user => user.username === username);
            return user || null;
        } catch (error) {
            throw error;
        }
    },

    // Buscar usuário por ID
    async findById(userId) {
        try {
            const user = users.find(user => user.id === parseInt(userId));
            if (user) {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    // Listar todos os usuários (sem senhas)
    async findAll() {
        try {
            return users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
        } catch (error) {
            throw error;
        }
    },

    // Verificar senha
    async comparePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userModel;