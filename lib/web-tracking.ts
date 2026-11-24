export type CookiePreferences = { analytics: boolean; marketing: boolean };

type Tracker = ((...args: unknown[]) => void) & {
  q?: IArguments[];
  queue?: IArguments[];
  callMethod?: (...args: unknown[]) => void;
  push?: Tracker;
  loaded?: boolean;
  version?: string;
};

type TrackingWindow = Window & {
  dataLayer?: IArguments[];
  gtag?: Tracker;
  hj?: Tracker;
  _hjSettings?: { hjid: number; hjsv: number };
  fbq?: Tracker;
  _fbq?: Tracker;
};

const analyticsId = "G-N99VT5NKDT";
const pixelId = "638733517000114";
const analyticsCookies = /^(_ga($|_)|_hj|_gid$|_gat($|_))/;
const marketingCookies = /^(_fbp$|_fbc$|_gcl_)/;
const googleConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
};

function loadScript(id: string, url: string) {
  const script = document.createElement("script");
  script.id = id;
  script.src = url;
  script.async = true;
  document.head.append(script);
}

function removeCookies(pattern: RegExp) {
  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0].trim();
    if (!pattern.test(name)) continue;
    const expired = `${name}=; Max-Age=0; Path=/`;
    document.cookie = expired;
    if (/(^|\.)zdravimebavi\.cz$/.test(location.hostname)) {
      document.cookie = `${expired}; Domain=zdravimebavi.cz`;
    }
  }
}

export function applyTrackingPreferences(preferences: CookiePreferences | null) {
  const site = window as TrackingWindow;
  const { analytics = false, marketing = false } = preferences ?? {};
  const revokeAnalytics = !analytics && Boolean(site.gtag || site.hj);
  const revokeMarketing = !marketing && Boolean(site.fbq);

  removeCookies(/^CookieScriptConsent$|^mailerlite:forms:shown:/i);
  if (!analytics) removeCookies(analyticsCookies);
  if (!marketing) removeCookies(marketingCookies);

  if (revokeAnalytics || revokeMarketing) {
    if (revokeAnalytics) site.gtag?.("consent", "update", googleConsent);
    if (revokeMarketing) site.fbq?.("consent", "revoke");
    // A reload stops already executed tags, including Hotjar.
    location.reload();
    return;
  }

  if (analytics && !site.gtag) {
    const dataLayer = site.dataLayer ??= [];
    site.gtag = function () {
      // Google distinguishes gtag commands from ordinary arrays in dataLayer.
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };
    site.gtag("consent", "default", googleConsent);
    site.gtag("consent", "update", { ...googleConsent, analytics_storage: "granted" });
    site.gtag("js", new Date());
    site.gtag("config", analyticsId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15_552_000
    });
    loadScript("zmb-google-analytics", `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`);
    site._hjSettings = { hjid: 3527254, hjsv: 6 };
    const hotjar: Tracker = function () {
      // Keep the queue format expected by the Hotjar bootstrap.
      // eslint-disable-next-line prefer-rest-params
      (hotjar.q ??= []).push(arguments);
    };
    site.hj = hotjar;
    loadScript("zmb-hotjar", "https://static.hotjar.com/c/hotjar-3527254.js?sv=6");
  }

  if (marketing && !site.fbq) {
    const pixel: Tracker = function (...args) {
      if (pixel.callMethod) {
        pixel.callMethod(...args);
      } else {
        // Keep the queue format expected by the Meta Pixel bootstrap.
        // eslint-disable-next-line prefer-rest-params
        pixel.queue?.push(arguments);
      }
    };
    pixel.queue = [];
    pixel.push = pixel;
    pixel.loaded = true;
    pixel.version = "2.0";
    site.fbq = site._fbq = pixel;
    pixel("init", pixelId);
    pixel("track", "PageView");
    loadScript("zmb-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
  }
}
