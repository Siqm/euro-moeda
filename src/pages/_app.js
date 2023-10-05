import '@/styles/globals.scss'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1635772580987396"
        crossOrigin='anonymous'
        async
        strategy="afterInteractive"
        onError={(e) => console.log('Script failed to load', e)}
      />
      <Component {...pageProps} />
    </>
  )
}
