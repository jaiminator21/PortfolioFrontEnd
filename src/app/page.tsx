import Image from "next/image";
import styles from "@/styles/Page.module.css";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About/>
      <Experience/>
      <Contact/>
    </>
  );
}
