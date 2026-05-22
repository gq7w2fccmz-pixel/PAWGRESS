# 🐾 Pawgress

Fitness App mit Tier-Coaches.

## Stack
- React 18 + TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Router Dom v6
- Vite

## Setup

```bash
npm install
npm run dev
```

## Struktur

```
src/
  assets/
    images.ts          # Alle Bild-URLs (GitHub CDN)
  components/
    NavBar.tsx         # Bottom Navigation
    UI.tsx             # Shared: ProgressBar, PawImg, TimerRing, etc.
  data/
    areaData.ts        # Übungsbibliothek für alle 8 Bereiche
    exercises.ts       # Workout-Übungen + Tipps
    gymAreas.ts        # Gym-Bereiche + Farben + Bilder
    plans.ts           # Trainingspläne + Coaches
  hooks/
    usePawgressStore.ts  # Zustand Store (global state)
    useTimer.ts          # Rest-Timer Hook
  screens/
    HomeScreen.tsx
    PlanScreen.tsx
    CoachesScreen.tsx
    TrainingScreen.tsx
    ActiveSetScreen.tsx
    WorkoutDone.tsx
    ProfilScreen.tsx
    GymAreaScreen.tsx
  styles/
    tokens.ts          # Design Tokens (Farben, Fonts)
  types/
    index.ts           # TypeScript Types
  App.tsx              # Router + Layout
  main.tsx             # Entry Point
```

## Bilder
Alle Bilder liegen auf GitHub:
https://github.com/gq7w2fccmz-pixel/pawgressbilder

## Deployment
```bash
npm run build
# → dist/ Ordner auf Vercel hochladen
```
