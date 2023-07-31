import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from './head'
import GetUser from './getuser'

config.autoAddCss = false

export default function RootLayout({ children,params }) {
  
  return (
    <html lang={params.lang}>
      <Head />
      
      <body>
        <GetUser>
          {children}
        </GetUser>        
      </body>
    </html>
  )
}
