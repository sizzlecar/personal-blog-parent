'use strict';

const Controller = require('egg').Controller;

class BlogUserController extends Controller {
  async login() {
    const { ctx } = this;
    const form = ctx.request.body;
    ctx.logger.info('请求参数为：%j', form);
    ctx.body = await ctx.service.blogUser.login(form.account, form.password);
  }
}

module.exports = BlogUserController;
