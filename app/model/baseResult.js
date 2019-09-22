'use strict';

module.exports = app => {

  const BaseResult = app.model.define('BaseResult', {
    code: 'E0001',
    message: '未知错误',
    data: '',
  });
  return BaseResult;
};
