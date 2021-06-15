import 'styles/globals.css'
import 'styles/instagram.min.css'
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import Footer from 'components/Footer'


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer/>
    </>
  )
}

export default MyApp
