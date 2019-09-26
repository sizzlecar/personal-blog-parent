'use strict';

const jwt = require('jsonwebtoken');
const privateKey = 'jinwandalaohu';
module.exports = options => {
  return async function filter(ctx, next) {
    await next();
    const result = ctx.app.config.baseResult;
    result.data = null;
    const header = ctx.request.header;
    ctx.logger.info(header);
    const tokenStr = header.authorization;
    ctx.logger.info(tokenStr);
    if (tokenStr) {
      const token = tokenStr.replace('Bearer ', '');
      jwt.verify(token, privateKey, function(err, decoded) {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            result.message = 'token已过期，请重新登陆！';
            ctx.body = result;
          } else if (err.name === 'JsonWebTokenError') {
            result.message = 'token错误';
            ctx.body = result;
          } else if (err.name === 'NotBeforeError') {
            result.message = 'jwt not active';
            ctx.body = result;
          }
        }
        ctx.logger.info(decoded);
      });
    } else {
      result.message = '请登陆';
      result.code = 'E0004';
      ctx.body = result;
    }

  };
};
