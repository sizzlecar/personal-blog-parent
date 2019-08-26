'use strict';

const Controller = require('egg').Controller;

class Blog extends Controller {
  async getBlogList() {
    const { ctx } = this;
    const menuId = ctx.params.menuId;
    ctx.body = await ctx.service.blog.selectBlogListByMenuId(menuId);
  }

  async getBlogDetail() {
    const { ctx } = this;
    const menuId = ctx.params.menuId;
    const blogId = ctx.params.blogId;
    ctx.body = await ctx.service.blog.selectBlogDetail(menuId, blogId);
  }
}

module.exports = Blog;
