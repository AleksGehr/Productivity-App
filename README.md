# Productivity App

A modern productivity app built with React, Vite, and Firebase. Track your daily tasks, manage habits, and celebrate your achievements with a beautiful, responsive interface.

## Features

- **Task Management:** Add, complete, edit, move, copy, and delete daily tasks.
- **Habit Tracker:** Create habits, check off days, and view your progress in a monthly calendar.
- **Motivational Celebrations:** Get visual celebrations when you complete 70% or more of your tasks for the day.
- **User Authentication:** Secure login and registration using Firebase Authentication.
- **Progressive Web App:** Installable and offline-ready with PWA support.
- **Responsive Design:** Works great on desktop and mobile devices.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Firebase (Firestore & Auth)](https://firebase.google.com/)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Datepicker](https://reactdatepicker.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Firebase project (for your own deployment)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/productivity-app.git
   cd productivity-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Running Tests

```sh
npm test
```

## Project Structure

- `src/pages/` — Main pages (TaskPage, HabitPage, LoginPage)
- `src/components/` — Reusable UI components
- `src/hooks/` — Custom React hooks for tasks, habits, and celebrations
- `src/context/` — React context for tasks
- `public/` — Static assets (images, icons)
- `firebase.js` — Firebase configuration

## Deployment

Build the app for production:

```sh
npm run build
```

You can deploy the `dist/` folder to any static hosting service (e.g., Vercel, Netlify, Firebase Hosting).

## License

MIT

---

Made with ❤️ for productivity!