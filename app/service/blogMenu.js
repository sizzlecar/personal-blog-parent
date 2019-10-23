'use strict';

const Service = require('egg').Service;
const sequelize = require('egg').Sequelize;
class BlogMenu extends Service {
  /**
     * 首页获取树形菜单
     */
  async selectAllMenu() {
    return this.ctx.model.BlogMenu.selectAllMenu()
      .then(menus => {
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
      });

  }
  /**
     * 后台管理获取菜单树
     */
  async menuManageSelectAllMenu() {
    const allMenu = await this.selectAllMenu();
    return this.transData(allMenu);
  }
  /**
     * 1.删除原有菜单数据
     * 2.插入新的菜单数据
     */
  async batchUpdateMenu(treeMenu) {
    const insertData = this.transInsertData(treeMenu);
    const result = this.ctx.app.config.baseResult;
    result.data = {};
    this.ctx.logger.info('插入数据：%j', insertData);
    sequelize.transaction(t => {
      // 删除原来的数据
      return this.ctx.model.BlogMenu.deleteMenu({ transaction: t })
        .then(num => {
          this.ctx.logger.info('删除数据行数：%j', num);
          this.ctx.model.BlogMenu.batchInsert(insertData, { transaction: t });
        });

    }).then(() => {
      // Committed
      this.ctx.logger.info('插入数据成功，事务已提交：%j');
      result.code = '0';
      result.message = '更新成功';
      return result;
    }).catch(err => {
      // Rolled back
      this.ctx.logger.info('插入数据发生错误，事务已经回滚：%j', err);
      result.code = '0';
      result.message = '更新失败';
      return result;
    });

  }

  transInsertData(treeMenu) {
    const result = [];
    for (const menu of treeMenu) {
      const model = {};
      model.id = menu.key;
      model.name = menu.title;
      model.level = menu.level;
      if (menu.child) {
        model.children = this.transData(menu.child);
      }
      result.push(model);
    }
    return result;
  }

  transData(allMenu) {

    const result = [];
    for (const menu of allMenu) {
      const res = {};
      res.key = menu.id;
      res.title = menu.name;
      res.level = menu.level;
      res.scopedSlots = { title: 'custom' };
      if (menu.child) {
        res.children = this.transData(menu.child);
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
