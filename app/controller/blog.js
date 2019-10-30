'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {
    async getBlogList() {
        const {ctx} = this;
        const blog = ctx.request.body;
        ctx.logger.info('查询blogList：%j', blog);
        ctx.body = await ctx.service.blog.selectBlogListByMenuId(blog);
    }

    async getBlogDetail() {
        const {ctx} = this;
        const menuId = ctx.params.menuId;
        const blogId = ctx.params.blogId;
        ctx.body = await ctx.service.blog.selectBlogDetail(menuId, blogId);
    }
}

module.exports = BlogController;
