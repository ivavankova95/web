import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/napis-mi",
        permanent: true
      },
      {
        source: "/sluzby/pruvodce-vyzivou-a-pohybem",
        destination: "/osobni-konzultace",
        permanent: true
      },
      {
        source: "/about",
        destination: "/o-mne",
        permanent: true
      },
      {
        source: "/recepty/broskvovy_dort",
        destination: "/clanky/broskvovy-dort",
        permanent: true
      },
      {
        source: "/recepty/arasidova_omacka",
        destination: "/clanky/arasidova-omacka",
        permanent: true
      },
      {
        source: "/recepty/chia_pudink",
        destination: "/clanky/chia-pudink",
        permanent: true
      },
      {
        source: "/recepty/tiramisu",
        destination: "/clanky/tiramisu",
        permanent: true
      },
      {
        source: "/recepty/tvarohova_babovka",
        destination: "/clanky/tvarohova-babovka",
        permanent: true
      },
      {
        source: "/blog/cviceni_v_horku",
        destination: "/clanky/5-tipu-jak-zvladnout-cviceni-v-horku",
        permanent: true
      },
      {
        source: "/blog/jak_spravne_jist",
        destination: "/clanky/jak-spravne-jist",
        permanent: true
      },
      {
        source: "/blog/unava",
        destination: "/clanky/unava-5-duvodu-proc-jste-neustale-unaveni",
        permanent: true
      },
      {
        source: "/blog/pohyb",
        destination: "/clanky/pohyb-mimo-cviceni",
        permanent: true
      },
      {
        source: "/blog/obilna_kase",
        destination: "/clanky/obilna-kase-ctyrikrat-jinak",
        permanent: true
      },
      {
        source: "/blog/tycinky",
        destination: "/clanky/veganske-proteinove-tycinky-ktere-stoji-za-vyzkouseni",
        permanent: true
      },
      {
        source: "/blog/nejlepsi_ceske_podcasty",
        destination: "/clanky/nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu",
        permanent: true
      },
      {
        source: "/lekce-cviceni-nazivo",
        destination: "/lekce-cviceni",
        permanent: true
      },
      {
        source: "/sluzby-2",
        destination: "/lekce-cviceni",
        permanent: true
      },
      {
        source: "/sluzby/lekce-cviceni-nazivo",
        destination: "/lekce-cviceni",
        permanent: true
      },
      {
        source: "/recepty/brokolicova_omacka",
        destination: "/clanky/brokolicova-omacka",
        permanent: true
      },
      {
        source: "/recepty/plnene_datle",
        destination: "/clanky/plnene-datle-v-cokolade",
        permanent: true
      },
      {
        source: "/pruvodce-vyzivou-a-pohybem",
        destination: "/osobni-konzultace",
        permanent: true
      },
      {
        source: "/intervalovy-trenink-pro-akcni-zeny",
        destination: "/",
        permanent: true
      },
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
