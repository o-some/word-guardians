# Word Guardians

Sprachlern-Lane-Defense-Minispiel für Tula’s Island.

## Status
Migration aus `o-some/tulasisland` auf Basis von Source-Commit `892f676fbcef77ab49373aef7865d60afba0ebb7`.

## Stack
- Standalone HTML/CSS/JavaScript (Übergangsstruktur)
- Mobile-first
- GitHub Pages
- Node-Build ohne externe Runtime-Abhängigkeiten

## Entwicklung
Die aktuelle Spielquelle liegt in `index.html`. `source.html` ist die unveränderte Quellkopie aus dem Ausgangs-Repository.

## Build
```bash
npm run build
```

## Deployment
GitHub Pages über `.github/workflows/pages.yml`.

## Live
https://o-some.github.io/word-guardians/

## Migrationsregel
Nicht in andere Spiele-Repositories schreiben. Vor jedem Write aktuellen `main` neu lesen. Kein Force-Push.
