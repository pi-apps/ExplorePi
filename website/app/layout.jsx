import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}
