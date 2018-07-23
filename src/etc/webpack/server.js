const path = require('path')

module.exports = {
  target: 'node',
  entry: path.resolve(__dirname, '../../server', 'index.tsx'),
  devtool: 'inline-source-map',
  output: {
      filename: 'index.js',
      path: path.resolve(__dirname, '../../../dist/server')
  },
  module: {
      rules: [
          {
            test: /\.tsx?$/,
            use: [
                { loader: 'awesome-typescript-loader',
                options: {
                    useCache : true,
                    happyPackMode: true,
                    transpileOnly: true
                } 
            }
            ],
            exclude: [/node_modules/],
          },
          // { test: /\.(css|less|scss)$/, loader: 'ignore-loader' },
          // {
          //   test: /\.html$/,
          //     loader: 'raw-loader',
          //     exclude: /node_modules/
          // }
      ],
  },
  resolve: {
      alias: {
          '@': path.resolve(__dirname, 'src/')
      },  
      extensions: ['.tsx', '.ts', '.js']
  }
};
