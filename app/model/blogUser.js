'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const BlogUser = app.model.define('blog_user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    account: { type: STRING, allowNull: false, field: 'account', comment: '账号' },
    password: { type: STRING, allowNull: false, field: 'password', comment: '密码' },
    salt: { type: TEXT, allowNull: false, field: 'salt', comment: '盐值' },
    name: { type: TEXT, allowNull: true, field: 'name', comment: '用户名称' },
    mobileNumber: { type: INTEGER, allowNull: false, field: 'mobile_number', comment: '手机号' },
    createTime: { type: DATE, allowNull: false, field: 'create_time', comment: '创建时间' },
    creatorId: { type: INTEGER, allowNull: false, field: 'creator_id', comment: '创建人id' },
    updateTime: { type: DATE, allowNull: false, field: 'update_time', comment: '修改时间' },
    updaterId: { type: INTEGER, allowNull: false, field: 'updater_id', comment: '修改人id' },
  }, {
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
    tableName: 'blog_user',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });


  BlogUser.selectUserDetail = async function(username) {
    const res = await this.findOne({
      attributes: [ 'id', 'account', 'password', 'salt', 'name', 'mobile_number' ],
      where: {
        account: username,
      },
    });
    return res;
  };

  return BlogUser;
};

