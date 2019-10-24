'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.logger.info('controller: %j', controller);
  const filter = app.middleware.filter();
  router.get('/', controller.home.index);
  router.get('/blog/blog-menu/list', controller.blogMenu.getAllMenu);
  router.get('/blog/list/:menuId', controller.blog.getBlogList);
  router.get('/blog/detail/:menuId/:blogId', controller.blog.getBlogDetail);
  router.post('/blog/user/login', controller.blogUser.login);
  router.post('/blog/management/blog/add', filter, controller.management.blogManagement.addBlog);
  router.post('/blog/management/blog-menu/list', filter, controller.management.blogManagement.selectTreeMenu);
  router.post('/blog/management/blog-menu/batch-update', filter, controller.management.blogManagement.updateTreeMenu);
  router.post('/blog/management/blog-menu/update', filter, controller.management.blogManagement.updateMenu);
  router.post('/blog/management/blog-menu/add', filter, controller.management.blogManagement.addMenu);
};
