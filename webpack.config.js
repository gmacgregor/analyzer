
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const node_modules = path.resolve(__dirname, 'node_modules');
const pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
const pathToReactDom = path.resolve(node_modules, 'react-dom/dist/react-dom.min.js');

function make(build) {

  const root_path = path.resolve(__dirname);

  // disk location of bundles
  const build_path = path.resolve(root_path, 'build');

  // bundle access point in html files
  const public_path = '/build/';

  // application enrty point
  const entry = {
    analyzer: './src/scripts/index'
  };

  // scss configuration
  const scssPaths = require('node-neat').with([
    // add path to our scss files relative to webpack.config.js
    path.resolve(__dirname, './src')
  ]).map(function(scssPath) {
    return 'includePaths[]=' + scssPath;
  }).join('&');

  return {
    entry: entry,
    output: {
      path: build_path,
      publicPath: public_path,
      filename: '[name].bundle.js'
    },
    module: {
      preLoaders: [
        { test: /\.jsx?$/, loader: 'eslint-loader', exclude: /node_modules/ }
      ],
      loaders: [
        { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css') },
        { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css!postcss!sass?' + scssPaths) }
      ]
    },
    // stop webpack form mangling already min'd js
    noParse: [pathToReact, pathToReactDom],
    plugins: [
      new ExtractTextPlugin('[name].css')
    ],
    postcss: [
      autoprefixer({
        browsers: ['last 2 versions','ie <= 9']
      })
    ],
    sassLoader: {
      outputStyle: 'compressed'
    },
    devServer: {
      host: process.env.HOST,
      port: process.env.PORT
    },
    resolve: {
      extensions: ['','.js','.jsx','.scss'],
      modulesDirectories: ['src','node_modules'],
      alias: {
        react: pathToReact,
        'react-dom': pathToReactDom
      }
    },
    eslint: {
      browser: true
    }
  };
}

module.exports = make(process.env.NODE_ENV === 'production');
