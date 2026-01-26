import { i18n } from "@lingui/core";
import { setI18n } from "@lingui/react/server";
import { getLocale } from "./utils/locale";

export async function setServerLocale() {
  let locale = await getLocale();
  if (!locale.match(/en|es/)) locale = "en";
  const { messages } = await import(`./langs/${locale}.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
  setI18n(i18n);
  // if (!i18n.locale) {
  //   console.log("Locale: ", locale, "i18n.locale:", i18n.locale);
  //   const { messages } = await import(`./langs/${locale}.po`);
  //   i18n.load(locale, messages);
  //   i18n.activate(locale);
  //   setI18n(i18n);
  // } else {
  //   const { messages } = await import(`./langs/${i18n.locale}.po`);
  //   i18n.load(i18n.locale, messages);
  //   i18n.activate(i18n.locale);
  //   setI18n(i18n);
  // }
  return i18n;
}
