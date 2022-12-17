const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api"],
    createProxyMiddleware({
      target: "https://whimsical-heliotrope-ac72e9.netlify.app",
      
    })
  );
};
