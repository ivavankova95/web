import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/online-workshop",
        destination: "/zhubni-bez-pocitani-kalorii",
        permanent: true
      },
      {
        source: "/zdravi-me/workshoppromamy",
        destination: "/zhubni-bez-pocitani-kalorii",
        permanent: true
      },
      {
        source: "/sluzby",
        destination: "/lekce-cviceni",
        permanent: true
      },
      {
        source: "/zdravi-me",
        destination: "/",
        permanent: true
      },
      {
        source: "/clanky/nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stilu",
        destination: "/clanky/nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu",
        permanent: true
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      },
      {
        protocol: "https",
        hostname: "assets.website-files.com"
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net"
      }
    ]
  }
};

export default nextConfig;
