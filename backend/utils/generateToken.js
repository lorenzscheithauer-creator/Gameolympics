import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, 'your_jwt_secret', { // In production, use process.env.JWT_SECRET
    expiresIn: '30d',
  });
};

export default generateToken;
