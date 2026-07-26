import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - api routes
  // - the embedded Sanity Studio, which has no locale prefix
  // - Next.js internals (_next, _vercel)
  // - static files (with a dot in the name like favicon.ico)
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
};
