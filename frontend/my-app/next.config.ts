module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pos.nvncdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
 
    ],

  },
  eslint:{
    ignoreDuringBuilds: true
  }
}