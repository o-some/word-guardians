# Asset Manifest — Word Guardians

Source of truth for the migrated base runtime assets: `o-some/tulasisland` at commit `892f676fbcef77ab49373aef7865d60afba0ebb7`.

## Tula / Welt-Assets

| Asset | Quelle | Source Blob SHA | Repo-Pfad | Verwendung | Status |
|---|---|---|---|---|---|
| Harbor World | `assets/creative/world_harbor.webp` | `4eb9273c7bd152eb20c0dc1f72e51078aeb21322` | `assets/creative/world_harbor.webp` | Spielhintergrund | VERIFIED |
| Words Discover | `assets/creative/mode_words_discover.webp` | `0c0691d33892c23e6b8aa16a79b93837610e1168` | `assets/creative/mode_words_discover.webp` | Header-Artwork | VERIFIED |
| Tula Profile | `assets/creative/tula_profile.webp` | `4a1a67f37476ee74815ce571222b14439ba631a5` | `assets/creative/tula_profile.webp` | Header | VERIFIED |
| Tula Neutral Front | `assets/creative/tula_neutral_front.webp` | `1fc41e4e3cb85568e6c6e7b6d2df04725ea4afce` | `assets/creative/tula_neutral_front.webp` | Spielfeld/Intro | VERIFIED |
| Tula Happy | `assets/creative/tula_happy.webp` | `cd9ec4242fed35139d71d22bdf9ea979031c9702` | `assets/creative/tula_happy.webp` | Ergebnisbildschirm | VERIFIED |

## Reguläre Gegner — Word Guardians v1.2

Diese acht Sprites wurden speziell für Word Guardians im Tula's-Island-Piratenlook erzeugt. Das Namensschema ist absichtlich stabil und eindeutig: `enemy-XX-rolle-name.png`.

| # | Anzeigename | Repo-Pfad | Rolle |
|---:|---|---|---|
| 01 | Deckhand Niko | `assets/enemies/enemy-01-deckhand-niko.png` | Basis-Nahkämpfer |
| 02 | Hook Scout Lio | `assets/enemies/enemy-02-hook-scout-lio.png` | Schneller Scout |
| 03 | Barrel Raider Mako | `assets/enemies/enemy-03-barrel-raider-mako.png` | Robuster Angreifer |
| 04 | Shield Buccaneer Taro | `assets/enemies/enemy-04-shield-buccaneer-taro.png` | Defensiver Tank |
| 05 | Wave Skater Piko | `assets/enemies/enemy-05-wave-skater-piko.png` | Sehr schneller Angreifer |
| 06 | Anchor Brute Koda | `assets/enemies/enemy-06-anchor-brute-koda.png` | Schwerer Elite-Tank |
| 07 | Tidecaller Yara | `assets/enemies/enemy-07-tidecaller-yara.png` | Elite-Magierin |
| 08 | Cannon Corsair Riven | `assets/enemies/enemy-08-cannon-corsair-riven.png` | Elite-Fernkämpfer |

## Original-Bosse

Quelle: Dropbox ` /[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/ `. Die Dateien wurden unverändert als PNG übernommen und nur eindeutig für die Runtime benannt: `boss-XX-name.png`.

| # | Boss | Repo-Pfad |
|---:|---|---|
| 01 | Pirat Kai | `assets/bosses/boss-01-pirat-kai.png` |
| 02 | Kapitän Brax | `assets/bosses/boss-02-kapitaen-brax.png` |
| 03 | Blackfinn | `assets/bosses/boss-03-blackfinn.png` |
| 04 | Alt-Kapitän Roderick | `assets/bosses/boss-04-alt-kapitaen-roderick.png` |
| 05 | Piratenbaron Vargas | `assets/bosses/boss-05-piratenbaron-vargas.png` |
| 06 | Kapitän Ironhook | `assets/bosses/boss-06-kapitaen-ironhook.png` |
| 07 | Admiral Thorne | `assets/bosses/boss-07-admiral-thorne.png` |
| 08 | Kartenmeister Corvin | `assets/bosses/boss-08-kartenmeister-corvin.png` |
| 09 | Schattenfürst Azrak | `assets/bosses/boss-09-schattenfuerst-azrak.png` |
| 10 | Piratenkönig Varkos | `assets/bosses/boss-10-piratenkoenig-varkos.png` |

## Runtime-Regel

Das aktive Spiel verwendet ausschließlich repo-lokale Assets unter `./assets/creative/`, `./assets/enemies/` und `./assets/bosses/`. Es besteht keine Runtime-Abhängigkeit von `/tulasisland/assets/...` oder Dropbox.

Die Original-Bosse erscheinen nur in Boss-Spawns; die acht neu erzeugten Figuren bilden den regulären Gegnerpool. Der Boss rotiert nach jeweils 8 richtigen Wörtern durch die zehn Original-Bosse.

## Integrität

Die fünf migrierten Tula-/Welt-Assets wurden beim Migrations-Bootstrap über ihre Git-Blob-SHAs verifiziert. Die zehn Boss-Dateien entsprechen größenidentisch den freigestellten Dropbox-Originalen. Die acht Gegnerdateien liegen mit nachvollziehbaren Dateinamen unter `assets/enemies/` im eigenständigen `o-some/word-guardians`-Repository.

Andere Spiele-Repositories und deren Assets wurden nicht verändert.
