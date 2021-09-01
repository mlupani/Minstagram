import React, { useEffect } from 'react'
import 'styles/globals.css'
import 'styles/instagram.min.css'
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import Footer from 'components/Footer'
import Head from "next/head";


function MyApp({ Component, pageProps }) {

  useEffect(() => {
		if (window.navigator?.serviceWorker)
			window.navigator?.serviceWorker
				.register("/sw.js", { scope: "/" })
				.then((reg) => localStorage.setItem("regSW", JSON.stringify(reg)));
	}, []);

  return (
		<>
			<Head>
				<title>Minstagram</title>
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#3498db" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<link rel="apple-touch-icon" href="img/icon-192x192.png" />
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="img/icon-152x152.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="img/icon-152x152.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="167x167"
					href="img/icon-152x152.png"
				/>

				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>

				<meta name="apple-mobile-web-app-title" content="Minstagram!"></meta>
				<meta
					id="viewport"
					name="viewport"
					content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"
				/>
				<meta name="robots" content="noimageindex, noarchive" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="mobile-web-app-capable" content="yes" />
			</Head>

			<Component {...pageProps} />
			<Footer />
		</>
	);
}

export default MyApp
