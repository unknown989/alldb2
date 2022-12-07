/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    largePageDataBytes: 128 * 1000 * 2,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    })

    return config;
  }
}

module.exports = nextConfig
