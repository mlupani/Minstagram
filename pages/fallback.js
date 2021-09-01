import React from 'react'
import Head from 'next/head'

const fallback = () => (
    <>
        <Head>
            <title>Pagina sin conexion</title>
        </Head>
        <div className="container">
            <h2>Esta pagina esta sin conexion</h2>
            <h3>Por favor revise su conexion a internet y vuelva a intentarlo</h3>
        </div>
    </>
);

export default fallback;