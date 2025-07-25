const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true,
    },
    externalsType: 'script',
    externals: {
        ymaps3: ['https://api-maps.yandex.ru/v3/?apikey=d5abe6a2-93f5-4a6b-9428-48f2db4b377a&lang=ru_RU', 'ymaps3']
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    devServer: {
        port: 3000,
        open: true,
        hot: true,
        liveReload: true,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            }
        ],
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(__dirname, 'dist/assets'),
                noErrorOnMissing: true
            },
            { 
                from: path.resolve(__dirname, 'src/_redirects'), 
                to: path.resolve(__dirname, 'dist/'), 
                noErrorOnMissing: true 
            },
            {
                from: path.resolve(__dirname, 'src/robots.txt'),
                to: path.resolve(__dirname, 'dist/'),
                noErrorOnMissing: true
            }],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, 'src/assets/logo/favicon-source.png'),
            cache: true,
            inject: true,
            outputPath: 'assets/favicons',
            prefix: 'assets/favicons/',
            favicons: {
                appName: 'Rocont landing',
                icons: {
                    android: true,
                    appleIcon: true,
                    favicons: true,
                    windows: false,
                    appleStartup: false,
                }
            }
        }),
        new ESLintPlugin({
            extensions: ['js'],
            overrideConfigFile: path.resolve(__dirname, 'eslint.config.mjs'),
        }),
        new MiniCssExtractPlugin({ 
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif|ico|mp4)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    experiments: {
        topLevelAwait: true,
    },
};
