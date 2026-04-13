function readEnv(name: string) {
  return process.env[name];
}

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
  sanityProjectId: readEnv("NEXT_PUBLIC_SANITY_PROJECT_ID") ?? "",
  sanityDataset: readEnv("NEXT_PUBLIC_SANITY_DATASET") ?? "production",
  sanityRevalidateSecret: readEnv("SANITY_REVALIDATE_SECRET") ?? "",
  stripeSecretKey: readEnv("STRIPE_SECRET_KEY") ?? "",
  stripeWebhookSecret: readEnv("STRIPE_WEBHOOK_SECRET") ?? "",
  stripePriceIdEbook: readEnv("STRIPE_PRICE_ID_EBOOK") ?? "",
  stripePriceIdOsobniKonzultace:
    readEnv("STRIPE_PRICE_ID_OSOBNI_KONZULTACE") ?? "",
  stripePriceIdPruvodce: readEnv("STRIPE_PRICE_ID_PRUVODCE") ?? "",
  mailerLiteApiToken: readEnv("MAILERLITE_API_TOKEN") ?? "",
  mailerLiteApiBaseUrl:
    readEnv("MAILERLITE_API_BASE_URL") ?? "https://connect.mailerlite.com/api",
  makeAutomationWebhookUrl: readEnv("MAKE_AUTOMATION_WEBHOOK_URL") ?? "",
  makeAutomationApiKey: readEnv("MAKE_AUTOMATION_API_KEY") ?? "",
  base44AutomationWebhookUrl: readEnv("BASE44_AUTOMATION_WEBHOOK_URL") ?? "",
  base44AutomationApiKey: readEnv("BASE44_AUTOMATION_API_KEY") ?? ""
};
