"use client";

import { motion } from "framer-motion";
import { Mail, Github, Send } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import styles from "@/styles/Contact.module.css";

export default function Contact() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(t("form.successAlert"));
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
            <h2 className={styles.title}>{t("title")}</h2>
            <p className={styles.subtitle}>{t("subtitle")}</p>
          </header>

          <div className={styles.grid}>
            <div className={styles.infoSide}>
              <div className={styles.socialList}>
                <a href="mailto:jaiminator21@gmail.com" className={styles.contactLink}>
                  <div className={styles.iconWrapper}>
                    <Mail size={20} />
                  </div>
                  <div className={styles.linkText}>
                    <span>{t("emailLabel")}</span>
                    <p>jaiminator21@gmail.com</p>
                  </div>
                </a>
                <a href="https://github.com/jaiminator21" className={styles.contactLink}>
                  <div className={styles.iconWrapper}>
                    <Github size={20} />
                  </div>
                  <div className={styles.linkText}>
                    <span>{t("githubLabel")}</span>
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
                    <span>{t("nameLabel")}</span>
                    <p>Jaime Sebastián</p>
                  </div>
                </a>
              </div>
            </div>

            <div className={styles.formSide}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder=" "
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="name" className={styles.label}>
                    {t("form.name")}
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email" className={styles.label}>
                    {t("form.email")}
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    id="message"
                    name="message"
                    placeholder=" "
                    className={styles.input}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                  <label htmlFor="message" className={styles.label}>
                    {t("form.message")}
                  </label>
                </div>

                <Button type="submit" size="lg" className={styles.submitBtn}>
                  <span>{t("form.submit")}</span>
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
