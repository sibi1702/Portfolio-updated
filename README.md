# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, Tailwind CSS, and Three.js.

## Project Structure

```
portfolio/
├── public/                  # Static assets
│   ├── images/              # Image files
│   ├── models/              # 3D models
│   └── textures/            # Textures for 3D models
├── src/
│   ├── components/          # React components
│   │   ├── 3d/              # 3D-related components
│   │   │   ├── RealisticStation.tsx
│   │   │   ├── SpaceScene.tsx
│   │   │   └── SpaceStationMesh.tsx
│   │   ├── common/          # Common components
│   │   │   └── VideoBackground.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── sections/        # Page sections
│   │   │   ├── AboutMe.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Honors.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Skills.tsx
│   │   │   └── Timeline.tsx
│   │   └── ui/              # UI components
│   │       ├── Modal.tsx
│   │       ├── ScrollIndicator.tsx
│   │       └── TypewriterText.tsx
│   ├── pages/               # Page components
│   │   └── home.tsx
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
└── package.json             # Dependencies and scripts
```

## Features

- Responsive design for all device sizes
- Interactive 3D space station model
- Animated section transitions
- Project showcase with modal details
- Timeline for education and work experience
- Skills section with categorized skills
- Contact form
- Honors and awards section

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Three.js / React Three Fiber
- Framer Motion
- Vite

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build for production: `npm run build`

## Folder Structure Explanation

- **3d/**: Contains all Three.js related components for 3D visualization
- **common/**: Shared components used across multiple sections
- **layout/**: Components that define the overall layout structure
- **sections/**: Individual content sections of the portfolio
- **ui/**: Reusable UI components like modals and indicators
