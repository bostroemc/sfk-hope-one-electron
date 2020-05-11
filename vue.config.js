module.exports = {
    chainWebpack: config => {
        config.module
            .rule('raw')
            .test(/\.txt$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end()
    }
}

module.exports = {
    chainWebpack: config => {
        config
            .plugin('define')
            .tap(args => {
                let v = JSON.stringify(require('./package.json').version)
                args[0]['process.env']['VERSION'] = v
                return args
            })
    }
}