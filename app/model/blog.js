'use strict';

module.exports = app => {
    const {STRING, INTEGER, DATE, TEXT} = app.Sequelize;

    const Blog = app.model.define('blog', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        menuId: {type: INTEGER, allowNull: false, field: 'menu_id', comment: '菜单id'},
        blogTitle: {type: STRING, allowNull: false, field: 'blog_title', comment: '标题'},
        blogDesc: {type: STRING, allowNull: false, field: 'blog_desc', comment: '简介'},
        blogContent: {type: TEXT, allowNull: false, field: 'blog_content', comment: '内容'},
        blogFile: {type: TEXT, allowNull: true, field: 'blog_file', comment: '博客附件'},
        active: {type: INTEGER, allowNull: false, field: 'active', comment: '是否有效，1 有效，0 无效'},
        createTime: {type: DATE, allowNull: false, field: 'create_time', comment: '创建时间'},
        creatorId: {type: INTEGER, allowNull: false, field: 'creator_id', comment: '创建人id'},
        updateTime: {type: DATE, allowNull: false, field: 'update_time', comment: '修改时间'},
        updaterId: {type: INTEGER, allowNull: false, field: 'updater_id', comment: '修改人id'},
    }, {
        timestamps: false,
        underscored: true,
        paranoid: true,
        freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
        tableName: 'blog',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Blog.associate = function () {
        app.model.Blog.hasMany(app.model.BlogComment, {foreignKey: 'blogId', targetKey: 'id', as: 'blogComments'});
    };

    Blog.selectBlogDetail = async function (menuId, blogId) {
        const res = await this.findOne({
            attributes: ['id', 'blogTitle', 'blogDesc', 'blogContent'],
            where: {
                menu_id: menuId,
                id: blogId,
            },
            include: [{
                // association: Blog.hasMany(BlogComment, {foreignKey: "blogId",targetKey: "id"}),
                model: app.model.BlogComment,
                as: 'blogComments',
                required: false,
                attributes: ['id', 'blogId', 'blogComment'],
                where: {
                    active: 1,
                },
            }],
        });
        // 转化为普通对象
        const normalModel = {};
        if (res != null) {
            Object.assign(normalModel, res.dataValues);
        }
        return normalModel;
    };

    Blog.addBlog = async function (blog) {
        return this.create(blog);
    };

    return Blog;
};

