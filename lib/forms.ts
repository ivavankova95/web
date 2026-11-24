const formLabels = new Map([
  ["kontakt", "Kontakt"],
  ["skupinove_lekce", "Skupinové lekce"],
  ["cviceni_v_benatkach", "Cvičení v Benátkách"],
  ["lekce_cviceni", "Lekce cvičení"],
  ["individualni_treninky", "Individuální tréninky"],
  ["diagnostika", "Diagnostika"],
  ["online_pohybova_konzultace", "Online pohybová konzultace"],
  ["osobni_konzultace", "Osobní konzultace"],
  ["konzultace_zdarma", "Konzultace zdarma"],
  ["pruvodce_vyzivou_pohybem", "Čekací listina – Průvodce výživou a pohybem"],
  ["pruvodce_vyzivou_a_pohybem", "Čekací listina – Průvodce výživou a pohybem"],
  ["ebook_jak_sestavit_jidelnicek", "E-book Jak sestavit jídelníček"]
]);

export function getFormLabel(key: string) {
  return formLabels.get(key.replaceAll("-", "_"));
}
