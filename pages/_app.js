import React from 'react'
import 'styles/globals.css'
import 'styles/instagram.min.css'
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import Footer from 'components/Footer'


function MyApp({ Component, pageProps }) {

	/*
  useEffect(() => {
		if (window.navigator?.serviceWorker)
			window.navigator?.serviceWorker
				.register("/sw.js", { scope: "/" })
				.then((reg) => localStorage.setItem("regSW", JSON.stringify(reg)));
	}, []);
	*/

  return (
		<>
			<Component {...pageProps} />
			<Footer />
		</>
	);
}

export default MyApp
