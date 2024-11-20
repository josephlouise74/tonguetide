const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Increase the max buffer size
config.maxWorkers = 2;
config.transformer.minifierConfig = {
    compress: {
        drop_console: true,
    },
};

module.exports = config;