const jwt = require('jsonwebtoken');

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
        
        // Anexar o userId e userRole ao objeto req
        req.userId = decoded.userId;
        req.userRole = decoded.userRole || 'user'; // Fallback para 'user' se não houver role
        next();
    });
}

// ========== MIDDLEWARE DE AUTORIZAÇÃO ADMIN ==========
function verificarAdmin(req, res, next) {
    // Verificar se o usuário tem role de admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            error: true,
            message: 'Acesso negado. Apenas administradores podem realizar esta ação.'
        });
    }
    
    next();
}

module.exports = {
    verificarToken,
    verificarAdmin
};
