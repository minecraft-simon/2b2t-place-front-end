module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    devServer: {
        disableHostCheck: true,
        port: 80
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "2b2t our/place";
                return args;
            })
    }
}
