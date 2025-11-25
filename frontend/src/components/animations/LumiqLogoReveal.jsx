import { motion } from 'framer-motion';
import { Book, Lamp, Headphones, Laptop } from 'lucide-react';
import { useEffect, useState } from 'react';

const LumiqLogoReveal = () => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Animation timeline
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

    timeline.forEach(({ stage, delay }) => {
      setTimeout(() => setAnimationStage(stage), delay);
    });
  }, []);

  const iconVariants = {
    initial: { opacity: 0, scale: 0, y: 0, x: 0, rotate: 0 },
    floating: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.8, 
        ease: [0.68, -0.55, 0.265, 1.55] // Elastic ease
      } 
    },
    drifting: (custom) => ({
      x: custom.x,
      y: custom.y,
      rotate: custom.rotate,
      transition: { 
        duration: 1, 
        ease: 'easeInOut',
        repeat: animationStage === 1 ? 1 : 0,
        repeatType: 'reverse'
      }
    }),
    morphing: {
      scale: 0.7,
      rotate: 360,
      transition: { duration: 1, ease: 'easeInOut' }
    },
    snapping: (custom) => ({
      x: custom.finalX,
      y: custom.finalY,
      scale: 0.8,
      rotate: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.68, -0.55, 0.265, 1.55] // Elastic snap
      }
    })
  };

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: 'easeOut' }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' }
    },
    pulse: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  // Icon positions for different stages
  const iconConfigs = [
    {
      Icon: Book,
      initialPos: { x: -120, y: -80 },
      driftPos: { x: 15, y: -10, rotate: 10 },
      finalPos: { finalX: -60, finalY: -60 },
      color: 'from-pink-500'
    },
    {
      Icon: Lamp,
      initialPos: { x: -120, y: 80 },
      driftPos: { x: -15, y: 10, rotate: -8 },
      finalPos: { finalX: -60, finalY: 60 },
      color: 'from-pink-400'
    },
    {
      Icon: Headphones,
      initialPos: { x: 120, y: -80 },
      driftPos: { x: -10, y: 15, rotate: -12 },
      finalPos: { finalX: 60, finalY: -60 },
      color: 'to-purple-500'
    },
    {
      Icon: Laptop,
      initialPos: { x: 120, y: 80 },
      driftPos: { x: 10, y: -12, rotate: 8 },
      finalPos: { finalX: 60, finalY: 60 },
      color: 'to-purple-600'
    }
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient background glow */}
      {animationStage >= 5 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5"
          variants={glowVariants}
          initial="hidden"
          animate={animationStage >= 7 ? 'pulse' : 'visible'}
        />
      )}

      {/* Main animation container */}
      <div className="relative w-[400px] h-[400px]">
        {/* Circle outline (Frame 4) */}
        {animationStage >= 3 && (
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 400"
            initial="hidden"
            animate="visible"
          >
            {/* Main circle */}
            <motion.circle
              cx="200"
              cy="200"
              r="140"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              variants={circleVariants}
            />
            
            {/* Dividing lines */}
            {animationStage >= 4 && (
              <>
                <motion.line
                  x1="200"
                  y1="60"
                  x2="200"
                  y2="340"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  variants={circleVariants}
                />
                <motion.line
                  x1="60"
                  y1="200"
                  x2="340"
                  y2="200"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  variants={circleVariants}
                />
              </>
            )}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={animationStage >= 5 ? 1 : 0.6} />
                <stop offset="50%" stopColor="#a855f7" stopOpacity={animationStage >= 5 ? 1 : 0.6} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={animationStage >= 5 ? 1 : 0.6} />
              </linearGradient>
            </defs>
          </motion.svg>
        )}

        {/* Floating Icons (Frames 1-5) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {iconConfigs.map((config, index) => {
            const { Icon, initialPos, driftPos, finalPos, color } = config;
            
            let animateState = 'initial';
            if (animationStage >= 1) animateState = 'floating';
            if (animationStage === 1) animateState = 'drifting';
            if (animationStage === 2) animateState = 'morphing';
            if (animationStage >= 4) animateState = 'snapping';

            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  x: initialPos.x,
                  y: initialPos.y
                }}
                variants={iconVariants}
                initial="initial"
                animate={animateState}
                custom={animationStage === 1 ? driftPos : finalPos}
              >
                <div className={`p-4 rounded-full bg-gradient-to-br ${color} to-transparent backdrop-blur-sm ${animationStage >= 5 ? 'opacity-90' : 'opacity-100'}`}>
                  <Icon 
                    className="w-8 h-8 text-white drop-shadow-lg" 
                    strokeWidth={2.5}
                  />
                </div>
                
                {/* Icon glow effect */}
                {animationStage >= 5 && (
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} to-transparent blur-xl`}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Text Reveal (Frame 7) */}
        {animationStage >= 6 && (
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-12 text-center"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Lumiq
            </h1>
            
            {/* Text glow */}
            {animationStage >= 7 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 blur-2xl opacity-30"
                animate={{
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </motion.div>
        )}

        {/* Final ambient shadow (Frame 8) */}
        {animationStage >= 7 && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
};

export default LumiqLogoReveal;