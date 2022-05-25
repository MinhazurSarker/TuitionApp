/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '/' })

const nextConfig = {
  reactStrictMode: true,
}

const path = require('path')
const { parsed: myEnv } = require('dotenv').config({
  path:'/full/custom/path/to/env'
})

module.exports = {
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
  },
  webpack: config => {
    config.resolve.alias['components'] = path.join(__dirname, 'components')
    config.resolve.alias['public'] = path.join(__dirname, 'public')
    config.EnvironmentPlugin(myEnv)
    return config
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig



