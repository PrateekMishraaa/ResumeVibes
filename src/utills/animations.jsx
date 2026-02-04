// src/utils/animations.js
import { motion } from 'framer-motion';
import React from 'react';

// ========== PAGE TRANSITIONS ==========
export const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: 20,
    scale: 0.98
  }
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
  delay: 0.1
};

// ========== STAGGERED ANIMATIONS ==========
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerFast = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

// ========== FADE ANIMATIONS ==========
export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// ========== SCALE ANIMATIONS ==========
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

export const scaleDown = {
  hidden: { opacity: 0, scale: 1.2 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "circOut"
    }
  }
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

// ========== SLIDE ANIMATIONS ==========
export const slideUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const slideDown = {
  hidden: { opacity: 0, y: -50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const slideLeft = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const slideRight = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// ========== ROTATE ANIMATIONS ==========
export const rotateIn = {
  hidden: { opacity: 0, rotate: -90 },
  show: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "backOut"
    }
  }
};

export const flipIn = {
  hidden: { opacity: 0, rotateY: 90 },
  show: {
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// ========== BOUNCE & FLOAT ANIMATIONS ==========
export const bounce = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// ========== HOVER & TAP EFFECTS ==========
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

export const tapScale = {
  scale: 0.95,
  transition: {
    duration: 0.1
  }
};

export const hoverLift = {
  y: -5,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

// ========== GRADIENT ANIMATIONS ==========
export const gradientFlow = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "linear"
  }
};

export const shimmerAnimation = {
  backgroundPosition: ['0% 0%', '100% 100%'],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
};

// ========== LOADING & PROGRESS ANIMATIONS ==========
export const loadingDots = (i) => ({
  y: [0, -10, 0],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    delay: i * 0.2,
    ease: "easeInOut"
  }
});

export const progressFill = (percentage) => ({
  width: `${percentage}%`,
  transition: {
    duration: 1,
    ease: "easeOut"
  }
});

// ========== TYPERWRITER EFFECT ==========
export const typewriter = (text, index) => ({
  hidden: { 
    opacity: 0,
    width: 0 
  },
  show: (i) => ({
    opacity: 1,
    width: "auto",
    transition: {
      duration: 0.05 * text.length,
      delay: i * 0.1
    }
  })
});

// ========== WAVE ANIMATION ==========
export const wave = (i) => ({
  y: [0, -15, 0],
  transition: {
    duration: 1,
    repeat: Infinity,
    delay: i * 0.1,
    ease: "easeInOut"
  }
});

// ========== GLITCH EFFECT ==========
export const glitch = {
  x: [0, -5, 5, -5, 5, 0],
  y: [0, 5, -5, 5, -5, 0],
  transition: {
    duration: 0.3,
    repeat: 0
  }
};

// ========== SHAKE ANIMATION ==========
export const shake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
    ease: "easeInOut"
  }
};

// ========== BUBBLE ANIMATION ==========
export const bubble = (delay = 0) => ({
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay
    }
  }
});

// ========== CARD FLIP ANIMATION ==========
export const cardFlip = {
  hidden: { rotateY: 90, opacity: 0 },
  show: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    rotateY: -90,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeIn"
    }
  }
};

// ========== PARALLAX SCROLL ==========
export const parallaxScroll = (speed = 0.5) => ({
  y: (progress) => progress * speed * 100
});

// ========== REVEAL ANIMATIONS ==========
export const revealFromLeft = {
  hidden: { 
    opacity: 0,
    x: -100,
    width: 0 
  },
  show: {
    opacity: 1,
    x: 0,
    width: "100%",
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const revealFromRight = {
  hidden: { 
    opacity: 0,
    x: 100,
    width: 0 
  },
  show: {
    opacity: 1,
    x: 0,
    width: "100%",
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// ========== MORPHING SHAPE ==========
export const morphShape = {
  initial: { borderRadius: "50%" },
  animate: {
    borderRadius: ["50%", "20%", "50%", "30%", "50%"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ========== PROGRESS CIRCLE ==========
export const progressCircle = (percentage) => ({
  strokeDashoffset: 283 - (283 * percentage) / 100,
  transition: {
    duration: 2,
    ease: "easeOut"
  }
});

// ========== CUSTOM ANIMATION HOOKS ==========
export const useScrollAnimation = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const useInViewAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

// ========== BUTTON ANIMATIONS ==========
export const buttonHover = {
  scale: 1.05,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

export const buttonTap = {
  scale: 0.95,
  transition: {
    duration: 0.1
  }
};

export const buttonGlow = {
  boxShadow: [
    "0 0 20px rgba(59, 130, 246, 0.5)",
    "0 0 40px rgba(147, 51, 234, 0.5)",
    "0 0 20px rgba(59, 130, 246, 0.5)"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// ========== TEXT ANIMATIONS ==========
export const textGlitch = {
  textShadow: [
    "2px 2px 0 #ff00ff, -2px -2px 0 #00ffff",
    "-2px 2px 0 #ff00ff, 2px -2px 0 #00ffff",
    "2px -2px 0 #ff00ff, -2px 2px 0 #00ffff",
    "0 0 0 transparent"
  ],
  transition: {
    duration: 0.2,
    repeat: 3,
    repeatDelay: 0.1
  }
};

export const textGradientFlow = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "linear"
  }
};

// ========== LIST ITEM ANIMATIONS ==========
export const listItem = (i) => ({
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  }
});

export const listItemStagger = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

// ========== MODAL ANIMATIONS ==========
export const modalBackdrop = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

export const modalContent = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2
    }
  }
};

// ========== TOAST ANIMATIONS ==========
export const toastEnter = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.9 },
  transition: { duration: 0.2 }
};

// ========== SPINNER ANIMATIONS ==========
export const spinnerRotate = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }
};

export const spinnerPulse = {
  scale: [1, 1.2, 1],
  opacity: [1, 0.7, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// ========== ANIMATION COMPONENTS ==========

// Pre-configured Animated Component
export const AnimatedDiv = ({ children, animation = "fadeInUp", delay = 0, ...props }) => {
  const animations = {
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleUp,
    scaleDown,
    slideUp,
    slideDown,
    bounce
  };

  const selectedAnimation = animations[animation] || fadeInUp;

  return (
    <motion.div
      variants={selectedAnimation}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container Component
export const StaggerContainer = ({ children, stagger = 0.1, ...props }) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    transition={{ staggerChildren: stagger }}
    {...props}
  >
    {children}
  </motion.div>
);

// List Item Component
export const AnimatedListItem = ({ children, index, ...props }) => (
  <motion.div
    variants={listItemStagger}
    custom={index}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    {...props}
  >
    {children}
  </motion.div>
);

// Floating Element Component
export const FloatingElement = ({ children, floatIntensity = 10, ...props }) => (
  <motion.div
    animate={{ y: [0, -floatIntensity, 0] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Pulse Element Component
export const PulsingElement = ({ children, pulseScale = 1.05, ...props }) => (
  <motion.div
    animate={{ scale: [1, pulseScale, 1] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Gradient Text Component
export const GradientText = ({ children, gradient = "from-blue-600 to-purple-600", ...props }) => {
  const gradientClasses = `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`;
  
  return (
    <motion.span
      className={gradientClasses}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: '200% 200%',
        display: 'inline-block'
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// ========== ANIMATION UTILITIES ==========

// Delay function for sequential animations
export const createStaggerDelay = (index, baseDelay = 0.1) => ({
  delay: index * baseDelay
});

// Calculate animation duration based on content
export const calculateTypingDuration = (text, speed = 50) => ({
  duration: (text.length * speed) / 1000
});

// Generate random animation parameters
export const getRandomAnimation = () => {
  const animations = [
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleUp,
    bounce,
    slideUp
  ];
  
  const randomIndex = Math.floor(Math.random() * animations.length);
  const randomDelay = Math.random() * 0.5;
  
  return {
    animation: animations[randomIndex],
    delay: randomDelay
  };
};

// Create confetti animation
export const createConfettiAnimation = (count = 50) => {
  const isBrowser = typeof window !== 'undefined';
  const windowWidth = isBrowser ? window.innerWidth : 1000;
  const windowHeight = isBrowser ? window.innerHeight : 800;

  return Array.from({ length: count }).map((_, i) => ({
    key: i,
    initial: {
      x: Math.random() * windowWidth,
      y: -50,
      rotate: 0
    },
    animate: {
      y: windowHeight + 100,
      rotate: 360,
      x: Math.random() * 200 - 100 + (Math.random() * windowWidth)
    },
    transition: {
      duration: Math.random() * 3 + 2,
      ease: "linear"
    },
    style: {
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      background: `hsl(${Math.random() * 360}, 100%, 60%)`,
      position: 'absolute',
      borderRadius: ['0%', '50%'][Math.floor(Math.random() * 2)]
    }
  }));
};

// ========== EXPORT ALL ANIMATIONS ==========
export default {
  // Page Transitions
  pageVariants,
  pageTransition,
  
  // Staggered
  staggerContainer,
  staggerFast,
  
  // Fade
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  
  // Scale
  scaleUp,
  scaleDown,
  popIn,
  
  // Slide
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  
  // Rotate
  rotateIn,
  flipIn,
  
  // Effects
  bounce,
  floatAnimation,
  pulseAnimation,
  hoverScale,
  tapScale,
  hoverLift,
  gradientFlow,
  shimmerAnimation,
  loadingDots,
  progressFill,
  typewriter,
  wave,
  glitch,
  shake,
  bubble,
  cardFlip,
  parallaxScroll,
  revealFromLeft,
  revealFromRight,
  morphShape,
  progressCircle,
  
  // Custom Hooks
  useScrollAnimation,
  useInViewAnimation,
  
  // UI Components
  buttonHover,
  buttonTap,
  buttonGlow,
  textGlitch,
  textGradientFlow,
  listItem,
  listItemStagger,
  modalBackdrop,
  modalContent,
  toastEnter,
  spinnerRotate,
  spinnerPulse,
  
  // Components
  AnimatedDiv,
  StaggerContainer,
  AnimatedListItem,
  FloatingElement,
  PulsingElement,
  GradientText,
  
  // Utilities
  createStaggerDelay,
  calculateTypingDuration,
  getRandomAnimation,
  createConfettiAnimation
};