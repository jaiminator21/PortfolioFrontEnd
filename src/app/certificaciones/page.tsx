"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Certifications from '@/components/Certifications';
import styles from '@/styles/SecondaryPage.module.css';

export default function CertificationsPage() {
  return (
    <div className={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.backWrap}
      >
        <div className="container-custom">
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} className={styles.backArrow} />
            Volver al Inicio
          </Link>
        </div>
      </motion.div>

      <Certifications />
    </div>
  );
}
