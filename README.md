# Forensika

Nezávislá vzdelávacia a komunitná **PWA** (Progressive Web App) o poslaní a význame práce
**súdneho lekára a toxikológa** na Slovensku — s odkazmi na aktuálne témy, podujatia,
vzdelávanie a overené zdroje.

Autor: **Ján Šikuta, MD, PhD.**

## Koncept loga — „rozostrené → ostré“

Logo aj celá stránka pracujú s metaforou: keď okolnosti nie sú jasné, **forenzné vedy vnášajú
svetlo a ostrosť**. Názov je vľavo jemne rozostrený a smerom doprava sa zaostruje; obsah stránky
sa pri scrollovaní „zaostruje“ (blur → sharp). Symbol je presvetlená lupa s EKG krivkou
(izoelektrická čiara + zvýraznený QRS komplex v spektrálnom prechode).

## Štruktúra

```
forensika-pwa/
├── index.html              # hlavná stránka (SK)
├── css/styles.css          # štýl (paleta navy + spektrum)
├── js/app.js               # navigácia, zaostrovanie, inštalácia, SW
├── manifest.webmanifest    # PWA manifest
├── service-worker.js       # offline cache
├── assets/
│   ├── logo.svg            # logo (rozostrené → ostré)
│   ├── favicon.svg
│   ├── icon-192.png / icon-512.png / icon-maskable-512.png
│   └── apple-touch-icon.png
└── README.md
```

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
