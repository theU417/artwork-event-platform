// components/PaintSplashEffect.js
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import p5.js (SSR incompatible)
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

export default function PaintSplashEffect() {
  let splashInterval;

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    p5.colorMode(p5.HSB, 360, 100, 100);
    p5.noStroke();
    createAutoSplashes(p5);
    splashInterval = setInterval(() => createAutoSplash(p5), p5.random(5000, 10000));
  };

  const createAutoSplash = (p5) => {
    const x = p5.random(p5.width);
    const y = p5.random(p5.height);
    const hue = p5.random(360);

    p5.push();
    p5.translate(x, y);
    p5.fill(hue, 100, 100);
    
    const dropNum = p5.int(p5.map(p5.random(1), 0, 1, 700, 1000));
    for (let i = 0; i < dropNum; i++) {
      const diameter = p5.pow(p5.random(1), 20);
      const distance = p5.sq((1.0 - p5.pow(diameter, 2)) * p5.random(1));
      const scaledDiameter = p5.map(diameter, 0, 1, 1, 30);
      const scaledDistance = p5.map(distance, 0, 1, 0, 300);
      const radian = p5.random(p5.TWO_PI);
      p5.ellipse(
        scaledDistance * p5.cos(radian),
        scaledDistance * p5.sin(radian),
        scaledDiameter,
        scaledDiameter
      );
    }
    p5.pop();
  };

  const createAutoSplashes = (p5) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createAutoSplash(p5), i * 800);
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  useEffect(() => {
    return () => clearInterval(splashInterval);
  }, []);

  return <Sketch setup={setup} windowResized={windowResized} />;
}// JavaScript Document