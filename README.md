# Produktivitäts-App

Eine moderne Produktivitäts-App, entwickelt mit React, Vite und Firebase. Verwalte deine täglichen Aufgaben, tracke Gewohnheiten und feiere deine Erfolge mit einer schönen, responsiven Oberfläche:
https://boostproductivityapp.netlify.app/

## Funktionen

- **Aufgabenverwaltung:** Tägliche Aufgaben hinzufügen, erledigen, bearbeiten, verschieben, kopieren und löschen.
- **Gewohnheitentracker:** Gewohnheiten anlegen, Tage abhaken und Fortschritte im Monatskalender sehen.
- **Motivierende Belohnungen:** Visuelle Belohnungen, wenn du 70 % oder mehr deiner Tagesaufgaben erledigst.
- **Benutzerauthentifizierung:** Sicheres Login und Registrierung mit Firebase Authentication.
- **Progressive Web App:** Installierbar und offline-fähig dank PWA-Unterstützung.
- **Responsives Design:** Optimiert für Desktop und mobile Geräte.

## Technologiestack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Firebase (Firestore & Auth)](https://firebase.google.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animationen)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Datepicker](https://reactdatepicker.com/)

## Schnellstart

### Voraussetzungen

- Node.js (ab Version 18)
- Eigenes Firebase-Projekt (für eigene Bereitstellung)

### Installation

1. **Repository klonen:**
   ```sh
   git clone https://github.com/dein-benutzername/productivity-app.git
   cd productivity-app
   ```

2. **Abhängigkeiten installieren:**
   ```sh
   npm install
   ```

3. **Umgebungsvariablen einrichten:**

   Erstelle eine `.env`-Datei im Hauptverzeichnis und füge deine Firebase-Konfiguration ein:
   ```
   VITE_FIREBASE_API_KEY=dein-api-key
   VITE_FIREBASE_AUTH_DOMAIN=deine-auth-domain
   VITE_FIREBASE_PROJECT_ID=dein-project-id
   VITE_FIREBASE_STORAGE_BUCKET=dein-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=deine-messaging-sender-id
   VITE_FIREBASE_APP_ID=deine-app-id
   ```

4. **Entwicklungsserver starten:**
   ```sh
   npm run dev
   ```

   Die App ist standardmäßig unter [http://localhost:5173](http://localhost:5173) erreichbar.

### Tests ausführen

```sh
npm test
```

## Projektstruktur

- `src/pages/` — Hauptseiten (TaskPage, HabitPage, LoginPage)
- `src/components/` — Wiederverwendbare UI-Komponenten
- `src/hooks/` — Eigene React Hooks für Aufgaben, Gewohnheiten und Belohnungen
- `src/context/` — React Context für Aufgaben
- `public/` — Statische Assets (Bilder, Icons)
- `firebase.js` — Firebase-Konfiguration

## Deployment

Für die Produktion bauen:

```sh
npm run build
```

Das `dist/`-Verzeichnis kann auf jedem statischen Hosting-Dienst (z.B. Vercel, Netlify, Firebase Hosting) bereitgestellt werden.

## Lizenz

MIT

---

Mit ❤️ für Produktivität entwickelt!
