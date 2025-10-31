/** @type {import('next').NextConfig} */
const nextConfig = {
  // 開發環境允許外部訪問
  ...(process.env.NODE_ENV === "development" && {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
        },
      ];
    },
  }),
};

module.exports = nextConfig;
