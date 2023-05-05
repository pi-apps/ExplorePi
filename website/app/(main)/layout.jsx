import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

export default function RootLayout({ children,params }) {
  
  return (
    <html lang={params.lang}>
      <head />
      
      <body>{children}</body>
    </html>
  )
}
