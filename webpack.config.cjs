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
    resolve: {
        extensions: ['.js'],
    },
    devServer: {
        port: 3000,
        open: true,
        hot: true,
        liveReload: true,
        historyApiFallback: true,
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
        ...(isDev
            ? []
            : [new MiniCssExtractPlugin({ 
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css'
            })])
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
