// ============================================================================
//  Konfiguration – hier eure eigenen Werte eintragen.
//  (Diese Datei darf öffentlich sein: der "anon"-Key ist dafür gedacht,
//   im Browser zu stehen. Der Schutz läuft über das Passwort + Supabase-Regeln.)
// ============================================================================
window.SITZPLAN_CONFIG = {
  // Aus Supabase: Project Settings → API
  SUPABASE_URL: "",          // z. B. "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "",     // der lange "anon public" Key

  // Gemeinsames Passwort für den Zugang (leer lassen = kein Passwortschutz)
  PASSWORD: "",

  // Welcher Plan (falls ihr später mehrere Tage wollt: z. B. "freitag")
  DAY: "samstag",
};
