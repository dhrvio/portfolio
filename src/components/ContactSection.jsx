export default function ContactSection() {
  return (
    <div
      id="contact"
      className="py-[150px] px-6 md:px-20 text-center bg-primary rounded-4xl border border-text-light/10 my-20 h-[500px]"
    >
      <h2 className="text-4xl font-bold neon-flicker reveal mb-6 text-text-primary">
        Get In Touch
      </h2>

      <p className="text-text-light mb-8 reveal text-lg max-w-2xl mx-auto">
        I’m on the lookout for innovative frontend opportunities (remote or on-site).  
        Let’s build something amazing together!
      </p>

      <a
        href="mailto:shettydhruva6@gmail.com"
        className="inline-block px-10 py-4 border-2 border-accent text-accent uppercase font-semibold rounded-full neon-flicker animate-pulse hover:bg-accent hover:text-primary transition-all duration-300 shadow-neon reveal"
      >
        Email Me
      </a>
    </div>
  );
}
