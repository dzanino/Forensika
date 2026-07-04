# Forensika

Nezávislá vzdelávacia a komunitná **PWA** (Progressive Web App) o poslaní a význame práce
**súdneho lekára a toxikológa** na Slovensku — s odkazmi na aktuálne témy, podujatia,
vzdelávanie a overené zdroje.

Autor: **Ján Šikuta, MD, PhD.**

## Koncept loga — rozuzlenie / jasno

Symbol je presvetlená lupa s EKG krivkou: **P vlna a QRS komplex sú mierne rozostrené**
(neistota), ktoré prechádzajú do **ostrej izoelektrickej čiary** (jasno, rozuzlenie) — odkaz na
cieľ súdneho lekárstva objasniť príčinu úmrtia a mechanizmus vzniku poranení a smrti. Obsah stránky
sa pri scrollovaní „zaostruje" (blur → sharp).

## Štruktúra

```
forensika-pwa/
├── index.html              # hlavná stránka (SK/EN, DE pripravené)
├── css/styles.css          # štýl (paleta navy + spektrum)
├── js/i18n.js              # preklady SK/EN (+ DE slot)
├── js/app.js               # jazyk, zaostrovanie, inštalácia, auto-update, standalone
├── js/experts.js           # dátový súbor znalcov (doplniť overené záznamy)
├── js/tools.js             # žiadosť o List, register znalcov, feedback
├── manifest.webmanifest    # PWA manifest
├── service-worker.js       # network-first + offline cache
├── assets/  (logo.svg, favicon.svg, icon-*.png, apple-touch-icon.png)
└── README.md
```

## Konfigurácia (js/tools.js → CONFIG)

- `feedbackEmail` — e-mail pre spätnú väzbu. Prázdny = hodnotenie sa uloží lokálne a zobrazí
  poďakovanie; po vyplnení sa odošle e-mailom (mailto).
- `listRequestEmail` — adresát žiadosti o List o prehliadke mŕtveho tela (predvolene
  `sslapa@udzs-sk.sk`, sekcia SLaPA ÚDZS).

## Znalci — súdne lekárstvo (js/experts.js)

Mená a kontakty reálnych osôb **nevymýšľame**. Do `list` doplň iba OVERENÉ záznamy z verejného
registra Ministerstva spravodlivosti SR (odvetvie „Súdne lekárstvo"). Kým je zoznam prázdny,
zobrazí sa odkaz na oficiálny register.

## Nainštalovaná appka (standalone)

Po pridaní na plochu appka beží v standalone režime — inštalačné tlačidlá aj pruh sa automaticky
skryjú, takže sa už nezobrazujú pri každom spustení.

## Jazyky

Prepínač SK / EN v hlavičke; voľba sa pamätá (localStorage). DE je pripravené —
stačí doplniť objekt `de` v `js/i18n.js` (kým je prázdny, DE je neaktívne a padá na EN).

## Aktualizácia po deploji

Service worker používa **network-first** pre stránku, takže nový deploy sa načíta hneď.
Nová verzia SW sa aktivuje automaticky (`SKIP_WAITING`) a stránka sa raz obnoví
(`controllerchange`). Pri väčších zmenách statických súborov zvýš `VERSION`
v `service-worker.js` (`forensika-v3` → `v4`) — vyčistí sa tým stará cache.

## Spustenie lokálne

PWA vyžaduje HTTP(S) kvôli service workeru (cez `file://` sa SW nespustí):

```bash
# v priečinku forensika-pwa/
python3 -m http.server 8080
# otvor http://localhost:8080
```

Samotný náhľad bez inštalácie funguje aj dvojklikom na `index.html`.

## Nasadenie na GitHub Pages

1. Vytvor repozitár a nahraj obsah priečinka `forensika-pwa/` (súbory nech sú v koreňi repa,
   alebo v priečinku `/docs`).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, vyber vetvu
   a priečinok (`/root` alebo `/docs`).
3. Po pár minútach beží na `https://<používateľ>.github.io/<repo>/`.

> Odkazy a cesty sú relatívne (`./…`), takže PWA funguje aj v podpriečinku na GitHub Pages.

## Zdroje

- Slovenská súdnolekárska spoločnosť — http://sudnelekarstvo.sk/
- ÚDZS, Súdne lekárstvo a patologická anatómia — https://www.udzs-sk.sk/sudne-lekarstvo-a-patologicka-anatomia/zakladne-informacie/
- Ústav súdneho lekárstva a súdnolekárskej toxikológie LF UK — https://www.fmed.uniba.sk/pracoviska/teoreticke-ustavy/ustav-sudneho-lekarstva-a-sudnolekarskej-toxikologie-lf-uk/

## Poznámka

Forensika je nezávislý informačný projekt. Nie je oficiálnou stránkou uvedených inštitúcií;
odkazy smerujú na ich oficiálne zdroje. Obsah má informatívny charakter.

## Licencia

© Ján Šikuta, MD, PhD. Obsah slúži na vzdelávacie a komunitné účely.
