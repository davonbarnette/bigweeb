if (process.env.NODE_ENV !== 'production') require('dotenv').config({path:__dirname + '/env/dev.env'});
const path = require('path');

const Settings =  {
    DEBUG:process.env.DEBUG,
    HOST:process.env.HOST,
    STATIC_ASSET_PATH: 'static/imgs',
    RELATIVE_ASSET_DIR: path.resolve(__dirname, 'assets'),
    SERVER_PORT:process.env.SERVER_PORT,
    DISCORD_TOKEN:process.env.DISCORD_TOKEN,
};

module.exports = Settings;

