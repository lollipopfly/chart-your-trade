module.exports = {
  chainWebpack: (config) => {
    config;
    config.plugin("html").tap((args) => {
      args[0].meta = {
        viewport: "width=device-width,initial-scale=1,user-scalable=no",
      };
      args[0].inject = true;
      args[0].filename = "index.html";
      args[0].favicon = "./src/favicon.png"; // path to favicon

      return args;
    });
  },
};
