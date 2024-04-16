import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from './head'
import GetUser from './getuser'
import { Inter } from 'next/font/google'
 
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
config.autoAddCss = false

export default function RootLayout({ children,params }) {
  
  return (
    <html lang={params.lang} className={inter.className}>
      <Head />
      <body>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3524983749365405"
     crossOrigin="anonymous"></script>
        <GetUser>
          {children}
        </GetUser>        
      </body>
    </html>
  )
}
