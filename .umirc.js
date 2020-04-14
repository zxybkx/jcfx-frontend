export default {
  plugins: [
    ['umi-plugin-routes', {
      exclude: [
        /models/,
        /services/,
        /components/,
        /data/,
      ],
    }],
    'umi-plugin-dva',
    'umi-plugin-polyfill',
  ],
  pages: {
    '/': { Route: './src/lib/Authorized/AuthorizedRoute.js', ignore:'/passport' }
  },
  hashHistory: false,
  disableServiceWorker: true
}
