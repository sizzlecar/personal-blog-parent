'use strict';
const Service = require('egg').Service;

class Blog extends Service {

  async selectBlogListByMenuId(menuId) {
    return await this.ctx.model.Blog.selectBlogListByMenuId(menuId);
  }

  async selectBlogDetail(menuId, blogId) {
    return await this.ctx.model.Blog.selectBlogDetail(menuId, blogId);
  }


}

module.exports = Blog;
