const path = require('path');
export default {
  extraBabelPlugins: [
    ['import', {libraryName: 'antd', libraryDirectory: 'es', style: true}],
  ],
  theme: './src/theme.js',
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      theme: './src/theme.dev.js',
    },
  },
  alias: {
    'lib': path.resolve(__dirname, 'src/lib/'),
    'utils': path.resolve(__dirname, 'src/utils/'),
  },
  ignoreMomentLocale: true,
  proxy: {
    '/gateway': {
      'target': 'http://gateway/gateway',
      'changeOrigin': true,
      'pathRewrite': {'^/gateway': ''},
    }
  },
}
