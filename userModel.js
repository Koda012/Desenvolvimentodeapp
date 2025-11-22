const bcrypt = require('bcryptjs');

// Simulação de banco de dados em memória (em produção, usar banco real)
let users = [
    // Usuário Admin para testes (senha: admin123)
    {
        id: 1,
        username: 'admin',
        email: 'admin@sistema.com',
        password: '$2a$10$XqZ8YJ5xGZvK9K4pYqL0FeH8vQxQH5YbZLqZ0qfH5VqZ8YJ5xGZvK', // hash de 'admin123'
        role: 'admin',
        createdAt: new Date()
    }
];
let nextUserId = 2;

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

            // Criar objeto do usuário com role 'user' por padrão
            const newUser = {
                id: nextUserId++,
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                role: userData.role || 'user', // Role padrão: 'user'
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