const withPWA = require('next-pwa');

const config = {
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withPWA(config);
