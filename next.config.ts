import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return ["infurnus-admin-pgzcedufyq-em.a.run.app", "infurnus-admin.vercel.app"].map(host => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://infurnus-admin-675633214574.asia-south2.run.app/:path*",
      permanent: false,
    }));
  },
};

export default nextConfig;
