/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["anwqaikziinzahozosua.supabase.co"],
  },
  reactStrictMode: false,
  // experimental: {
  //   appDir: true, // Đảm bảo Next.js sử dụng App Router và API routes
  // },
   typescript: {
    ignoreBuildErrors: true, // Bỏ qua lỗi TypeScript
  },
};

module.exports = nextConfig;