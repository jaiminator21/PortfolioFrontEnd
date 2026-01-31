import Image from "next/image";
import styles from "@/styles/Page.module.css";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About/>
      <Experience/>
      <Skills/>
      <Contact/>
    </>
  );
}
