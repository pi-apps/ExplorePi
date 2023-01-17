import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { translate } from "translate-config";
config.autoAddCss = false

export async function generateStaticParams() {
  return translate.locales.map(locale => ({lang:locale}));
}

export default function RootLayout({ children,params }) {

  return (
    <html lang={params.lang}>
      <head />
      <body>{children}</body>
    </html>
  )
}
