import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel'
import styles from 'styles/Wallphoto.module.css'
import Link from 'next/link'
import "react-responsive-carousel/lib/styles/carousel.min.css"

const Wallphoto = ({dataPhotos, columnas, isClickeable}) => {

    const [photos, setPhotos] = useState([])
    const [columns, setColumns] = useState(columnas)

    useEffect(() =>{

        if(dataPhotos)
            setColumns(columnas ? columnas : 3)
        else
            setColumns(1)

        setPhotos(dataPhotos)
    },[dataPhotos])

    return (
        <div style={{"display":"grid", "gridTemplateColumns":`repeat(${columns}, 1fr)`, "gridGap": "5px"}}>
            {photos?
                isClickeable?
                    photos.map(fila => {
                        if(fila.img.length > 1)
                            return (
                                <Link key={fila.img} href={`/status/${fila.id}`}>
                                    <div key={fila.img}>
                                        <Carousel key={fila.img.img} autoPlay={true}  emulateTouch={true} renderIndicator={false} infiniteLoop={true} dynamicHeight={true} showThumbs={false} showIndicators={false} showStatus={false} showArrows={false}  >
                                            {fila.img.map(img =>
                                                <div className={`filter-${img.filterApplied.toLowerCase()}`} key={img.img} >
                                                    <div style={{"backgroundImage":`url(${img.img})`}} key={img.img} className={styles.square+" "+styles.bg}></div>
                                                </div>
                                            )}
                                        </Carousel>
                                    </div>
                                </Link>
                            )
                        else
                            return (
                                <Link key={fila.img[0].img} href={`/status/${fila.id}`}>
                                   <div key={fila.img[0].img}>
                                        <figure className={`filter-${fila.img[0].filterApplied.toLowerCase()}`}>
                                            <div style={{"backgroundImage":`url(${fila.img[0].img})`}} key={fila.img[0].img} className={styles.square+" "+styles.bg}></div>
                                        </figure>
                                    </div>
                                </Link>
                            )
                    })
                    :
                    photos.map(fila => {
                        {
                            if(fila.img.length > 1)
                                return (
                                    <div key={fila.img}>
                                        <Carousel key={fila.img.img} autoPlay={true}  emulateTouch={true} renderIndicator={false} dynamicHeight={true} infiniteLoop={true} showThumbs={false} showIndicators={false} showStatus={false} showArrows={false} >
                                            {fila.img.map(img =>
                                                <figure className={`filter-${img.filterApplied.toLowerCase()}`}>
                                                    <div style={{"backgroundImage":`url(${fila.img[0].img})`}} key={fila.img[0].img} className={styles.square+" "+styles.bg}></div>
                                                </figure>
                                            )}
                                        </Carousel>
                                    </div>
                                )
                            else
                                return (
                                    <div key={fila.img[0].img}>
                                        <figure className={`filter-${fila.img[0].filterApplied.toLowerCase()}`}>
                                            <div style={{"backgroundImage":`url(${fila.img[0].img})`}} key={fila.img[0].img} className={styles.square+" "+styles.bg}></div>
                                        </figure>
                                    </div>
                                )
                        }
                    })
            :
            <div className="row">
                <div className="col-12" style={{"textAlign":"center"}}>
                    <img width="42" height="42" src='/loading.gif'></img>
                </div>
            </div>
            }
            </div>
    );
}

export default Wallphoto;
