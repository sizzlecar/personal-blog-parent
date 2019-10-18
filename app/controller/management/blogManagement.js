'use strict';

const Controller = require('egg').Controller;

class BlogManagementController extends Controller {
  async addBlog() {
    const { ctx } = this;
    const blog = ctx.request.body;
    ctx.logger.info('请求参数为：%j', blog);
    ctx.body = await ctx.service.blog.addBlog(blog.menuId, blog);
  }
  async selectTreeMenu() {
    const { ctx } = this;
    ctx.body = await ctx.service.blogMenu.menuManageSelectAllMenu();
  }
}

module.exports = BlogManagementController;
