# Portfolio — Jaime Sebastián

Next.js 16 (App Router) front-end with a Sanity-backed content model, bilingual
(es/en) via `next-intl`.

```
.
├── src/            # Next.js app
│   ├── sanity/     # client, queries, types, fetch helpers
│   ├── lib/        # dates, metadata, JSON-LD, highlight
│   └── components/ # presentation, all prop-driven
└── studio/         # Sanity Studio (standalone)
```

## Getting started

```bash
cp .env.example .env.local   # fill in SANITY_API_READ_TOKEN
npm install
npm run dev                  # http://localhost:3000
```

The Studio runs as its own app, in a second terminal:

```bash
cd studio
npm install
npm run dev                  # http://localhost:3333
```

Standalone rather than embedded at `/studio`: `sanity dev` runs on Vite and is
far faster than compiling the Studio through `next build`, and a standalone
Studio auto-updates without a dependency bump and redeploy.

To edit content from anywhere (including your phone), deploy the Studio once:

```bash
cd studio
npx sanity login             # one-time
npm run deploy               # → https://<name>.sanity.studio
```

## Seeding a dataset

`studio/scripts/seed.mjs` populates an empty dataset. It needs a write token with
Editor rights (create one at `https://sanity.io/manage/project/<id>/api`):

```bash
SANITY_WRITE_TOKEN=sk... npm run seed --prefix studio
```

It writes in two tiers, which is the point of it:

- **Published** — content that is genuinely yours: name, contact, the tech stack,
  page copy. 29 documents.
- **Drafts** — the employers, project case studies and certifications carried over
  from the original template. 17 documents. They appear in the Studio ready to
  edit but are not part of the published dataset, so the live site never asserts
  an employer you did not work for or a credential that cannot be verified.
  Replace the content, then publish.

It uses `createOrReplace`, so re-running overwrites those documents — meant for a
fresh dataset, not for syncing one you have already edited.

Override the target with `SANITY_PROJECT_ID` and `SANITY_DATASET`.

## Content model

| Type            | Notes |
| --------------- | ----- |
| `profile`       | Singleton: identity, availability, CV files, socials. Drives the `Person` JSON-LD. |
| `experience`    | One per role. `endDate` empty means current. |
| `project`       | `kind` = professional (case study) or personal. |
| `certification` | `verifyUrl` is the important field — see below. |
| `skill`         | One per technology, referenced from the three types above. |
| `page`          | Heading + intro + SEO for each fixed route. |
| `locale`        | Available languages. Adding one is a content change, not a code change. |

### Localization

Field-level, via `sanity-plugin-internationalized-array`, which is Sanity's
recommendation for structured content. Both languages sit side by side on the
same document while shared data (dates, tech stack, URLs) stays single-sourced.

Localized fields are resolved **in GROQ**, not in components: every query takes
`$locale` and `$defaultLocale` and returns plain strings that already fall back
to Spanish. Components never see `[{_key, value}]` arrays. The `src/sanity/fetch.ts`
helpers inject both params, so always go through those.

Skill and certification names are deliberately **not** localized — "TypeScript"
is "TypeScript" everywhere, and translating them would break the exact-string
matching recruiters and ATS filters rely on.

### Two guardrails worth knowing about

**Metrics must be marked verified to render.** `metric.verified` defaults to
false and `verifiedMetrics` in `src/sanity/lib/fragments.ts` filters on it, so an
unverified number stays editable in the Studio and invisible in public. Tick the
box only when you can defend the figure in an interview.

**Unverifiable certifications are never asserted as credentials.** Only
certifications with a `verifyUrl` are emitted in the `hasCredential` JSON-LD. A
credential a recruiter cannot check is worth nothing; one that fails a check
costs you the role.

### Derived, never stored

Years of experience comes from `profile.careerStartDate`, and "Present" comes
from an empty `endDate`. Neither can go stale.

### Heading accents

Wrap a word in asterisks in a `page.title` — `Building the *digital* future.` —
and `withHighlight` gives it the accent colour. The markers are stripped from
metadata so they never appear in a search result.

## Recruiter-facing behaviour

- `Person` JSON-LD in the layout, with `sameAs` linking the site to LinkedIn and
  GitHub; page-level schemas reference it by `@id` rather than restating identity.
- `hreflang` alternates plus `x-default` on every route, so es/en are treated as
  translations rather than duplicate content.
- Availability status, target roles and work modes surface in the hero and on the
  contact page.
- CV download reads from `profile.cv` per language and is hidden when no file is
  uploaded, instead of linking to a 404.
- Empty states everywhere: an unpublished section shortens the page rather than
  rendering empty headings.

## Contact form (Web3Forms)

Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` — get a key at
[web3forms.com](https://web3forms.com) by entering the address you want messages
delivered to. Until it is set the form renders a clear error and offers your
email address instead of failing silently.

**The key is public on purpose.** Web3Forms returns `403 — "Use our API in client
side"` for server-side POSTs on the free plan, so the browser has to submit
directly. The key only grants permission to send to the address it was issued
for, which is why Web3Forms documents it as safe to expose. Server-side
submission needs the Pro plan plus an IP allowlist.

The `<form>` keeps a real `action` and `method`, so with JavaScript disabled the
browser posts natively and the message still arrives; with JavaScript the submit
is intercepted for inline validation and status states. `replyto` is set to the
sender's address so hitting reply in your inbox reaches them. A hidden `botcheck`
honeypot filters bots.

Free tier is 250 submissions/month.

## Verification

```bash
npm run build                # typechecks and builds
cd studio && npx sanity schema validate
```

`npm run lint` reports pre-existing formatting differences across the repo
(`biome.json` prefers double quotes, the codebase uses single); it is not a
regression from the Sanity work.

## Deploying

Set these in your host, matching `.env.example`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` (server only)
- `NEXT_PUBLIC_SITE_URL` — the canonical origin; sitemap, robots and absolute OG
  image URLs are all built from it.

Add the production URL to the project's CORS origins:

```bash
cd studio && npx sanity cors add https://your-domain.com --credentials
```
