'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/blog/blog-menu/list', controller.blogMenu.getAllMenu);
  router.get('/blog/list/:menuId', controller.blog.getBlogList);
  router.get('/blog/detail/:menuId/:blogId', controller.blog.getBlogDetail);
};
