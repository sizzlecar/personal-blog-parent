'use strict';

const Service = require('egg').Service;

class BlogMenu extends Service {
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
          const normalModel = {};
          Object.assign(normalModel, menu.dataValues);
          allMenus.push(normalModel);
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

  async menuManageSelectAllMenu() {
    const allMenu = await this.selectAllMenu();
    return this.transData(allMenu);
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
