const fs = require("fs");
const config = process.env;

module.exports = {
  name: "pruning",
  description: "Toggle pruning of bot messages",
  execute(message) {
    config.PRUNING = !config.PRUNING;

  }
};
