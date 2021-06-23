import 'styles/globals.css'
import 'styles/instagram.min.css'
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import Footer from 'components/Footer'
import { useEffect } from 'react'


function MyApp({ Component, pageProps }) {

  return (
    <>
      <Component {...pageProps}/>
      <Footer/>
    </>
  )
}

export default MyApp
