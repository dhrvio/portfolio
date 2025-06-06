// src/components/ContactSection.jsx
export default function ContactSection() {
    return (
      <div id="contact" className="py-24 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-bold neon-flicker reveal mb-6">
          Get In Touch
        </h2>
        <p className="text-gray-300 mb-8 reveal">
          I’m on the lookout for innovative frontend opportunities (remote or on-site).  
          Let’s build something amazing together!
        </p>
  
        <a
          href="mailto:shettydhruva6@gmail.com"
          className="inline-block px-10 py-4 border-2 border-accent text-accent uppercase font-semibold rounded-full neon-flicker animate-pulse hover:bg-accent hover:text-black transition-all duration-300 shadow-neon reveal"
        >
          Email Me
        </a>
      </div>
    );
  }
  