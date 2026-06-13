# Sitzplan · Hochzeit

Ein interaktiver Sitzplan-Planer für die Hochzeit (Samstag, 110 Plätze, 111 Gäste).
Komplett ohne Build-Schritt und ohne Abhängigkeiten – nur HTML, CSS und etwas
JavaScript. Funktioniert auf Desktop **und** Touch (Handy/Tablet).

## Bedienung

- **Anklicken:** Erst einen Gast (im Pool oder auf einem Stuhl) anklicken, dann
  auf einen freien Stuhl klicken – fertig. Zwei besetzte Stühle nacheinander
  anklicken tauscht die Gäste.
- **Ziehen (Drag & Drop):** Gast aus dem Pool oder von einem Stuhl auf einen
  anderen Stuhl ziehen.
  - Auf einen besetzten Stuhl ziehen → **Tausch**.
  - Einen besetzten Stuhl zurück in den Pool ziehen → Gast **entfernen**.
- **Suchen:** Über das Suchfeld einen Gast im Pool schnell finden.
- **Zoom:** Plus/Minus oder ⤢ (einpassen).
- **Drucken / PDF:** Erzeugt eine saubere Ansicht nur mit dem Raumplan.
- **Reset:** Setzt alle Platzierungen zurück.

Der Stand wird automatisch im Browser gespeichert (localStorage), es geht also
nichts verloren, wenn die Seite neu geladen wird.

## Lokal starten

Am einfachsten: die Datei `index.html` doppelklicken – sie öffnet sich direkt im
Browser.

Oder über einen kleinen lokalen Server (empfohlen, falls der Browser `file://`
einschränkt):

```bash
cd sitzplan
python3 -m http.server 8000
# dann im Browser öffnen: http://localhost:8000
```

## Später im Web veröffentlichen

Da es nur statische Dateien sind, lässt sich der Ordner `sitzplan/` direkt auf
jeden Static-Host hochladen:

- **Vercel / Netlify:** Ordner verbinden bzw. per Drag & Drop hochladen, kein
  Build nötig (Framework: „Other“, Output-Verzeichnis: `sitzplan`).
- **GitHub Pages:** Repository-Pages aktivieren und auf den Ordner zeigen.

> Hinweis: Die Platzierung wird pro Gerät/Browser gespeichert. Wenn ihr (du und
> deine Frau) gemeinsam am selben Stand arbeiten wollt, bräuchte es später eine
> kleine Backend-/Sync-Lösung – das lässt sich bei Bedarf ergänzen.

## Dateien

- `index.html` – Aufbau und Styling
- `app.js` – Gästeliste, Tisch-Layout und die gesamte Interaktion
