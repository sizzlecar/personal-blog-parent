'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const BlogComment = app.model.define('blog_comment', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blogId: { type: INTEGER, allowNull: false, field: 'blog_id', comment: '博客id' },
    blogComment: { type: STRING, allowNull: false, field: 'blog_comment', comment: '评论内容' },
    active: { type: INTEGER, allowNull: false, field: 'active', comment: '是否有效，1 有效，0 无效' },
    createTime: { type: DATE, allowNull: false, field: 'create_time', comment: '创建时间' },
    creatorId: { type: INTEGER, allowNull: false, field: 'creator_id', comment: '创建人id' },
    updateTime: { type: DATE, allowNull: false, field: 'update_time', comment: '修改时间' },
    updaterId: { type: INTEGER, allowNull: false, field: 'updater_id', comment: '修改人id' },
  }, {
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
    tableName: 'blog_comment',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });


  return BlogComment;
};
