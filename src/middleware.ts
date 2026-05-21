import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - api routes
  // - Next.js internals (_next, _vercel)
  // - static files (with a dot in the name like favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
