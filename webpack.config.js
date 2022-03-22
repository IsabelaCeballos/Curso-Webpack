const { resolve } = require('path');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].[contenthash].js',
        /*hace que webpack le agregue un hash 
        (un hash es una serie de caracteres aleatorios)*/
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/')
        }
    },
    //conectar webpack con babel
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css|\.styl$/i,
                use: [MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'stylus-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {   //forma actual
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[hash][ext]",
                },
                /* forma antigua
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        - limit para especificar el tamaño máximo de tus archivos en bytes 
                        donde si el archivo es igual o más grande utiliza el file-loader 
                        para que procese su rendimiento
                        limit: 10000,
                        - Los MIME Types (Multipurpose Internet Mail Extensions)
                        nos permite determinar el tipo de archivo que será enlazado o cargado
                        mimetype: "application/font-woff",
                        - nombre de salida
                        name: "[name].[contenthash].[ext]",
                        - Directorio de salida
                        outputPath: "./assets/fonts",
                        publicPath: "../assets/fonts/",
                        - Es para permitir que file-loader genere modulos JS que usan la sintaxis ES
                        esModule: false, 
                    }
                }*/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    }
}