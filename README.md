# Matemáticas para Informática (Frontend)

Aplicación **React + TypeScript + Vite** con UI (shadcn) para ejecutar ejercicios y mostrar visualizaciones (incluye `DiceRoller`).

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm (incluido con Node)

## Variables de entorno

El frontend consume el backend por `VITE_API_URL`.

- Si no defines nada, usa: `http://localhost:5000`
- Para cambiarlo, crea un archivo `.env.local` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:5000
```

## Instalar dependencias

```bash
cd mat_inf_frontend
npm install
```

## Ejecutar en local (dev)

```bash
npm run dev
```

Por defecto Vite levanta en:

- http://localhost:5173

## Build de producción

```bash
npm run build
npm run preview
```

## Notas

- El componente de dados usa assets desde `public/assets/`.
