"use client";
import confetti from "canvas-confetti";

export default function ConfettiEffect() {
  const isMobile = window.innerWidth <= 768;
  const count = isMobile ? 50 : 100;

  const defaults = {
    origin: { y: 1 }, // dolna krawędź ekranu
    ticks: 240,
    zIndex: 1000,
  };

  function fireCorner(x) {
    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          origin: Object.assign({}, defaults.origin, { x }),
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    const angle = isMobile ? 90 : x === 0 ? 60 : 120;

    fire(0.25, {
      spread: 26,
      startVelocity: 65,
      angle,
    });
    fire(0.2, {
      spread: 60,
      angle,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      angle,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 35,
      decay: 0.92,
      scalar: 1.2,
      angle,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 55,
      angle,
    });
  }

  fireCorner(0); // lewy dolny róg
  fireCorner(1); // prawy dolny róg
}
