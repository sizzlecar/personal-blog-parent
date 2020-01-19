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
        const res = {};
        res.code = "0";
        res.data = null;
        res.msg = "添加成功";
        try{
            await ctx.service.blog.addBlog(blog);
        }catch (e) {
            ctx.logger.error(e);
            res.code = "E0009";
            res.msg = e.toString();
        }
        ctx.body =  res;
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
     * 修改菜单 名称，位置
     * @return {Promise<void>}
     */
    async updateMenu() {
        const {ctx} = this;
        const treeMenu = ctx.request.body;
        ctx.logger.info('修改菜单 名称，位置：%j', treeMenu);
        const res = {};
        res.code = "0";
        res.data = null;
        res.msg = "修改成功";
        try{
            await ctx.service.blogMenu.updateMenu(treeMenu);
        }catch (e) {
            ctx.logger.error(e);
            res.code = "E0009";
            res.msg = "修改发生错误"
        }
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
        const res = {};
        res.code = "0";
        res.data = null;
        res.msg = "添加成功";
        try{
            await ctx.service.blogMenu.addMenu(treeMenu);
        }catch (e) {
            ctx.logger.error(e);
            res.code = "E00012";
            res.msg = e.toString();
        }
        ctx.body = res;
    }

    /**
     * 删除菜单
     * @returns {Promise<void>}
     */
    async deleteMenu(){
        const {ctx} = this;
        const treeMenu = ctx.request.body;
        ctx.logger.info('删除菜单：%j', treeMenu);
        const res = {};
        res.code = "0";
        res.data = null;
        res.msg = "删除成功";
        try{
            await ctx.service.blogMenu.deleteMenu(treeMenu);
        }catch (e) {
            ctx.logger.error(e);
            res.code = "E00012";
            res.msg = e.toString();
        }
        ctx.body = res;
    }

    /**
     * 后端查看博客列表
     * @returns {Promise<void>}
     */
    async getBlogList() {
        const {ctx} = this;
        const blog = ctx.request.body;
        ctx.logger.info('查询blogList：%j', blog);
        ctx.body = await ctx.service.blog.selectBlogListByMenuId(blog);
    }

    /**
     * 后端管理查看博客详情
     * @returns {Promise<void>}
     */
    async getBlogDetail() {
        const {ctx} = this;
        const menuId = ctx.params.menuId;
        const blogId = ctx.params.blogId;
        ctx.body = await ctx.service.blog.selectBlogManagementDetail(menuId, blogId);
    }

    /**
     * 后端管理修改博客
     * @returns {Promise<void>}
     */
    async updateBlog() {
        const {ctx} = this;
        const blog = ctx.request.body;
        const res = {};
        res.code = "0";
        res.data = null;
        res.msg = "修改成功";
        try{
            await ctx.service.blog.updateBlog(blog);
        }catch (e) {
            ctx.logger.error(e);
            res.code = "E00012";
            res.msg = e.toString();
        }
        ctx.body = res;
    }

    /**
     * 后端管理删除博客
     * @returns {Promise<void>}
     */
    async deleteBlog() {
        const {ctx} = this;
        const blog = ctx.request.body;
        const res = {};
        res.code = "0";
        res.data = null;
        res.msg = "删除成功";
        try{
            await ctx.service.blog.deleteBlog(blog);
        }catch (e) {
            ctx.logger.error(e);
            res.code = "E00012";
            res.msg = e.toString();
        }
        ctx.body = res;
    }
}

module.exports = BlogManagementController;
