# Local content snapshot

Tento adresář obsahuje lokální snapshot textů a obrázků z aktuálního veřejného webu.

## Obsah

- `pages-md/` -> čitelné Markdown exporty jednotlivých URL
- `pages-json/` -> strojově čitelné exporty se structured bloky
- `assets/images/` -> lokálně stažené obrázky
- `css/` -> lokální kopie CSS souborů použité pro detekci background assetů
- `manifests/` -> manifesty assetů, stránek a coverage

## Poznámky

- snapshot pokrývá veřejné HTML, texty a obrázky dostupné z live webu
- chráněná členská sekce není součástí exportu
- Wistia, YouTube, legacy FAPI a Stripe jsou zachycené jako reference, ne jako stažený interní obsah providerů

## Statistika

- exported pages: 50
- downloaded images: 196
- failed images: 0
- css-discovered image urls: 8
