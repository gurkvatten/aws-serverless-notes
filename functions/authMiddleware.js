const middy = require('@middy/core');
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'your-secret-key'); 
    return decoded; 
  } catch (error) {
    throw new Error('Invalid token'); 
  }
};

const authMiddleware = () => {
  return {
    before: (handler, next) => {
      const token = handler.event.headers.Authorization; 

      if (!token) {
        handler.error = new Error('Authorization token missing');
        handler.error.statusCode = 401;
        return next(handler.error);
      }

      try {
        const decoded = verifyToken(token);
        handler.event.requestContext.authorizer = { principalId: decoded.userId };
        return next();
      } catch (error) {
        handler.error = new Error('Invalid token');
        handler.error.statusCode = 401;
        return next(handler.error);
      }
    }
  };
};

module.exports = {
  authMiddleware,
};