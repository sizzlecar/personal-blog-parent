'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const filter = app.middleware.filter();
  router.get('/', controller.home.index);
  router.get('/blog/blog-menu/list', controller.blogMenu.getAllMenu);
  router.post('/blog/list', controller.blog.getBlogList);
  router.get('/blog/detail/:menuId/:blogId', controller.blog.getBlogDetail);
  router.post('/blog/user/login', controller.blogUser.login);
  router.post('/blog/management/blog/add', filter, controller.management.blogManagement.addBlog);
  router.post('/blog/management/blog/list', filter, controller.management.blogManagement.getBlogList);
  router.get('/blog/management/blog/detail/:menuId/:blogId', filter, controller.management.blogManagement.getBlogDetail);
  router.post('/blog/management/blog/update', filter, controller.management.blogManagement.updateBlog);
  router.post('/blog/management/blog/delete', filter, controller.management.blogManagement.deleteBlog);
  router.post('/blog/management/blog-menu/list', filter, controller.management.blogManagement.selectTreeMenu);
  router.post('/blog/management/blog-menu/update', filter, controller.management.blogManagement.updateMenu);
  router.post('/blog/management/blog-menu/add', filter, controller.management.blogManagement.addMenu);
  router.post('/blog/management/blog-menu/delete', filter, controller.management.blogManagement.deleteMenu);
};
