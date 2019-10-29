'use strict';

const Service = require('egg').Service;
class BlogMenu extends Service {


    /**
     * 首页获取树形菜单
     */
    async selectAllMenu() {
        return this.ctx.model.BlogMenu.selectAllMenu()
            .then(menus => {
              return this.transData(this.toTree(menus));
            });

    }


    toTree(menus){
      if (menus == null) {
        return [];
      }
      const rootMenu = [];
      // 将查询到的数据转化为一颗树
      const allMenus = [];
      // 转化为普通对象
      for (const menu of menus) {
        allMenus.push(menu.get());
      }
      // 找出所有的一级节点
      for (const menu of allMenus) {
        if (menu.parentId === 0 && menu.level === 0) {
          // 寻找子节点
          this.findChild(menu, allMenus);
          rootMenu.push(menu);
        }
      }
      return rootMenu;
    }

    /**
     * 后台管理获取菜单树
     */
    async menuManageSelectAllMenu() {
        return await this.selectAllMenu();
    }

    /**
     * 1.删除原有菜单数据
     * 2.插入新的菜单数据
     */
    async batchUpdateMenu(treeMenu) {
        const Op = this.app.Sequelize.Op;
        const treeData = this.transInsertData(treeMenu, null);
        const insertData = this.transLineData(treeData);
        const result = this.ctx.app.config.baseResult;
        result.data = {};
        this.ctx.logger.info('插入数据：%j', insertData);
        this.app.model.transaction(t => {
            // 删除原来的数据
            return this.ctx.model.BlogMenu.deleteMenu({transaction: t, where: {id: {[Op.ne]: 0}}})
                .then(num => {
                    this.ctx.logger.info('删除数据行数：%j', num);
                    return this.ctx.model.BlogMenu.batchInsert(insertData, {transaction: t});
                }).then(insertModels => {
                    this.ctx.logger.info('插入回调数据：%j', insertModels);
                    const updateData = this.updateParentId(insertModels, insertData);
                    this.ctx.logger.info('批量修改数据：%j', updateData);
                    return this.ctx.model.BlogMenu.batchInsert(updateData, {
                        transaction: t,
                        updateOnDuplicate: ['parentId'],
                    });
                });
        }).then(() => {
            // Committed
            this.ctx.logger.info('插入数据成功，事务已提交：%j');
            result.code = '0';
            result.message = '更新成功';
            return result;
        }).catch(err => {
            // Rolled back
            this.ctx.logger.error(err);
            result.code = 'E0002';
            result.message = '更新失败';
            return result;
        });

    }

    /**
     * 修改菜单，名称/层级
     * @param updateModel
     * @returns {Promise<void>}
     */
    async updateMenu(updateModel) {
        const Op = this.app.Sequelize.Op;
        //校验菜单是否存在
        const result = {};
        const menuModel = await this.ctx.model.BlogMenu.selectMenuDetail(updateModel.id);
        if (!menuModel) {
            result.code = 'E0003';
            result.message = '菜单不存在';
            return result;
        }
        //校验名称是否重复
        const count = await this.ctx.model.BlogMenu.selectCount({
            where: {
                id: {[Op.ne]: updateModel.id},
                name: updateModel.name
            }
        });
        //查询parentId 是否存在
        if(updateModel.parentId !== 0){
            const parentMenuModel = await this.ctx.model.BlogMenu.selectMenuDetail(updateModel.parentId);
            if (!parentMenuModel) {
                result.code = 'E0005';
                result.message = '父级菜单不存在';
                return result;
            }
        }


        if (count !== 0) {
            result.code = 'E0004';
            result.message = '菜单名称已存在';
            return result;
        }

        await this.app.model.transaction(t => {
            return this.ctx.model.BlogMenu.updateMenu(updateModel, {
                transaction: t,
                fields: ['name', 'parentId', 'level'],
                where: {id: updateModel.id}
            });
        }).then(() => {
            // Committed
            this.ctx.logger.info('插入数据成功，事务已提交：%j');
            result.code = '0';
            result.message = '更新成功';
        }).catch(err => {
            // Rolled back
            this.ctx.logger.error(err);
            result.code = 'E0005';
            result.message = '更新失败';
        });

    }


    /**
     * 添加菜单
     * @param menuModel
     * @returns {Promise<void>}
     */
    async addMenu(menuModel){
        const result = {};
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
            this.ctx.logger.info('插入数据成功，事务已提交：%j');
            result.code = '0';
            result.message = '更新成功';
        }).catch(err => {
            // Rolled back
            this.ctx.logger.error(err);
            result.code = 'E0005';
            result.message = '更新失败';
        });


    }

  /**
   * 删除菜单
   * @param menu
   * @returns {Promise<void>}
   */
    async deleteMenu(menu){
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
              if (item.key === id) {
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
            menuIds.push(item.key);
            if(item.children){
              const ids = this.findChildMenuId(item.children);
              for (const id of ids){
                menuIds.push(id);
              }
            }
      });

      //查询这些菜单下是否有博客
      const blogCount = await this.ctx.model.Blog.count({where:{menuId:{ [opIn]: menuIds }}});
      if(blogCount > 0){
          throw new Error("当前菜单及其子菜单下含有博客，请删除全部博客之后，再删除该菜单！");
      }

      //删除
      await this.app.model.transaction(t => {
          return this.ctx.model.BlogMenu.deleteMenu({transaction: t, where: {id: { [opIn]: menuIds }}})
      }).then(() => {
          // Committed
          this.ctx.logger.info('插入数据成功，事务已提交：%j');
      }).catch(err => {
          // Rolled back
          throw new Error(err);
      });

  }


  findChildMenuId(arr){
      const menuIds = [];
      for (const menu of arr){
        menuIds.push(menu.key);
        if(menu.children){
          const childMenuIds = this.findChildMenuId(menu.children);
          for (const childMenuId of childMenuIds){
            menuIds.push(childMenuId);
          }
        }
      }
      return menuIds;
  }





    transInsertData(treeMenu, parentMenu) {
        const result = [];
        for (const menu of treeMenu) {
            const model = {};
            model.key = menu.key;
            model.name = menu.title;
            model.level = menu.level;
            model.active = 1;
            model.createdTime = new Date();
            model.updatedTime = new Date();
            if (parentMenu) {
                model.parentKey = parentMenu.key;
            } else {
                model.parentKey = 0;
            }
            if (menu.children) {
                model.children = this.transInsertData(menu.children, menu);
            }
            result.push(model);
        }
        return result;
    }


    transLineData(treeMenu) {
        const result = [];
        for (const menu of treeMenu) {
            result.push(menu);
            if (menu.children && menu.children.length > 0) {
                const childrenList = this.transLineData(menu.children);
                for (const children of childrenList) {
                    result.push(children);
                }
            }
        }
        return result;
    }

    updateParentId(lineData, insertData) {
        const updateModels = [];
        for (const model of lineData) {
            updateModels.push(model.get());
        }
        lineData = updateModels;
        for (const menuA of lineData) {
            const aName = menuA.name;
            for (const menuB of insertData) {
                const bName = menuB.name;
                if (aName === bName) {
                    menuA.key = menuB.key;
                    menuA.parentKey = menuB.parentKey;
                }
            }
        }

        for (const menuA of lineData) {
            const aKey = menuA.key;
            const aId = menuA.id;
            for (const menuB of lineData) {
                const bParentKey = menuB.parentKey;
                const bId = menuB.id;
                if (aId !== bId && bParentKey === aKey) {
                    menuB.parentId = aId;
                }

            }
        }
        return lineData;
    }


    async transData(allMenu) {

        const result = [];
        for (const menu of allMenu) {
            const res = {};
            res.key = menu.id;
            res.title = menu.name;
            res.level = menu.level;
            res.scopedSlots = {
                title: 'operationSlot',
            };
            res.slots = {
                icon: 'iconSlot'
            };
            res.parentId = 0;
            if (menu.child) {
                res.children = await this.transData(menu.child);
                for (const children of res.children){
                    children.parentId = res.key;
                }

            }
            result.push(res);
        }
        return result;
    }

    findChild(root, allMenu) {
        // 找出所有子节点
        const child = [];
        const parentId = root.id;
        for (const menu of allMenu) {
            if (menu.parentId === parentId) {
                child.push(menu);
            }
        }
        root.child = child;
        for (const son of root.child) {
            this.findChild(son, allMenu);
        }
    }

}


module.exports = BlogMenu;
