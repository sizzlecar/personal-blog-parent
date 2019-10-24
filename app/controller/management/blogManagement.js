'use strict';

const Controller = require('egg').Controller;

class BlogManagementController extends Controller {

    /**
     * 添加博客
     * @return {Promise<void>}
     */
    async addBlog() {
        const {ctx} = this;
        const blog = ctx.request.body;
        ctx.logger.info('请求参数为：%j', blog);
        ctx.body = await ctx.service.blog.addBlog(blog.menuId, blog);
    }

    /**
     * 查看菜单树
     * @return {Promise<void>}
     */
    async selectTreeMenu() {
        const {ctx} = this;
        ctx.body = await ctx.service.blogMenu.menuManageSelectAllMenu();
    }

    /**
     * 批量修改菜单
     * @return {Promise<void>}
     */
    async updateTreeMenu() {
        const {ctx} = this;
        const treeMenu = ctx.request.body;
        ctx.logger.info('修改菜单参数为：%j', treeMenu);
        const res = await ctx.service.blogMenu.batchUpdateMenu(treeMenu);
        ctx.logger.info('batchUpdateMenu结果：%j', res);
        const result = {};
        result.code = 'E0002';
        result.message = '更新失败';
        ctx.body = result;
    }


    /**
     * 修改菜单 名称，位置
     * @return {Promise<void>}
     */
    async updateMenu() {
        const {ctx} = this;
        const treeMenu = ctx.request.body;
        ctx.logger.info('修改菜单 名称，位置：%j', treeMenu);
        const res = await ctx.service.blogMenu.updateMenu(treeMenu);
        ctx.logger.info('batchUpdateMenu结果：%j', res);
        ctx.body = res;
    }

    /**
     * 添加菜单
     * @return {Promise<void>}
     */
    async addMenu() {
        const {ctx} = this;
        const treeMenu = ctx.request.body;
        ctx.logger.info('添加菜单：%j', treeMenu);
        const res = await ctx.service.blogMenu.addMenu(treeMenu);
        ctx.logger.info('addMenu结果：%j', res);
        ctx.body = res;
    }
}

module.exports = BlogManagementController;
