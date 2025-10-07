import {getRequestConfig} from 'next-intl/server';

const fallbackLocale = 'es';

export default getRequestConfig(async ({locale}) => {
  const selectedLocale = locale || fallbackLocale;
  return {
    locale: selectedLocale,
    messages: (await import(`../../messages/${selectedLocale}.json`)).default
  };
});
