// src/lib/resumeData.js
export const resumeData = {
    personal: {
      name: "Dhruva Shetty",
      title: "Software Engineer 2 | Frontend Engineering",
      phone: "9483834011",
      email: "shettydhruva6@gmail.com",
      location: "Kaup, Udupi, Karnataka, India",
      linkedin: "https://linkedin.com/in/dhrvio",
      avatar: "/images/avatar.jpeg", // your headshot, optional
      summary:
        "Motivated and dedicated Frontend Developer with over 2 years of experience in startup environments. Highly skilled in React.js with practical exposure to Next.js and AWS services. Demonstrated expertise in designing engaging and scalable web applications in both educational and ecommerce domains. Adept at quick problem solving and debugging, with a strong drive to continuously learn and contribute within collaborative teams.",
    },
    experience: [
      {
        company: "7EDGE, Mangaluru, Karnataka, India",
        role: "Software Engineer 2 – Frontend Engineering",
        date: "Nov 2024 – Present",
        bulletPoints: [
          "Lead frontend initiatives in developing user-centric web applications.",
          "Collaborate with cross-functional teams to design and implement interactive interfaces.",
          "Optimize performance and ensure high responsiveness in production systems.",
        ],
      },
      {
        company: "7EDGE, Mangaluru, Karnataka, India",
        role: "Software Development Engineer 1 – Frontend",
        date: "Apr 2024 – Oct 2024",
        bulletPoints: [
          "Developed and maintained scalable web applications using React.js and Next.js.",
          "Worked closely with UI/UX designers to implement modern, responsive designs.",
          "Participated in code reviews, performance tuning, and feature enhancements.",
        ],
      },
      {
        company: "7EDGE, Mangaluru, Karnataka, India",
        role: "Software Development Engineer Trainee – Frontend",
        date: "Jul 2023 – Mar 2024",
        bulletPoints: [
          "Assisted in developing key features and resolving bugs across web applications.",
          "Gained practical experience with modern frontend frameworks and AWS cloud services.",
          "Supported rapid prototyping and iterative development cycles.",
        ],
      },
    ],
    projects: [
      {
        name: "School Management System",
        description:
          "Designed and developed a full-fledged school management platform that includes academic, attendance, and financial management.",
        bullets: [
          "Implemented financial statement features including balance sheets, profit & loss statements, receipts & payments, and trial balances.",
          "Built an interactive dashboard to provide real-time insights into school operations.",
        ],
        image: "/images/project-1.png",
        link: "#", // add a live link or GitHub link if available
      },
      {
        name: "E-Commerce Shopping App",
        description:
          "Developed a Next.js 15-based e-commerce platform with optimized performance and modern UI/UX.",
        bullets: [
          "Integrated product catalogs, user authentication, and secure payment processing.",
          "Ensured smooth client-side and server-side rendering (SSR/CSR) for an enhanced shopping experience.",
        ],
        image: "/images/project-2.png",
        link: "#",
      },
    ],
    skills: [
      // You can break this down by category if you want
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 85 },
      { name: "HTML5 / CSS3", level: 95 },
      { name: "JavaScript (ES6+)", level: 90 },
      { name: "AWS (Cloud Practitioner)", level: 70 },
      // ...
    ],
  };
  