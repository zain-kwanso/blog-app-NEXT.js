/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chat-testing-app.s3.us-east-1.amazonaws.com",
        pathname: "/profile-pictures/**",
      },
      {
        protocol: "https",
        hostname: "generated.vusercontent.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
