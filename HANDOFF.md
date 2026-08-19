# HANDOFF — Word Guardians

# Projekt
Word Guardians

# Zweck
Endless-Lane-Defense-Sprachlernspiel innerhalb der Tula’s-Island-Welt. Der Lernfokus liegt auf häufigen Wortfragen; richtige Antworten helfen direkt im Kampf.

# Aktuelle Version
v1.0.0-migrated

# Letzte getestete Commit-SHA
PENDING — nach vollständigem Deployment-/Gameplay-Test eintragen.

# Framework
Übergangsweise Standalone HTML/CSS/Vanilla JavaScript. Build über Node-Skript; später modularisierbar/Astro-kompatibel.

# Plattformen
- iOS Safari
- Android Chrome
- Desktop Chrome/Safari

# Designregeln
- Tula’s-Island-Look: Deep Navy, Ocean Blue, Türkis, Gold, Creme.
- Mobile first, große Touch-Ziele.
- Wörter maximal lesbar; Lernen wichtiger als Effekte.
- Keine störenden fliegenden Muscheln.

# Aktueller Funktionsstand
- 4×8 Spielfeld.
- 6 Helfer: Wortkoralle, Steinmuschel, Minzqualle, Gezeitenstern, Blitzkoralle, Ankerkrabbe.
- Helfer besitzen HP-Balken.
- Falsche Antwort: alle gesetzten Helfer verlieren 10 % ihrer maximalen HP.
- Richtige Antwort: blaue Wortwelle, Energie und Schaden an Gegnern.
- Helfer-Info, Umsetzen, Pause/Resume.
- Endless-Skalierung; nach jeweils 3 Boss-Fortschritten steigt die Gefahrenstufe.
- Motivations-Endscreen mit Wörtern, Zeit, Gefahrenstufe, bester Combo, XP, Muscheln und lokalem Rekord.

# Bekannte Fehler / Grenzen
- Gegner sind im aktuellen Source-Stand noch Emoji-/Platzhalter-Piraten, keine finalen Anime-Piraten-Skins.
- Aktueller Wortpool ist noch klein und DE→EN fokussiert.
- Ein echter, separat inszenierter Boss-Entity-Kampf ist im aktuellen Stand nicht implementiert; die Bossanzeige dient der Progressionsstufe.

# Nächste Schritte
- Piraten-/Boss-Artworks sauber als Assets integrieren.
- Wortschatz zentralisieren und auf DE/EN/ES/EL erweitern.
- Standalone-Datei später in modulare Game-Engine überführen, ohne Gameplay zu regressieren.

# Wichtige Dateien
- `index.html` — aktive Spielversion mit repo-lokalen Asset-Pfaden.
- `source.html` — unveränderte Kopie aus `tulasisland` zum Source-Commit.
- `assets/creative/` — Runtime-Assets.
- `scripts/build.mjs` — statischer Build nach `dist/`.
- `.github/workflows/pages.yml` — Pages Deployment.
- `docs/MIGRATION_RECORD.md` — Migrationsnachweis.
- `docs/ASSET_MANIFEST.md` — Asset-Herkunft.
- `docs/TEST_CHECKLIST.md` — Freigabeprüfungen.

# Do-not-touch-Bereiche
- Keine anderen Spiele-Repositories verändern.
- `o-some/tulasisland` nur im Rahmen einer ausdrücklich freigegebenen Extraktion bearbeiten.
- `source.html` nicht nachträglich verändern; dient als unveränderte Referenz.

# Assets
Quelle: `o-some/tulasisland` Source-Commit `892f676fbcef77ab49373aef7865d60afba0ebb7`. Runtime-Kopien liegen lokal in diesem Repo. Ownership: Tula’s Island/Chelonaki Projektassets.

# Deployment
- GitHub Pages URL: https://o-some.github.io/word-guardians/
- Workflow: `.github/workflows/pages.yml`

# Letzter erfolgreicher Test
PENDING — wird nach vollständiger QA eingetragen.

# Wichtige Regeln
- Keine funktionierende Funktion ohne Anweisung entfernen.
- Vor jedem Write aktuellen `main` neu lesen/fetchen.
- Kein Force-Push.
- Mobile immer mitprüfen.
- Vor großen Änderungen Sicherungscommit erstellen.
