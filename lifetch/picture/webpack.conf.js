var path = require('path');
var webpack = require('webpack');

// Plugins
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require(
    './webpack/html-webpack-harddisk-plugin');

var contextDir = path.join(__dirname, 'static');
var outputDir = path.join(__dirname, 'static/main');
var publicPath = 'http://0.0.0.0:8080/static/';
var htmlFileName = 'dev/index.html';
if (process.env.NODE_ENV == 'production') {
    publicPath = '/static/main';
    htmlFileName = 'index.html';
}

var config = {
    context: contextDir,
    entry: {
        picture: [
            './picture/js/index.js'
        ]
    },
    output: {
        path: outputDir,
        publicPath: publicPath,
        filename: "[name]-[hash:5].js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-0', 'stage-1', 'stage-2',
                    'stage-3', 'react'
                ],
                compact: true,
                comments: false,
                cacheDirectory: true
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style',
                'css?sourceMap')
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('style',
                'css?sourceMap!less?sourceMap')
        }, {
            test: /\.(png|jpe?g|gif|svg|ico)(\?\S*)?$/,
            loader: 'file?name=imgs/[name]-[hash:5].[ext]'
        }, {
            test: /\.(woff|woff2|ttf|eot)(\?\S*)?$/,
            loader: 'file?name=fonts/[name]-[hash:5].[ext]'
        }, {
            test: /\.(mp4|mpeg|webm|ogv|swf)(\?\S*)?$/,
            loader: 'file?name=video/[name]-[hash:5].[ext]'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: [
            'node_modules',
            'bower_components',
            'bower_components/blueimp-file-upload/js/vendor'
        ]
    },
    plugins: [

        // 有错误时不刷新页面
        new webpack.NoErrorsPlugin(),

        // 用文件的md5替换chunkhash，以避免共用js内容未变化时hash变化。
        new WebpackMd5Hash(),

        // 给js中剥离的css的文件指定名称
        new ExtractTextPlugin('[name]-[contenthash:5].css'),

        // 使用变量时,自动装载对应模块.
        new webpack.ProvidePlugin({
            _: 'lodash',
            Backbone: 'backbone',
            'moment': 'moment',
            'React': 'react',
            'ReactDOM': 'react-dom',
            'cx': 'classnames'
        }),

        new HtmlWebpackPlugin({
            title: 'InsightFinder',
            filename: htmlFileName,
            template: './picture/templates/index.ejs',
            inject: true,
            alwaysWriteToDisk: true,
        }),

        new HtmlWebpackHarddiskPlugin({
            outputDir: path.join(__dirname, 'templates/picture')
        })

    ],

    devtool: '#inline-source-map',
    devServer: {
        contentBase: contextDir,
        port: 8080,
        host: '0.0.0.0',
        inline: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": false
        }
    },
};


if (process.env.NODE_ENV == 'production') {
    delete config.devtool;
    delete config.devServer;

    config.plugins = [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    ].concat(config.plugins);
}

module.exports = config;
