import LumiqLogoReveal from '@/components/animations/LumiqLogoReveal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LogoDemo = () => {
  const [key, setKey] = useState(0);
  const [bgColor, setBgColor] = useState('dark');

  const restartAnimation = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
            Lumiq Logo Reveal Animation
          </h1>
          <p className="text-xl text-muted-foreground">
            Premium morphing logo animation - Google-style reveal with 8 cinematic frames
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button onClick={restartAnimation} size="lg">
            Restart Animation
          </Button>
          <Button
            onClick={() => setBgColor(bgColor === 'dark' ? 'light' : 'dark')}
            variant="outline"
            size="lg"
          >
            Toggle Background: {bgColor === 'dark' ? 'Dark' : 'Light'}
          </Button>
        </div>

        {/* Animation Display */}
        <div 
          className={`rounded-2xl overflow-hidden border-2 ${bgColor === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-purple-500/20' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 border-purple-300'}`}
          style={{ height: '600px' }}
        >
          <LumiqLogoReveal key={key} />
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Animation Timeline</CardTitle>
              <CardDescription>8 frames over 8 seconds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><strong>Frame 1 (0s):</strong> Four icons fade in with elastic bounce</div>
              <div><strong>Frame 2 (1s):</strong> Icons drift playfully in different directions</div>
              <div><strong>Frame 3 (2.5s):</strong> Icons morph and stretch organically</div>
              <div><strong>Frame 4 (3.5s):</strong> Circle outline draws clockwise</div>
              <div><strong>Frame 5 (4.5s):</strong> Icons snap into quadrant positions</div>
              <div><strong>Frame 6 (5.5s):</strong> Gradient fills with glow effect</div>
              <div><strong>Frame 7 (6.5s):</strong> "Lumiq" text rises with motion blur</div>
              <div><strong>Frame 8 (7.5s):</strong> Final hero frame with ambient shadows</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Features</CardTitle>
              <CardDescription>Built with Framer Motion & React</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><strong>Icons:</strong> Book, Lamp, Headphones, Laptop (Lucide React)</div>
              <div><strong>Animations:</strong> Elastic easing, smooth morphing, organic motion</div>
              <div><strong>Gradients:</strong> Pink-to-purple-to-blue premium palette</div>
              <div><strong>Effects:</strong> Glow, blur, ambient shadows, pulse animations</div>
              <div><strong>Performance:</strong> 60fps, GPU-accelerated transforms</div>
              <div><strong>Responsive:</strong> Scales to any container size</div>
              <div><strong>Customizable:</strong> Easy to modify colors, timing, icons</div>
              <div><strong>Reusable:</strong> Drop-in component for any React app</div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Usage in Your Website</CardTitle>
            <CardDescription>Copy this component to use anywhere</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div>{'// 1. Install dependencies'}</div>
              <div>{'npm install framer-motion lucide-react'}</div>
              <div className="mt-4">{'// 2. Import the component'}</div>
              <div>{"import LumiqLogoReveal from './components/animations/LumiqLogoReveal';"}</div>
              <div className="mt-4">{'// 3. Use in your JSX'}</div>
              <div>{'<div style={{ width: "100%", height: "600px" }}>'}</div>
              <div>{'  <LumiqLogoReveal />'}</div>
              <div>{'</div>'}</div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Component Path:</h4>
              <code className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-sm">
                /app/frontend/src/components/animations/LumiqLogoReveal.jsx
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Auto-plays once on component mount</li>
                <li>Transparent background - works on any surface</li>
                <li>Responsive to container size</li>
                <li>No props needed - works out of the box</li>
                <li>Optimized for production use</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogoDemo;