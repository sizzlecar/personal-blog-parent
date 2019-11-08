'use strict';

const Service = require('egg').Service;

class BlogMenu extends Service {


    /**
     * 首页获取树形菜单
     */
    async selectAllMenu() {
        return this.ctx.model.BlogMenu.findAll()
            .then(menus => {
                return this.toTree(menus);
            });

    }

    /**
     * 后台管理获取菜单树
     */
    async menuManageSelectAllMenu() {
        return await this.selectAllMenu();
    }


    /**
     * 修改菜单，名称/层级
     * @param updateModel
     * @returns {Promise<void>}
     */
    async updateMenu(updateModel) {
        const Op = this.app.Sequelize.Op;
        //校验菜单是否存在
        const menuModel = await this.ctx.model.BlogMenu.selectMenuDetail(updateModel.id);
        if (!menuModel) {
            throw new Error("菜单不存在");
        }
        //校验名称是否重复
        const count = await this.ctx.model.BlogMenu.selectCount({
            where: {
                id: {[Op.ne]: updateModel.id},
                name: updateModel.name
            }
        });
        //查询parentId 是否存在
        if (updateModel.parentId !== 0) {
            const parentMenuModel = await this.ctx.model.BlogMenu.selectMenuDetail(updateModel.parentId);
            if (!parentMenuModel) {
                throw new Error("父菜单不存在");
            }
        }


        if (count !== 0) {
            throw new Error("菜单名称已存在");
        }

        await this.app.model.transaction(t => {
            return this.ctx.model.BlogMenu.updateMenu(updateModel, {
                transaction: t,
                fields: ['name', 'parentId', 'level'],
                where: {id: updateModel.id}
            });
        }).then(() => {
            // Committed
        }).catch(err => {
            // Rolled back
            this.ctx.logger.error(err);
            throw new Error("修改菜单失败");
        });

    }


    /**
     * 添加菜单
     * @param menuModel
     * @returns {Promise<void>}
     */
    async addMenu(menuModel) {
        //校验名称是否重复
        const count = await this.ctx.model.BlogMenu.count({
            where: {
                name: menuModel.name
            }
        });
        if (count !== 0) {
            throw new Error("菜单名称已存在");
        }
        menuModel.active = 1;
        menuModel.createTime = new Date();
        menuModel.updateTime = new Date();
        menuModel.creatorId = 1;
        menuModel.updaterId = 1;

        await this.app.model.transaction(t => {
            return this.ctx.model.BlogMenu.addMenu(menuModel, {
                transaction: t
            });
        }).then(() => {
            // Committed
        }).catch(err => {
            // Rolled back
            this.ctx.logger.error(err);
            throw new Error("添加菜单失败");
        });


    }

    /**
     * 删除菜单
     * @param menu
     * @returns {Promise<void>}
     */
    async deleteMenu(menu) {
        const {in: opIn} = this.app.Sequelize.Op;
        const menuModel = await this.ctx.model.BlogMenu.selectMenuDetail(menu.id);
        if (!menuModel) {
            throw new Error('菜单不存在');
        }
        // 判断当前菜单及其子菜单是否有博客，如果有则不允许删除当前菜单

        //1.先查询出所有的菜单树
        const treeMenus = await this.selectAllMenu();
        const loop = (data, id, callback) => {
            data.forEach((item, index, arr) => {
                if (item.id === id) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, id, callback);
                }
            });
        };


        //找出当前菜单id,及其所有子菜单的id
        const menuIds = [];
        loop(treeMenus, menuModel.id, item => {
            menuIds.push(item.id);
            if (item.children) {
                menuIds.push(...this.findChildMenuId(item.children));
            }
        });

        //查询这些菜单下是否有博客
        const blogCount = await this.ctx.model.Blog.count({where: {menuId: {[opIn]: menuIds}}});
        if (blogCount > 0) {
            throw new Error("当前菜单及其子菜单下含有博客，请删除全部博客之后，再删除该菜单！");
        }

        //删除
        await this.app.model.transaction(t => {
            return this.ctx.model.BlogMenu.deleteMenu({transaction: t, where: {id: {[opIn]: menuIds}}})
        }).then(() => {
            // Committed
            this.ctx.logger.info('插入数据成功，事务已提交：%j');
        }).catch(err => {
            // Rolled back
            throw new Error(err);
        });

    }



    /**
     * 转化为树结构
     * @param menus
     */
    toTree(menus) {
        if (menus == null) {
            return [];
        }
        const treeMenus = [];
        // 转化为普通对象
        const allMenus = menus.map(menu => menu.get());
        //转化为树结构
        allMenus.map(menu => {
            if(menu.parentId === 0){
                this.findChild(menu, allMenus);
                treeMenus.push(menu);
            }
        });
        return treeMenus;
    }

    /**
     * 找出所有的子节点
     * @param root
     * @param allMenu
     */
    findChild(root, allMenu) {
        // 找出所有子节点
        const children = [];
        const parentId = root.id;
        for (const menu of allMenu) {
            if (menu.parentId === parentId) {
                children.push(menu);
            }
        }
        root.children = children;
        for (const son of root.children) {
            this.findChild(son, allMenu);
        }
    }

    /**
     * 寻找所有子节点的id
     * @param arr
     * @returns {Array}
     */
    findChildMenuId(arr) {
        const menuIds = [];
        arr.map(menu => {
            menuIds.push(menu.id);
            if (menu.children) {
                menuIds.push(...this.findChildMenuId(menu.children));
            }
        });
        return menuIds;
    }

}


module.exports = BlogMenu;
