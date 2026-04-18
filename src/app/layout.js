import "./globals.css";
import Header from "../components/Header";
import PageLoader from "../components/PageLoader";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Dhruva Shetty - Frontend Portfolio",
  description:
    "A handheld pixel-inspired frontend portfolio showcasing Dhruva Shetty's skills, experience, projects, and mini games.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body text-text-primary">
        <PageLoader>
          <Header />
          {children}
        </PageLoader>
        <SpeedInsights />
      </body>
    </html>
  );
}
