module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pos.nvncdn.com',
        port: '',
        pathname: '/**',
      },
 
    ],

  },
  eslint:{
    ignoreDuringBuilds: true
  }
}