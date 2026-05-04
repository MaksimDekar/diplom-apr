/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dehznhwfarqhzusngwbr.supabase.co',
        pathname: 'v1/object/public',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
    ],
    unoptimized: true, // ← ОТКЛЮЧАЕМ ОПТИМИЗАЦИЮ
  },
}

export default nextConfig;
