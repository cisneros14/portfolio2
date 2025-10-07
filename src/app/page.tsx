import {redirect} from 'next/navigation';
import {headers} from 'next/headers';

const supportedLocales = ['es', 'en'];
const defaultLocale = 'es';

export default async function RootPage() {
  const h = await headers();
  const acceptLanguage = h.get('accept-language');
  let detected = defaultLocale;
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].split('-')[0];
    if (supportedLocales.includes(preferred)) {
      detected = preferred;
    }
  }
  redirect(`/${detected}`);
}
