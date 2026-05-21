import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Skills from "@/components/Skills";
import CertificationsCTA from "@/components/CertificationsCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About/>
      <Experience/>
      <Skills/>
      <CertificationsCTA/>
      <Contact/>
    </>
  );
}
