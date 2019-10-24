/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1566487142349_9525';

  // add your middleware config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'personal_blog',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'ting876587134',
    // custom protocol; default: 'tcp'
    // postgres only, useful for Heroku
    protocol: null,

    // disable logging; default: console.log
    logging: true,

    // you can also pass any dialect options to the underlying dialect library
    // - default is empty
    // - currently supported: 'mysql', 'postgres', 'mssql'
    /* dialectOptions: {
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
        supportBigNumbers: true,
        bigNumberStrings: true
    }, */

    // the storage engine for sqlite
    // - default ':memory:'
    /* storage: 'path/to/database.sqlite', */

    // disable inserting undefined values as NULL
    // - default: false
    omitNull: true,

    // a flag for using a native library or not.
    // in the case of 'pg' -- set this to true will allow SSL support
    // - default: false
    native: true,

    // Specify options, which are used when sequelize.define is called.
    // The following example:
    //   define: { timestamps: false }
    // is basically the same as:
    //   Model.init(attributes, { timestamps: false });
    //   sequelize.define(name, attributes, { timestamps: false });
    // so defining the timestamps for each model will be not necessary
    define: {
      underscored: false,
      freezeTableName: false,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci',
      },
      timestamps: false,
    },

    // similar for sync: you can define this to always force sync for models
    sync: { force: true },

    // pool configuration used to pool database connections
    pool: {
      max: 20,
      idle: 30000,
      acquire: 60000,
    },

    // isolation level of each transaction
    // defaults to dialect default
    // isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
  };


  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    baseResult: {
      code: '0',
      message: '操作成功',
      data: {},
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
// eslint-disable-next-line eggache/no-override-exports

