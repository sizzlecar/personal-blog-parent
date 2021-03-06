'use strict';
// Create reference instance
const marked = require('marked');
const moment = require('moment');

// Set options
// `highlight` example uses `highlight.js`
marked.setOptions({
  renderer: new marked.Renderer(),
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
    const Op = this.app.Sequelize.Op;
    const res = {};
    res.total = 0;
    res.list = [];
    const paras = {};
    if (blog.menuId) {
      paras.menuId = blog.menuId;
    }
    if (blog.active) {
      paras.active = blog.active;
    }
    if (blog.searchKey) {
      paras[Op.or] = [
        {
          blogTitle: {
            [Op.like]: '%' + blog.searchKey + '%'
          }
        },
        {
          blogDesc: {
            [Op.like]: '%' + blog.searchKey + '%'
          }
        } ];
    }
    const count = await this.ctx.model.Blog.count({
      where: paras
    });
    if (count === 0) {
      return res;
    }
    res.total = count;
    const blogList = await this.ctx.model.Blog.findAll({
        attributes: [ 'id', 'blogTitle', 'blogDesc', 'menuId', 'updateTime' ],
        where: paras,
        include: [ {
          // association: Blog.hasMany(BlogComment, {foreignKey: "blogId",targetKey: "id"}),
          model: this.app.model.BlogMenu,
          as: 'blogMenu',
          required: false,
          attributes: [ 'id', 'name' ]
        } ],
        offset: blog.pageNo,
        limit: blog.pageSize
      },
      )
    ;
    if (blogList) {
      res.list = blogList.map(blog => {
        const item = blog.get();
        item.title = item.blogTitle;
        item.updateTime = moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss");
        return item;
      });
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

    /**
     * 博客管理查询博客详情
     * @param menuId
     * @param blogId
     * @returns {Promise<void>}
     */
  async selectBlogManagementDetail(menuId, blogId){
      const res = await this.ctx.model.Blog.findOne({
          attributes: ['id', 'blogTitle', 'blogDesc', 'blogContent', 'active'],
          where: {
              menu_id: menuId,
              id: blogId,
          }
      });
      // 转化为普通对象
      const normalModel = {};
      if (res != null) {
          Object.assign(normalModel, res.get());
      }
      return normalModel;
  }



  async addBlog(blog) {
    const menu = await this.ctx.model.BlogMenu.findByPk(blog.menuId);
    if (!menu) {
      throw new Error('菜单不存在！');
    }
    const model = {};
    model.blogTitle = blog.title;
    model.blogDesc = blog.desc;
    model.blogContent = blog.content;
    model.menuId = blog.menuId;
    model.active = 1;
    model.creatorId = 1;
    model.createTime = new Date();
    model.updaterId = 1;
    model.updateTime = new Date();

    await this.app.model.transaction(t => {
      return this.ctx.model.Blog.create(model, {
        transaction: t
      });
    }).then(() => {
        // Committed
    }).catch(err => {
        // Rolled back
        this.ctx.logger.error(err);
        throw new Error('添加博客失败！');
    });
  }

    /**
     * 修改博客
     * @param blog
     * @returns {Promise<void>}
     */
    async updateBlog(blog) {
        const menu = await this.ctx.model.BlogMenu.findByPk(blog.menuId);
        if (!menu) {
            throw new Error('菜单不存在！');
        }
        const existBlog = await this.ctx.model.Blog.findByPk(blog.id);
        if (!existBlog) {
            throw new Error('博客不存在！');
        }
        const updateModel = {};
        if(blog.title){
            updateModel.blogTitle = blog.title;
        }
        if(blog.desc){
            updateModel.blogDesc = blog.desc;
        }
        if(blog.content){
            updateModel.blogContent = blog.content;
        }
        updateModel.active = blog.active;
        updateModel.menuId = blog.menuId;
        updateModel.updateTime = new Date();
        updateModel.id = blog.id;
        await this.app.model.transaction(t => {
            return this.ctx.model.Blog.update(updateModel, {
                transaction: t,
                fields: ['blogTitle', 'blogDesc', 'blogContent', 'menuId', 'active', 'updateTime'],
                where: {id: updateModel.id}
            });
        }).then(() => {
            // Committed
        }).catch(err => {
            // Rolled back
            this.ctx.logger.error(err);
            throw new Error('修改博客失败！');
        });

    }

    /**
     * 删除博客
     * @param blog
     * @returns {Promise<void>}
     */
    async deleteBlog(blog) {
        const menu = await this.ctx.model.BlogMenu.findByPk(blog.menuId);
        if (!menu) {
            throw new Error('菜单不存在！');
        }
        const existBlog = await this.ctx.model.Blog.findByPk(blog.id);
        if (!existBlog) {
            throw new Error('博客不存在！');
        }
        blog.updateTime = new Date();
        await this.app.model.transaction(t => {
            return this.ctx.model.Blog.destroy({
                transaction: t, where: {id: blog.id}
            });
        }).then(() => {
            // Committed
        }).catch(err => {
            // Rolled back
            this.ctx.logger.error(err);
            throw new Error('删除博客失败！');
        });

    }


}

module.exports = Blog;
