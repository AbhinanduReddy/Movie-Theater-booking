// const databaseLoader = require("./databaseLoader");
const expressLoader = require("./express_loader");

module.exports = async app => {
//   await databaseLoader();
  expressLoader(app);
};