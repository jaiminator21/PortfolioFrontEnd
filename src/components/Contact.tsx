"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "@/styles/Contact.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("¡Mensaje recibido! Me pondré en contacto contigo pronto.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contacto" className={styles.contact}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <header className={styles.header}>
            <h2 className={styles.title}>Hablemos</h2>
            <p className={styles.subtitle}>
              Abierto a nuevas oportunidades y colaboraciones. Si buscas un
              desarrollador comprometido con la calidad, conectemos.
            </p>
          </header>

          <div className={styles.grid}>
            <div className={styles.infoSide}>
              <div className={styles.socialList}>
                <a
                  href="mailto:jaiminator21@gmail.com"
                  className={styles.contactLink}
                >
                  <div className={styles.iconWrapper}>
                    <Mail size={20} />
                  </div>
                  <div className={styles.linkText}>
                    <span>Email</span>
                    <p>jaiminator21@gmail.com</p>
                  </div>
                </a>
                <a
                  href="https://github.com/jaiminator21"
                  className={styles.contactLink}
                >
                  <div className={styles.iconWrapper}>
                    <Github size={20} />
                  </div>
                  <div className={styles.linkText}>
                    <span>Username</span>
                    <p>jaiminator21</p>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/jaime-sebasti%C3%A1n-9b4426205/"
                  className={styles.contactLink}
                >
                  <div className={styles.iconWrapper}>
                    <Mail size={20} />
                  </div>
                  <div className={styles.linkText}>
                    <span>Name</span>
                    <p>Jaime Sebastián</p>
                  </div>
                </a>
              </div>
            </div>

            <div className={styles.formSide}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* INPUT NOMBRE */}
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder=" " // Mantenlo con un espacio
                    className={styles.input} // Clase añadida
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="name" className={styles.label}>
                    Nombre
                  </label>
                  {/* Label ahora está DESPUÉS del input */}
                </div>

                {/* INPUT EMAIL */}
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    className={styles.input} // Clase añadida
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                </div>

                {/* TEXTAREA MENSAJE */}
                <div className={styles.inputGroup}>
                  <textarea
                    id="message"
                    name="message"
                    placeholder=" "
                    className={styles.input} // Clase añadida
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                  <label htmlFor="message" className={styles.label}>
                    Mensaje
                  </label>
                </div>

                <Button type="submit" size="lg" className={styles.submitBtn}>
                  <span>Enviar mensaje</span>
                  <Send className={styles.sendIcon} size={16} />
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
