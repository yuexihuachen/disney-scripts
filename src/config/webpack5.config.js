import { utils } from "../utils";
const {getIfUtils} = require('webpack-config-utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { utilsFor } = utils;
const { fromRoot } = utilsFor('client');
const {ifProd, ifDev} = getIfUtils(process.env.NODE_ENV, ['dev','prod'])
const publicPath = '/client/'
const styleLoader = {
  loader: require.resolve('style-loader'),
}
const postcssLoader = {
  loader: require.resolve('postcss-loader')
}
const getCssLoader = (options) => ({
  loader: require.resolve('css-loader'),
  options: {
    modules: {
      localsConvention: 'camelCase',
    },
    importLoaders: 1,
    sourceMap: true,
    ...options,
  },
})
const config = {
    context: fromRoot('src'),
    entry: './index.tsx',
    output: {
      path: fromRoot('dist'),
      pathinfo: true,
      filename: 'bundle.js',
      publicPath,
    },
    mode: ifProd('production', 'development'),
    devtool: ifProd('source-map', 'cheap-module-source-map'),
    optimization: {
      moduleIds: 'named',
      minimize: ifProd(),
      emitOnErrors: false,
      concatenateModules: ifProd(),
    },
    module: {
      rules: [
        {
          test: /\.(js|tsx|ts)$/,
          include: fromRoot('src'),
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
          },
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            ifProd(MiniCssExtractPlugin.loader, styleLoader),
            getCssLoader({ modules: false }),
            postcssLoader,
          ],
        }
      ]
    }
};

module.exports = config;