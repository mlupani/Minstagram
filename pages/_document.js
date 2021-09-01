import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render(){
        return (
					<Html>
						<Head>
							<link rel="manifest" href="/manifest.json" />
							<link rel="apple-touch-icon" href="/img/icon-192x192.png" />
							<meta name="theme-color" content="#3498db" />
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