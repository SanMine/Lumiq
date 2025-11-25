# Lumiq Logo Reveal Animation

## Overview
A premium, playful logo reveal animation featuring morphing icons that transform into a circular logo divided into 4 quadrants. Built with Framer Motion and React, using purple-to-pink gradients and smooth elastic animations.

## Animation Sequence (8 Frames / 8 Seconds)

### Frame 1 — Floating Icons Appear (0s)
Four simple shapes fade in with elastic bounce:
- 📚 Book icon (top-left)
- 💡 Desk lamp icon (bottom-left)  
- 🎧 Headphone icon (top-right)
- 💻 Laptop icon (bottom-right)

Each floats with gradient glow (pink-to-purple).

### Frame 2 — Icons Drift Playfully (1s)
Icons drift slightly in different directions with:
- Soft easing
- Light wobble
- Gentle scaling
- Reverse animation loop

### Frame 3 — Icons Begin Morphing (2.5s)
Each icon:
- Stretches and bends
- Shifts into simplified abstract shapes
- Rotates 360° smoothly
- Hints at final logo layout

### Frame 4 — Circle Outline Appears (3.5s)
- Glowing circular outline draws clockwise
- Morphing shapes move toward final positions
- Pink-to-purple gradient stroke

### Frame 5 — Icons Snap Into Quadrants (4.5s)
Each morphing shape snaps perfectly into position:
- Books (top-left quadrant)
- Lamp (bottom-left quadrant)
- Headset (top-right quadrant)
- Laptop (bottom-right quadrant)

Stroke lines finalize sharply with elastic snap.

### Frame 6 — Gradient Fills In (5.5s)
- Logo's purple-to-pink gradient animates
- Soft glow effect appears
- Dividing lines become visible
- Ambient background glow activates

### Frame 7 — Text Reveal "Lumiq" (6.5s)
- Word "Lumiq" fades upward from below
- Motion blur effect during rise
- Sharpens on arrival
- Gradient matches logo colors

### Frame 8 — Final Hero Frame (7.5s)
- Complete Lumiq logo sits centered
- Crisp, glowing slightly
- Soft ambient shadow
- Subtle pulse animation
- Icons glow with staggered timing

## Technical Specifications

### Technologies Used
- **React** - Component framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling

### Key Features
- ✅ Auto-play on mount (one-time)
- ✅ Transparent background
- ✅ Responsive container sizing
- ✅ 60fps GPU-accelerated animations
- ✅ Elastic easing for premium feel
- ✅ Smooth morphing transitions
- ✅ Ambient glow effects
- ✅ Gradient overlays
- ✅ No external dependencies beyond Framer Motion

### Animation Timing
```javascript
const timeline = [
  { stage: 0, delay: 0 },      // Frame 1: Icons appear
  { stage: 1, delay: 1000 },   // Frame 2: Icons drift
  { stage: 2, delay: 2500 },   // Frame 3: Icons morph
  { stage: 3, delay: 3500 },   // Frame 4: Circle outline
  { stage: 4, delay: 4500 },   // Frame 5: Snap to quadrants
  { stage: 5, delay: 5500 },   // Frame 6: Gradient fill
  { stage: 6, delay: 6500 },   // Frame 7: Text reveal
  { stage: 7, delay: 7500 },   // Frame 8: Final hero
];
```

## Installation

### 1. Install Dependencies
```bash
npm install framer-motion lucide-react
# or
yarn add framer-motion lucide-react
```

### 2. Copy Component File
Copy `/app/frontend/src/components/animations/LumiqLogoReveal.jsx` to your project.

### 3. Import and Use
```jsx
import LumiqLogoReveal from './components/animations/LumiqLogoReveal';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <LumiqLogoReveal />
    </div>
  );
}
```

## Usage Examples

### Auth Landing Page
```jsx
import LumiqLogoReveal from '@/components/animations/LumiqLogoReveal';

export default function AuthLayout() {
  return (
    <div className="flex h-screen">
      {/* Form Section */}
      <div className="w-1/2 p-10">
        <SignInForm />
      </div>
      
      {/* Animation Section */}
      <div className="w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <LumiqLogoReveal />
      </div>
    </div>
  );
}
```

### Hero Section
```jsx
import LumiqLogoReveal from '@/components/animations/LumiqLogoReveal';

export default function Hero() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <LumiqLogoReveal />
      </div>
    </section>
  );
}
```

### Loading Screen
```jsx
import { useState, useEffect } from 'react';
import LumiqLogoReveal from '@/components/animations/LumiqLogoReveal';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after animation completes
    const timer = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return <YourApp />;

  return (
    <div className="fixed inset-0 bg-slate-950 z-50">
      <LumiqLogoReveal />
    </div>
  );
}
```

## Customization Guide

### Change Colors
Modify the gradient colors in the component:
```jsx
// Find and replace gradient classes:
from-pink-500 via-purple-500 to-purple-600

// With your custom colors:
from-blue-500 via-cyan-500 to-teal-600
```

### Adjust Animation Speed
Modify the timeline delays:
```jsx
const timeline = [
  { stage: 0, delay: 0 },
  { stage: 1, delay: 500 },    // Faster: 1000 → 500
  { stage: 2, delay: 1250 },   // Faster: 2500 → 1250
  // ... etc
];
```

### Change Icons
Replace the icons from Lucide React:
```jsx
import { Star, Heart, Sparkles, Trophy } from 'lucide-react';

const iconConfigs = [
  { Icon: Star, ... },
  { Icon: Heart, ... },
  { Icon: Sparkles, ... },
  { Icon: Trophy, ... },
];
```

### Restart Animation
Add a key prop to remount the component:
```jsx
const [key, setKey] = useState(0);

<LumiqLogoReveal key={key} />

<button onClick={() => setKey(prev => prev + 1)}>
  Restart Animation
</button>
```

## Performance Considerations

1. **GPU Acceleration**: Uses CSS transforms (translateX, translateY, scale, rotate) for 60fps
2. **No Layout Thrashing**: Avoids properties that trigger reflow (width, height, top, left)
3. **Optimized Blurs**: Blur effects are applied to separate layers
4. **Lazy Rendering**: Elements only render when their animation stage is active
5. **Efficient Re-renders**: Uses Framer Motion's optimized animation loop

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS 14+, Android Chrome)

## File Structure
```
/app/frontend/src/
├── components/
│   ├── animations/
│   │   └── LumiqLogoReveal.jsx  (Main component)
│   └── shared/
│       └── logo.jsx              (Simple logo)
├── pages/
│   ├── auth/
│   │   ├── AuthRootLayout.jsx   (Auth page using animation)
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   └── LogoDemo.jsx             (Demo page)
└── App.js                        (Routes)
```

## Design Principles

1. **Premium Feel**: Elastic easing creates high-end, bouncy animations
2. **Playful Motion**: Icons drift organically before snapping precisely
3. **Smooth Morphing**: 360° rotations with scale changes feel fluid
4. **Progressive Disclosure**: Each frame builds on the previous
5. **Visual Hierarchy**: Gradient draws eye to final logo
6. **Ambient Details**: Glows, shadows, and pulses add depth

## Credits

- **Animation Style**: Google-inspired morphing logo reveal
- **Design**: Modern startup brand aesthetic
- **Icons**: Lucide React icon library
- **Motion**: Framer Motion animation library

## License

Use freely in your projects. Attribution appreciated but not required.

---

**Component Path**: `/app/frontend/src/components/animations/LumiqLogoReveal.jsx`  
**Demo Page**: `http://localhost:3000/demo`  
**Auth Example**: `http://localhost:3000/auth/sign-in`
