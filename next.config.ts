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
      },
      {
        source: "/pruvodce",
        destination: "/zhubni-bez-pocitani-kalorii",
        permanent: true
      },
      {
        source: "/formular---pruvodce-vyzivou-a-pohybem",
        destination: "/zhubni-bez-pocitani-kalorii",
        permanent: true
      },
      {
        source: "/konzultace-zdarma",
        destination: "/osobni-konzultace",
        permanent: true
      },
      {
        source: "/osobni-konzultace-objednavka",
        destination: "/osobni-konzultace",
        permanent: true
      },
      {
        source: "/cviceni-v-benatkach-nad-jizerou-formular",
        destination: "/cviceni-v-benatkach-nad-jizerou",
        permanent: true
      },
      {
        source: "/skupinove-lekce-benatky-nad-jizerou",
        destination: "/cviceni-v-benatkach-nad-jizerou",
        permanent: true
      },
      {
        source: "/kalendar",
        destination: "/",
        permanent: true
      },
      {
        source: "/letni-prazdninova-vyzva",
        destination: "/",
        permanent: true
      },
      {
        source: "/search",
        destination: "/blog",
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
        hostname: "cdn.prod.website-files.com"
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net"
      }
    ]
  }
};

export default nextConfig;
