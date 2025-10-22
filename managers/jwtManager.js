const jsonwebtoken = require('jsonwebtoken');

const jwtManager = (user) => {
    
    const token = jsonwebtoken.sign(
        { userId: user._id, email: user.email },
        process.env.jwt_secret,
        { expiresIn: '1h' }
    );

    return token;
}

module.exports = jwtManager;
