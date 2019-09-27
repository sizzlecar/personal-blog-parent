'use strict';
module.exports = {
  getBaseResult(code, message, data) {
    return function() {
      this.code = code ? code : '0';
      this.message = message ? message : '操作成功！';
      this.data = data ? data : null;

    };
  },
};
