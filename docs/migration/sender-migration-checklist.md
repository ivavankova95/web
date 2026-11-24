# Přechod z MailerLite na Sender Free

Podklad je implementační dokument „Migrace z MailerLite na Sender“ z 24. listopadu 2026. Začínáme veřejným webem a souběžně hlídáme termín obnovy MailerLite.

## 1. Veřejný web

- [x] Zmapovat formuláře, kód a produkční konfiguraci. Produkce běží na Netlify. Globální skript je ve všech 38 stránkách ze sitemap. V jejich HTML ani v 61 kontrolovaných publikovaných dokumentech Sanity není vložení MailerLite. V MailerLite jsou všechny tři pop-upy pozastavené. Tři staré vložené formuláře evidovat pro kontrolu historických stránek a přímých odkazů.
- [x] Ověřit závislosti webhooku. Netlify má nastavenou proměnnou `MAKE_AUTOMATION_WEBHOOK_URL`. Obě formulářové routy a Stripe webhook ji čtou. Produkční hodnota webhooku se přesně shoduje s webhookem `web` v týmu Zdraví mě baví.
- [x] Prověřit veřejné adresy webu mimo sitemap. `/kalendar` přesměruje na homepage a staré cesty k formulářům přesměrovávají na aktuální nabídky. Na kontrolovaných cílových stránkách se nenašlo vložení MailerLite. Přímé adresy hostované u MailerLite ověřit zvlášť při archivaci starých nabídek.
- [x] Lokálně odebrat globální skript v `app/layout.tsx`. V čisté kopii webu prošel build a kontrola změněného souboru. Ověřeno šest veřejných cest včetně přesměrování kalendáře a čtyř stránek s formulářem a Turnstile. Tři nalezené chyby a jedno varování opraveny. Celkový lint a build čisté kopie webu prošly.
- [x] Dohledat [produkční scénář Integrace Next.js web](https://eu1.make.com/351565/scenarios/1253153/edit). Scénář i webhook jsou aktivní. Dostupná historie je prázdná a přehled za posledních sedm dní ukazuje nulu. Podle aktuálního blueprintu šest větví podle `form_name` vytvoří nebo aktualizuje kontakt v MailerLite a přidá jej do skupiny. Žádná větev nedoručuje poptávku e-mailem. Stripe payload z webu nemá `form_name`, takže do žádné větve tohoto scénáře nevstoupí.
- [x] Ověřit produkční využití formulářů. Kontrola 46 adres a jejich načítaného JavaScriptu našla `/api/forms/submit` jen na interní ukázkové stránce `/styleguide`. Zákaznické formuláře používají `/api/contact/send`.
- [x] Připravit odpojení webu od Make. Oba endpointy doručují do schránky přes Resend a zachovávají Turnstile. Ukázkový formulář byl odstraněn. Webový webhook Stripe dál ověřuje podpis a potvrzuje příjem událostí. Testy rout ověřily doručení, chybu Resendu, odmítnutí chybného Turnstilu a žádné volání Make.
- [ ] Pokud má web sbírat novinky nebo nabízet aktivní magnet, zprovoznit samostatný odběr s výslovným souhlasem a potvrzením adresy. Ověřit, že bez potvrzení kontakt nevstoupí do rozesílky. Poptávkové formuláře zachovat pro vyřízení poptávky.
- [ ] Ověřit informace o zpracování údajů na webu, případné odkazy na veřejné formuláře a potřebu úpravy v Sanity.
- [ ] Ověřit změny v náhledu Netlify, nasadit ověřenou část a ověřit produkční formuláře, případný odběr a adresy. Připravit návrat na předchozí ověřený deploy.

## 2. Sender a ochrana proti obnově MailerLite

- [x] Ověřit, že je Sender účet přístupný. V nastavení zatím není přidaná odesílací doména. Ve veřejném DNS už existuje jeden SPF záznam a DMARC.
- [ ] Přidat `zdravimebavi.cz` do Senderu a potvrdit vlastnictví přes firemní schránku. V Cloudflare aplikovat hodnoty z dialogu Senderu, sloučit SPF do stávajícího záznamu, zkontrolovat poštu a Resend. Ověřit SPF, DKIM, DMARC a doručitelnost testu.
- [ ] Před 30. listopadem soukromě zazálohovat všechny stavy a skupiny kontaktů, důkazy souhlasů a důležitý obsah. Ověřit přímé adresy starých nabídek a vypnutí automatické obnovy v účtu. Zachovat možnost odložit zpracování nových souhlasů a odhlášení.
- [ ] Připravit cílové skupiny, mapu identifikátorů a testovací adresy. Prověřit zpracovatelské podmínky a limity API na Free.

## 3. Aplikace, převod a přepnutí

- [ ] Ve Workeru připravit integraci Senderu se stávající Supabase evidencí souhlasů a odhlášení, frontou, opakováním a administrací. Nastavit tajný klíč a cílovou skupinu v příslušném prostředí.
- [ ] Ověřit čtení stavů na Free, pravidelné promítání odhlášení do Supabase a přednost odhlášení před opožděným nákupem. Prověřit opakované zpracování, výpadek API a blokované adresy.
- [ ] Se zastavenými automatizacemi importovat doložené odběry a přenést blokace. Porovnat stavy, počty a mapu skupin.
- [ ] Pozastavit staré zápisy, nechat doběhnout úlohy, přenést rozdílový export a přepnout do Senderu. Před první ostrou kampaní ověřit rozesílku a odhlášení na testovacích adresách. Uchovat možnost pozastavení kampaní a opakování čekajících úloh.
