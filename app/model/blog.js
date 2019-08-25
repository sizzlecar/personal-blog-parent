'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const Blog = app.model.define('blog', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    menuId: { type: INTEGER, allowNull: false, field: 'menu_id', comment: '菜单id' },
    blogTitle: { type: STRING, allowNull: false, field: 'blog_title', comment: '标题' },
    blogContent: { type: TEXT, allowNull: false, field: 'blog_content', comment: '内容' },
    blogFile: { type: TEXT, allowNull: true, field: 'blog_file', comment: '博客附件' },
    active: { type: INTEGER, allowNull: false, field: 'active', comment: '是否有效，1 有效，0 无效' },
    createTime: { type: DATE, allowNull: false, field: 'create_time', comment: '创建时间' },
    creatorId: { type: INTEGER, allowNull: false, field: 'creator_id', comment: '创建人id' },
    updateTime: { type: DATE, allowNull: false, field: 'update_time', comment: '修改时间' },
    updaterId: { type: INTEGER, allowNull: false, field: 'updater_id', comment: '修改人id' },
  });

  Blog.associate = function() {
    app.model.Blog.hasMany(app.model.BlogComment, { foreignKey: 'blogId', targetKey: 'id', as: 'blogComments' });
  };


  return Blog;
};

