import path from 'path';
import AssetsPlugin from 'assets-webpack-plugin';
import { DefinePlugin, HotModuleReplacementPlugin, NoErrorsPlugin } from 'webpack';

import {
  devToolkitRoot,
  projectRoot,
  buildFolder,
  entryPoint,
  defaultPublicPath,
  publicPath,
  babelConfig,
} from './projectSettings';

export default ({ getWebpackAssets, createBuild } = { createBuild: true }) => {
  const namingConvention = createBuild ? '[name].[chunkhash]' : '[name]';

  return {
    entry: {
      app: [entryPoint],
    },
    output: {
      path: buildFolder,
      filename: `${namingConvention}.js`,
      chunkFilename: `${namingConvention}.js`,
      publicPath: createBuild ? publicPath : defaultPublicPath,
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: [
          `babel-loader?${JSON.stringify(babelConfig)}`,
          // `eslint-loader?${JSON.stringify(eslintConfig)}`,
        ],
        exclude: /(node_modules)|\.route.jsx?$|\.dynamic.jsx?$/,
      }],
    },
    plugins: [
      new DefinePlugin({
        buildSettings: {
          // env: JSON.stringify(extractedSharedEnvs),
        },
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ].concat(getWebpackAssets ? [
      new AssetsPlugin({
        // Ignore the generated file by putting it into the `dist`-folder
        path: path.resolve(devToolkitRoot, 'dist'),
        filename: 'assets-manifest.json',
        processOutput: getWebpackAssets,
      }),
    ] : []).concat(createBuild ? [] : [
      new HotModuleReplacementPlugin(),
      new NoErrorsPlugin(),
    ]),
    resolve: {
      alias: {
        src: path.resolve(projectRoot, 'src'),
      },
    },
  };
};
