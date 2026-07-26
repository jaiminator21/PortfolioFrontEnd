"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  Github,
  Globe,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { AvailabilityBadge } from "@/components/recruiter/AvailabilityBadge";
import { ContactForm } from "@/components/ContactForm";
import { CvDownload } from "@/components/recruiter/CvDownload";
import type { Profile } from "@/sanity/types";
import styles from "@/styles/Contact.module.css";

const PLATFORM_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  email: Mail,
  website: Globe,
  other: Globe,
};

/**
 * Contact routes, ordered by how little friction they cost the recruiter:
 * scheduling link first, then email, then social. The form is last because it
 * gives the sender no confirmation they can act on.
 */
export default function Contact({
  profile,
  locale,
}: {
  profile: Profile;
  locale: string;
}) {
  const t = useTranslations("Contact");

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
            <div className={styles.availabilityRow}>
              <AvailabilityBadge
                status={profile.availability?.status}
                note={profile.availability?.headline}
              />
            </div>
          </header>

          <div className={styles.grid}>
            <div className={styles.infoSide}>
              <div className={styles.socialList}>
                {profile.schedulingUrl ? (
                  <a
                    href={profile.schedulingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    <div className={styles.iconWrapper}>
                      <CalendarClock size={20} />
                    </div>
                    <div className={styles.linkText}>
                      <span>{t("scheduleLabel")}</span>
                      <p>{t("scheduleCall")}</p>
                    </div>
                  </a>
                ) : null}

                <a href={`mailto:${profile.email}`} className={styles.contactLink}>
                  <div className={styles.iconWrapper}>
                    <Mail size={20} />
                  </div>
                  <div className={styles.linkText}>
                    <span>{t("emailLabel")}</span>
                    <p>{profile.email}</p>
                  </div>
                </a>

                {profile.socials?.map((social) => {
                  const Icon = PLATFORM_ICONS[social.platform] ?? Globe;
                  return (
                    <a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                    >
                      <div className={styles.iconWrapper}>
                        <Icon size={20} />
                      </div>
                      <div className={styles.linkText}>
                        <span>{t(`platform.${social.platform}`)}</span>
                        <p>{social.label ?? social.url}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              <div className={styles.cvRow}>
                <CvDownload
                  cv={profile.cv}
                  locale={locale}
                  fullName={profile.fullName}
                />
              </div>
            </div>

            <ContactForm fallbackEmail={profile.email} locale={locale} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
