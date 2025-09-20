/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  env: {
    DATABASE_URL: 'postgresql://dummy:dummy@dummy:5432/dummy'
  }
}

module.exports = nextConfig