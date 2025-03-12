/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["anwqaikziinzahozosua.supabase.co"],
  },
  reactStrictMode: false,
   typescript: {
    ignoreBuildErrors: true, // Bỏ qua lỗi TypeScript
  },
};

module.exports = nextConfig;