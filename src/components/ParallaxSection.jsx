// src/components/ParallaxSection.jsx
"use client";
import { useRef, useEffect } from "react";

export default function ParallaxSection({
  children,
  speed = 0.3,
  className = "",
}) {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    // Intersection Observer to add "active" class for fadeInUp
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (element) {
      // Apply .reveal to every direct child so they fade in
      element.querySelectorAll(".reveal").forEach((child) => {
        observer.observe(child);
      });
    }

    function handleScroll() {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // adjust translateY based on scroll
        const offset = window.scrollY * speed;
        element.style.transform = `translateY(${offset * -1}px)`;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (element) {
        element.querySelectorAll(".reveal").forEach((child) => {
          observer.unobserve(child);
        });
      }
    };
  }, [speed]);

  return (
    <section
      ref={ref}
      className={`relative parallax w-[80%] mx-auto ${className}`}
      style={{ transform: "translateY(0)" }}
    >
      {children}
    </section>
  );
}
