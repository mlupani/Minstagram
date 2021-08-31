import React, { useState, Fragment, useRef } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import styles from 'styles/Preview.module.css'
import Filters from 'components/Filters'
import { Rotate_icon, Expand_icon } from 'components/icons'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'
import Cropper from 'react-easy-crop'
import useCrop from 'hooks/useCrop';

const Preview = () => {

    const {
			onCropComplete,
			onMediaLoaded,
			setRotation,
			handleNext,
			handleExpand,
			handleSetFilterApplied,
			handleChangeSlide,
			cropperWidth,
			cropperHeight,
			uploadedImg,
			modeExpand,
            selectedImg
		} = useCrop();

    const [optionFilter, setOptionFilter] = useState(false)
    const [optionEdit, setOptionEdit] = useState(true)
    const filters = ["Normal","1977","Aden","Amaro","Brannan","Brooklyn","Clarendon","Crema","Gingham","Ginza","Helena","Hudson","Inkwell","Kelvin","Lo-Fi","Maven","Moon","Perpetua","Poprocket","Reyes","Skyline","Toaster","Valencia","Walden","Willow","XPro-II"]
    const refContainer= useRef(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })

    return (
        <Fragment>
            <Head>
                <title>Nueva pulicaci&oacute;n</title>
                <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                <meta name="robots" content="noimageindex, noarchive"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            <div className="container" style={{"padding":"0"}}>
                <div className="row">
                    <div className="col-1" style={{"paddingLeft": "10px"}} ><Link href="/home"><a style={{"textDecoration":"none", "color":"black"}}><button style={{"paddingTop":"20px"}} type="button" className="btn-close" aria-label="Close"></button></a></Link></div>
                    <div className="col-8" style={{"textAlign":"center","marginTop":"10px"}}><h6>Nueva Publicaci&oacute;n con {uploadedImg.length> 1?'Fotos':'Foto'}</h6></div>
                    <div className="col-3">
                        <button onClick={handleNext} style={{"textDecoration":"none","fontWeight":"500","paddingRight":"0px"}} className="btn btn-link">Siguiente</button>
                    </div>
                </div>
            </div>
            <div className="container" style={{"padding":"0"}}>
                <div className="row">
                    <div ref={refContainer} className="col-12" style={{"position":"relative", "height":"360px", "borderTop":"1px solid lightgray","borderBottom":"1px solid lightgray","overflow":"hidden"}}>

                        {
                            uploadedImg.length > 1?
                                <Carousel showArrows={true} autoPlay={false}  dynamicHeight={true} emulateTouch={true} onChange={handleChangeSlide} >
                                    {uploadedImg.map(img =>
                                        <div key={img.name} className={`filter-${img.filterApplied.toLowerCase()}`} >
                                            <img src={img.img} />
                                        </div>
                                    )}
                                </Carousel>
                            :uploadedImg.length == 1?
                                <Cropper
                                    image={uploadedImg[0].img}
                                    crop={modeExpand?crop:{x:0,y:0}}
                                    zoom={modeExpand?2:1}
                                    cropSize={{width:cropperWidth,height:cropperHeight}}
                                    aspect={4 / 3}
                                    controls={true}
                                    rotation={uploadedImg[0].rotation}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    showGrid={modeExpand?true:false}
                                    classes={{containerClassName:`filter-${uploadedImg[0].filterApplied.toLowerCase()}`}}
                                    onMediaLoaded={onMediaLoaded}
                                    />
                            :''
                        }

                        {
                            optionEdit && uploadedImg.length == 1?
                            <Fragment>
                                <span onClick={handleExpand} style={{"position":"absolute", "left":"5%","top":"86%","borderRadius":"100%","padding":"6px 6px", "backgroundColor":"rgba(0, 0, 0, 0.5)","color":"white", "display":"flex", "width":"30px","height":"30px"}}><Expand_icon width="18" height="18" /></span>
                                <span onClick={setRotation} style={{"position":"absolute", "right":"5%","top":"86%","borderRadius":"100%","padding":"6px 6px", "backgroundColor":"rgba(0, 0, 0, 0.5)","color":"white", "display":"flex", "width":"30px","height":"30px"}}><Rotate_icon width="18" height="18" /></span>
                            </Fragment>
                            :''
                        }
                    </div>
                </div>
            </div>

            {
                optionFilter?
                    <Filters dataFilters={filters} setFilter={handleSetFilterApplied} filterApplied={uploadedImg[selectedImg].filterApplied} />:''
            }

            <div className="row" style={{"position":"fixed", "bottom":"0","width":"100%"}}>
                <nav className="nav nav-pills nav-justified" >
                    <a onClick={()=>{setOptionFilter(true); setOptionEdit(false)}} style={{"backgroundColor":"white !important","borderRadius":"0"}} className={`flex-sm-fill text-sm-center nav-link ${optionFilter?styles.active:styles.inactive}`} aria-current="page" href="#">Filtro</a>
                    <a onClick={()=>{setOptionEdit(true); setOptionFilter(false)}} style={{"backgroundColor":"white !important","borderRadius":"0"}} className={`flex-sm-fill text-sm-center nav-link ${optionEdit?styles.active:styles.inactive}`} href="#">Editar</a>
                </nav>
            </div>

        </Fragment>
    );
}

//SERVER SIDE RENDERING
export const getServerSideProps = () => {

    return {
        props: {
            page: "preview"
        }
    }
}

export default Preview;
