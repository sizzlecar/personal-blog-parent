'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const BlogMenu = app.model.define('blog_menu', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: STRING, allowNull: false, field: 'name', comment: '菜单名称' },
    parentId: { type: INTEGER, allowNull: false, field: 'parent_id', comment: '父菜单id，为0的话是1级菜单' },
    level: { type: INTEGER, allowNull: false, field: 'level', comment: '节点等级从0开始' },
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
    tableName: 'blog_menu',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  BlogMenu.selectAllMenu = async function() {
    return await this.findAll();
  };
  return BlogMenu;
};
