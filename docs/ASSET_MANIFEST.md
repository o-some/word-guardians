# Asset Manifest — Word Guardians

Source of truth for the migrated runtime assets: `o-some/tulasisland` at commit `892f676fbcef77ab49373aef7865d60afba0ebb7`.

| Asset | Quelle | Source Blob SHA | Repo-Pfad | Verwendung | Status |
|---|---|---|---|---|---|
| Harbor World | `assets/creative/world_harbor.webp` | `4eb9273c7bd152eb20c0dc1f72e51078aeb21322` | `assets/creative/world_harbor.webp` | Spielhintergrund | VERIFY AFTER BOOTSTRAP |
| Words Discover | `assets/creative/mode_words_discover.webp` | `0c0691d33892c23e6b8aa16a79b93837610e1168` | `assets/creative/mode_words_discover.webp` | Header-Artwork | VERIFY AFTER BOOTSTRAP |
| Tula Profile | `assets/creative/tula_profile.webp` | `4a1a67f37476ee74815ce571222b14439ba631a5` | `assets/creative/tula_profile.webp` | Header | VERIFY AFTER BOOTSTRAP |
| Tula Neutral Front | `assets/creative/tula_neutral_front.webp` | `1fc41e4e3cb85568e6c6e7b6d2df04725ea4afce` | `assets/creative/tula_neutral_front.webp` | Spielfeld/Intro | VERIFY AFTER BOOTSTRAP |
| Tula Happy | `assets/creative/tula_happy.webp` | `cd9ec4242fed35139d71d22bdf9ea979031c9702` | `assets/creative/tula_happy.webp` | Ergebnisbildschirm | VERIFY AFTER BOOTSTRAP |

## Integritätsregel
Der Bootstrap-Workflow lädt die Dateien aus dem unveränderlichen Source-Commit und verifiziert jede Datei mit `git hash-object` gegen die dokumentierte Source-Blob-SHA. Danach liegen die Runtime-Dateien direkt im Ziel-Repository und das Spiel verweist nur noch auf repo-lokale Pfade.

Keine Assets anderer Spiele werden kopiert.
