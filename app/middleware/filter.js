module.exports = options => {
    return async function gzip(ctx, next) {
        await next();

        // 后续中间件执行完成后将响应体转换成 gzip
    };
};