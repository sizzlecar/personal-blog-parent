'use strict';

const Controller = require('egg').Controller;

class BlogMenuController extends Controller {
  async getAllMenu() {
    const { ctx } = this;
    ctx.body = await ctx.service.blogMenu.selectAllMenu();
  }
}

module.exports = BlogMenuController;
