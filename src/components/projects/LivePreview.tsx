"use client";

import { useState } from 'react';
import { ExternalLink, Monitor, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '@/styles/LivePreview.module.css';

type Viewport = 'desktop' | 'mobile';

/**
 * The live site in a browser-style frame. Only rendered once the server has
 * confirmed the site allows framing (see `canEmbed`).
 *
 * The sandbox keeps the embedded site from navigating this page away, while
 * still letting it run scripts and open links in a new tab.
 */
export function LivePreview({ url, title }: { url: string; title: string }) {
  const t = useTranslations('ProjectPreview');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [loaded, setLoaded] = useState(false);

  const host = new URL(url).host.replace(/^www\./, '');

  return (
    <figure className={styles.frame}>
      <div className={styles.toolbar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <span className={styles.address}>{host}</span>

        <fieldset className={styles.viewports} aria-label={t('viewport')}>
          {(['desktop', 'mobile'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={viewport === option}
              aria-label={t(option)}
              title={t(option)}
              onClick={() => setViewport(option)}
              className={styles.viewportButton}
            >
              {option === 'desktop' ? <Monitor size={15} /> : <Smartphone size={15} />}
            </button>
          ))}
        </fieldset>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.open}
          aria-label={t('openInNewTab')}
          title={t('openInNewTab')}
        >
          <ExternalLink size={15} />
        </a>
      </div>

      <div className={styles.stage} data-viewport={viewport}>
        {!loaded ? <p className={styles.loading}>{t('loading')}</p> : null}
        <iframe
          src={url}
          title={t('iframeTitle', { title })}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          className={styles.iframe}
        />
      </div>
    </figure>
  );
}
