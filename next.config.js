const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm);

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const config = {
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = withPWA(config);
