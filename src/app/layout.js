import "./globals.css";
import Header from "../components/Header";
import PageLoader from "../components/PageLoader";

export const metadata = {
  title: "Dhruva Shetty — Frontend Portfolio",
  description:
    "A highly dynamic, neon-inspired black-and-white portfolio showcasing Dhruva Shetty’s skills, experience, and projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="text-text-primary">
        <PageLoader>
          <Header />
          {children}
        </PageLoader>
      </body>
    </html>
  );
}
