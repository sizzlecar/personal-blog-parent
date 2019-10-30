'use strict';
// Create reference instance
const marked = require('marked');

// Set options
// `highlight` example uses `highlight.js`
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
});

const Service = require('egg').Service;

class Blog extends Service {

    async selectBlogListByMenuId(blog) {
        const res = {};
        res.total = 0;
        res.list = [];
        const count = await this.ctx.model.Blog.count({
            where: {
                menuId: blog.menuId,
            }
        });
        if (count === 0) {
            return res;
        }
        res.total = count;
        const blogList = await this.ctx.model.Blog.findAll({
            attributes: ['id', 'blogTitle', 'blogDesc'],
            where: {
                menuId: blog.menuId,
            },
            offset: blog.pageNo,
            limit: blog.pageSize
        });
        if (blogList) {
            res.list = blogList.map(blog => {
                const item = blog.get();
                item.title = item.blogTitle;
                return item;
            })
        }
        return res;
    }

    async selectBlogDetail(menuId, blogId) {
        const detail = await this.ctx.model.Blog.selectBlogDetail(menuId, blogId);
        if (detail && detail.blogContent) {
            detail.blogContent = marked(detail.blogContent);
        }
        return detail;
    }

    async addBlog(menuId, blog) {
        const model = {};
        if (!menuId) {
            model.menuId = 1;
        }
        model.blogTitle = blog.title;
        model.blogDesc = blog.desc;
        model.blogContent = blog.content;
        model.active = 1;
        model.creatorId = 1;
        model.createTime = new Date();
        model.updaterId = 1;
        model.updateTime = new Date();
        const res = await this.ctx.model.Blog.addBlog(model);
        this.ctx.logger.info('插入结果返回值为：%j', res);
        const result = this.ctx.app.config.baseResult;
        result.message = null;
        result.data = {};
        result.code = '0';
        return result;
    }


}

module.exports = Blog;
