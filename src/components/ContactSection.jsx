export default function ContactSection() {
  return (
    <section id="contact" className="px-5 py-16 pb-28 md:py-24 md:pb-32">
      <div className="pixel-screen reveal mx-auto max-w-4xl p-6 text-center md:p-10">
        <p className="font-pixel text-xs uppercase text-screen-dark">
          Continue?
        </p>
        <h2 className="mt-3 font-pixel text-3xl font-black uppercase md:text-5xl">
          Get In Touch
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8">
          I am looking for frontend opportunities, remote or on-site. Let us
          build something sharp, responsive, and fun to use.
        </p>
        <a
          href="mailto:shettydhruva6@gmail.com"
          className="pixel-button mt-8 px-8 py-3 text-sm"
        >
          Email Me
        </a>
      </div>
    </section>
  );
}
