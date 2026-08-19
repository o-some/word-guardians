# TEST CHECKLIST — Word Guardians

## Migration / Integrity
- [x] Source `main` gelesen
- [x] Source Commit dokumentiert
- [x] Rollback-Branch `pre-extraction-word-guardians` angelegt
- [ ] Source-Code vollständig im Ziel vorhanden
- [ ] Alle 5 benötigten Runtime-Assets im Ziel vorhanden
- [ ] Asset-Hashes verifiziert
- [ ] Source-/Target-Bestand verglichen

## Allgemein
- [ ] Seite lädt
- [ ] Reload funktioniert
- [ ] keine weiße/blaue leere Seite
- [ ] keine JavaScript-Fehler
- [ ] keine 404-Assets
- [ ] Touch funktioniert
- [ ] Desktop-Maus funktioniert

## Gameplay
- [ ] Startbutton funktioniert
- [ ] 4×8 Spielfeld sichtbar
- [ ] Helfer platzierbar
- [ ] alle 6 Helfertypen auswählbar
- [ ] HP-Balken unter gesetzten Helfern sichtbar
- [ ] Helfer-Info funktioniert
- [ ] Umsetzen funktioniert
- [ ] Pause/Resume erhält Run-State
- [ ] richtige Antwort erzeugt blaue Wortwelle
- [ ] richtige Antwort gibt Energie / Schaden
- [ ] falsche Antwort zieht allen gesetzten Helfern 10 % ihrer maximalen HP ab
- [ ] Gegner greifen / bewegen sich
- [ ] Endless-Skalierung funktioniert
- [ ] Gefahrenstufe steigt nach Progression
- [ ] Niederlage funktioniert
- [ ] Motivations-Endscreen zeigt Wörter, Zeit, Stufe, Combo, XP, Muscheln
- [ ] Neustart funktioniert
- [ ] lokaler Wörter-Rekord funktioniert

## Deployment
- [ ] Build erfolgreich
- [ ] GitHub Actions grün
- [ ] GitHub Pages erreichbar
- [ ] Startseite HTTP 200
- [ ] kritische Assets HTTP 200
- [ ] keine 404-Pfade
- [ ] Reload/Deep-Link-Fallback funktioniert

## Geräte
- [ ] iPhone Safari (echtes Gerät)
- [ ] Android Chrome oder begründet ausstehend
- [ ] Desktop Chrome
- [ ] Desktop Safari/WebKit, wenn verfügbar

## Entfernung aus tulasisland
- [ ] ALLE vorherigen Gates bestanden
- [ ] letzte getestete Ziel-Commit-SHA in HANDOFF dokumentiert
- [ ] `REMOVE_OLD_COPY = APPROVED`
- [ ] alte Word-Guardians-Kopie entfernt
- [ ] `tulasisland` danach erneut gebaut/geprüft

Bis dahin: **NICHT LÖSCHEN.**
