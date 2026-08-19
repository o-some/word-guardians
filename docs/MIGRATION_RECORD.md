# Migration Record — Word Guardians

Source Repo: `o-some/tulasisland`
Source Path: `public/word-guardians/`
Source Commit: `892f676fbcef77ab49373aef7865d60afba0ebb7`
Source Game Blob: `11b0464930c7969e30a43a5d3b16229baca60f7b`
Rollback Branch: `pre-extraction-word-guardians`
Target Repo: `o-some/word-guardians`
Target Commit: PENDING
Migration Date: 2026-08-19
Version: `v1.0.0-migrated`

## Source inventory
- Spielcode: 1 Datei (`public/word-guardians/index.html`)
- Abhängige Runtime-Assets: 5 Dateien
- Audio: 0
- Externe Framework-Runtime: 0

## Zielstrategie
Übergangsstruktur gemäß Migrationsstandard: Standalone-HTML zuerst stabil isolieren, danach optional refactoren. `source.html` bleibt unverändert; `index.html` erhält nur repo-lokale Asset-Pfade und den Migrations-Versionsstempel.

## Assets
Siehe `docs/ASSET_MANIFEST.md`. Bootstrap prüft die unveränderten Assets per Git-Blob-Hash.

## Tests
- Source main geprüft: PASS
- Rollback-Punkt: PASS
- Target main vor Writes geprüft: PASS
- Code kopiert: PENDING
- Asset-Integrität: PENDING
- CI Build: PENDING
- GitHub Pages: PENDING
- Startseite HTTP 200: PENDING
- Assets HTTP 200: PENDING
- JavaScript: PENDING
- Mobile/iPhone Safari: PENDING
- Android Chrome: PENDING / darf begründet ausstehend sein
- Desktop: PENDING
- Gameplay: PENDING
- Quell-/Zielvergleich: PENDING

## Live URL
https://o-some.github.io/word-guardians/

## Removal Approval
NOT APPROVED

`REMOVE_OLD_COPY = FORBIDDEN` bis alle Freigabeprüfungen bestanden sind.
