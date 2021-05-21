const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  //这里意思是检测到api开头的接口并且给其相应的代理
  app.use(
    createProxyMiddleware(
      "/api",
      {
        target: "http://", //请求的后台地址（这里就是真正配置代理地址的地方）
        secure: false,
        changeOrigin: true
        //  pathRewrite: {
        //   "^/api": "/"  //重写部分接口，确保url正确拼接
        //  },
      },
      createProxyMiddleware("/api", {
        target: "http://", //请求的后台地址（这里就是真正配置代理地址的地方）
        secure: false, //如果是https接口 需要配置这个参数为true
        changeOrigin: true //默认false，是否需要改变原始主机头为目标URL
        //  pathRewrite: {
        //   "^/api": "/"  //重写部分接口，确保url正确拼接
        //  },
      })
    )
  );
};
