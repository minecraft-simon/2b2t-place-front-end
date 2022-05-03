module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    devServer: {
        disableHostCheck: true,
        port: 1180
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "our/place 2b2t";
                return args;
            })
    }
}
