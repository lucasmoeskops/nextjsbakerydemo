const path = require('path')
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

// Shared env file with rest of project
const env = require('dotenv').config({path: '../.env'})

if (env.error) {
  throw env.error
}

module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`);

  

  return {
    ...env.parsed,
    images: {
      domains: ['localhost', '172.16.20.194'],
      // loader: 'custom',
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    webpack5: true,
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
  
      return config;
    }
  }
}
