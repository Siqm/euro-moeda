import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1635772580987396"
          crossorigin="anonymous"></script>
        <title>Euro Moeda</title>
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1635772580987396"
          crossOrigin='anonymous'
          async="true"
          
        />
      </body>
    </Html>
  )
}
