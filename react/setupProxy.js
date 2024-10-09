const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/spring',
    createProxyMiddleware({
      // target: "http://localhost:3324",
      target: process.env.REACT_APP_SPRING_API_URL,
      changeOrigin: true,
    })
  );
  app.use(
    '/api/node',
    createProxyMiddleware({
      // target: 'http://localhost:4424',
      target: process.env.REACT_APP_NODE_API_URL,
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/api/fast',
  //   createProxyMiddleware({
  //     // target: 'http://localhost:8000',
  //     // target: process.env.REACT_APP_FAST_API_URL,
  //     changeOrigin: true,
  //   })
  // );
  app.use(
    '/B551182',
    createProxyMiddleware({
      target: 'https://apis.data.go.kr',
      changeOrigin: true,
      secure: false,
    })
  );
};
