'use strict';
const Service = require('egg').Service;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const privateKey = 'jinwandalaohu';

class BlogUser extends Service {

  async login(account, password) {
    const user = await this.ctx.model.BlogUser.selectUserDetail(account);
    this.ctx.logger.info('this.ctx：%j', this.ctx);
    const result = this.ctx.app.config.baseResult;
    result.data = {};
    if (user === null) {
      // 用户不存在
      this.ctx.logger.info('账号为：' + account + '的用户不存在！');
      result.code = 'E0002';
      result.message = '用户不存在！';
      return result;
    }
    const md5Obj = crypto.createHash('md5');
    const enPassword = md5Obj.update(password + user.salt)
      .digest('hex');

    if (user.password !== enPassword) {
      this.ctx.logger.info('密码不正确，数据库密码为：%j，用户输入密码为：%j，用户输入密码加密后为：%j', user.password, password, enPassword);
      result.code = 'E0003';
      result.message = '密码不正确！';
      this.ctx.logger.info('result: %j', result);
      return result;
    }
    result.code = '0';
    result.message = '登录成功';
    // 生成token
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2),
      data: user,
    }, privateKey);
    result.data.token = token;
    return result;


  }


}

module.exports = BlogUser;
