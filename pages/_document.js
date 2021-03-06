import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render(){
        return (
					<Html>
						<Head>
							<link rel="manifest" href="/manifest.json" />
							<link rel="apple-touch-icon" href="/img/icon-256x256.png" />
							<meta name="theme-color" content="#ffffff" />
						</Head>
						<body>
							<Main />
							<NextScript />
						</body>
					</Html>
				);
    }
}

export default MyDocument;