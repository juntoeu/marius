# Sitzplan · Hochzeit

Ein interaktiver Sitzplan-Planer für die Hochzeit (Samstag, 110 Plätze, 111 Gäste).
Statische Web-App ohne Build-Schritt. Funktioniert auf Desktop **und** Touch.
Optional mit **geteiltem Live-Speicher** (Supabase) und **Passwortschutz**.

## Bedienung

- **Anklicken:** Erst einen Gast (Pool oder Stuhl) anklicken, dann auf einen
  freien Stuhl klicken. Zwei besetzte Stühle nacheinander = Tausch.
- **Ziehen:** Gast auf einen Stuhl ziehen. Auf besetzten Stuhl = Tausch.
  Besetzten Stuhl zurück in den Pool ziehen = entfernen.
- **Suchen / Zoom / Drucken (PDF) / Reset** über die Kopfzeile.

## Lokal starten

`index.html` doppelklicken – oder `python3 -m http.server 8000` im Ordner.
Ohne Supabase-Keys speichert die App lokal im Browser (localStorage).

## Geteilter Live-Speicher + Passwort (für die Planung zu zweit)

So sehen zwei Personen denselben Plan in Echtzeit, geräteübergreifend:

1. **Supabase-Projekt** anlegen (kostenlos, https://supabase.com).
2. In Supabase: **SQL Editor** → Inhalt von `supabase-setup.sql` einfügen → **Run**.
3. In Supabase: **Project Settings → API** → `Project URL` und `anon public`-Key kopieren.
4. In `config.js` eintragen: `SUPABASE_URL`, `SUPABASE_ANON_KEY` und ein gemeinsames `PASSWORD`.

Leere Keys = reiner Lokal-Modus. Leeres `PASSWORD` = kein Passwortschutz.

> Sicherheit: Der `anon`-Key gehört bewusst in den Browser-Code; der Zugang wird
> übers Passwort + Supabase-Regeln geschützt. Für ein privates Gäste-Tool ist das
> angemessen (keine Hochsicherheit).

## Auf Vercel deployen (Auto-Deploy)

1. Diesen Ordner als **eigenes GitHub-Repo** hochladen.
2. Auf https://vercel.com das Repo importieren (**Framework: „Other"**, keine
   Build-Einstellungen – Dateien liegen an der Wurzel).
3. Ab dann deployt jeder Git-Push automatisch.

## Dateien

- `index.html` – Aufbau & Styling, Passwort-Gate
- `app.js` – Gästeliste, Tisch-Layout, Interaktion, Cloud-Sync
- `config.js` – eure Keys/Passwort (hier eintragen)
- `supabase-setup.sql` – einmalig in Supabase ausführen
