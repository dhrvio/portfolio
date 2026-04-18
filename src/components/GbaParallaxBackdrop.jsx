"use client";

import { useEffect, useRef } from "react";

const layers = [
  {
    src: "/images/gba/parallax-sky.png",
    speed: 0.04,
    opacity: 0.7,
    size: "auto 42vh",
    position: "bottom",
  },
  {
    src: "/images/gba/parallax-far.png",
    speed: 0.08,
    opacity: 0.75,
    size: "auto 48vh",
    position: "bottom",
  },
  {
    src: "/images/gba/parallax-mid.png",
    speed: 0.14,
    opacity: 0.86,
    size: "auto 54vh",
    position: "bottom",
  },
  {
    src: "/images/gba/parallax-near.png",
    speed: 0.22,
    opacity: 0.95,
    size: "auto 62vh",
    position: "bottom",
  },
  {
    src: "/images/gba/parallax-ground.png",
    speed: 0.28,
    opacity: 0.9,
    size: "auto 28vh",
    position: "bottom",
  },
];

export default function GbaParallaxBackdrop() {
  const layerRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;

      layerRefs.current.forEach((layer, index) => {
        if (!layer) return;
        const { speed } = layers[index];
        layer.style.transform = `translate3d(${scrollY * speed * -0.35}px, ${scrollY * speed}px, 0)`;
      });
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,209,102,0.08),rgba(19,21,33,0.25)_34%,rgba(19,21,33,0.88))]" />
      {layers.map((layer, index) => (
        <div
          key={layer.src}
          ref={(node) => {
            layerRefs.current[index] = node;
          }}
          className="pixelated absolute -inset-x-16 inset-y-0 bg-repeat-x will-change-transform"
          style={{
            backgroundImage: `url(${layer.src})`,
            backgroundSize: layer.size,
            backgroundPosition: `center ${layer.position}`,
            opacity: layer.opacity,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-background/45" />
    </div>
  );
}
