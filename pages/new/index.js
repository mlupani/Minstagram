import "react-responsive-carousel/lib/styles/carousel.min.css"
import Head from 'next/head'
import { useEffect, useState, Fragment, useRef } from 'react'
import { addPost, handleInputFile } from 'firebase/client.js'
import styles from 'styles/New.module.css'
import { Arrow_icon } from 'components/icons'
import router from 'next/router'
import useUser from 'hooks/useUser'
import Loadingbar from 'react-multicolor-loading-bar'
import { Carousel } from 'react-responsive-carousel'

const New = () => {

    const user = useUser()
    const [uploadedImg, setUploadedImg] = useState(null)
    const [message, setMessage] = useState('')
    const [statePost, setStatePost] = useState('')
    const [selectedPlace, setSelectedPlace] = useState('');
    const [placeLoaded, setPlaceLoaded] = useState(null);
    const [focusTextArea, setfocusTextArea] = useState(false)
    const textareaRef = useRef()
    const [filter, setFilter] = useState('')

    useEffect(() =>{


        if(localStorage.getItem("imgUpload")){
            const imgs = JSON.parse(localStorage.getItem("imgUpload"))
            setUploadedImg(imgs)
        }
        else
            setUploadedImg(1);

        if(localStorage.getItem("placeSelected") && !placeLoaded){
            setSelectedPlace(localStorage.getItem("placeSelected"))
            setPlaceLoaded(1)
        }

        if(textareaRef && textareaRef.current){
            textareaRef.current.addEventListener("focus",() => setfocusTextArea(true), false)
            textareaRef.current.addEventListener("blur",() => setfocusTextArea(false), false)
        }

        if(localStorage.getItem("imgFilter"))
            setFilter(localStorage.getItem("imgFilter"))

        return () => {
            textareaRef && textareaRef.current && textareaRef.current.removeEventListener("focus", setfocusTextArea(false), false);
        }

    },[])

    const handleSubmit = async e => {

        setStatePost(1)
        const arrayImgs = await handleInputFile(uploadedImg)

        addPost({
            avatar: user.avatar,
            content: message,
            img: arrayImgs,
            userID: user.userID,
            userName: user.userName,
            place: selectedPlace,
        }).then(() => {
            localStorage.removeItem("placeSelected");
            router.push("home")
        })
    }

    const handleRemovePlace = e => {
        localStorage.removeItem("placeSelected");
        setSelectedPlace('')
    }

    if(uploadedImg == 1) router.push("/home")

    return (
        <Fragment>
        <Head>
            <title>Crear Post / Minstagram</title>
            <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
            <meta name="robots" content="noimageindex, noarchive"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
            <meta name="mobile-web-app-capable" content="yes"/>
        </Head>
        <div className="container" style={{"padding":"0"}}>
            {statePost != 1?
                <div className="row">
                    <div className="col-1" style={{"paddingLeft": "10px"}} ><a onClick={() => router.back()} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a></div>
                    <div className="col-8" style={{"textAlign":"center","marginTop":"10px"}}><h6>Nueva Publicacion</h6></div>
                    <div className="col-2">
                        <button style={{"textDecoration":"none","fontWeight":"500"}} onClick={handleSubmit} className="btn btn-link">Compartir</button>
                    </div>
                </div>:
                <div className="row">
                <Loadingbar
                    colors={["#dc3545", "#25C5EC", "#E3F10C", "#21F10C"]}
                    height={5}
                    cycleDurationInMs={200}
                    positionAtTop={true}>
                </Loadingbar>
                </div>
            }
            <div className="row" style={{"marginTop":"10px","borderTop": "1px solid lightgray"}}>
                <div className="col-1" ><img className={`${styles.avatar}`} alt={user?.avatar} src={user?.avatar}></img></div>
                <div className="col-9">
                    {
                        statePost == 1? <textarea disabled value={message} className="form-control" rows="3"></textarea>:
                        <textarea ref={textareaRef} onChange={e => setMessage(e.target.value)} style={{"fontSize":"13px", "border":"0", "outline":"none", "textDecoration":"none","boxShadow": "none","resize":"none"}} className="form-control" placeholder="Escribe un pie de foto o video..."  rows="3"></textarea>
                    }
                </div>
                <div style={{"marginTop":"10px"}} className="col-1">{uploadedImg == null || uploadedImg == 1? <img width="35" height="35" src='loading.gif'></img>
                :
                uploadedImg?.length > 1?
                    <Carousel autoPlay={true}  emulateTouch={true} renderIndicator={false} infiniteLoop={true} dynamicHeight={true} showThumbs={false} showIndicators={false} showStatus={false} width={48}>
                        {uploadedImg.map(img =>
                            <div className={`filter-${uploadedImg[0].filterApplied.toLowerCase()}`} key={img.img} >
                                <img width="48" height="48" src={img.img} />
                            </div>
                        )}
                    </Carousel>:
                    <figure className={`filter-${uploadedImg[0].filterApplied.toLowerCase()}`}><img width="48" height="48" src={uploadedImg[0].img}></img></figure>}</div>
            </div>
            {focusTextArea?
                <div style={{"backgroundColor":"black","height":"510px","opacity":"0.5","position":"fixed", "bottom":"0", "left":"0", "right":"0"}}></div>
                :''
            }
            <div className="row">
                <div className="col-12"><br></br>
                    {
                        !selectedPlace ? <button onClick={()=>router.push("/ubicacion")} type="button" className="btn btn-light" style={{"textAlign":"left", "width":"100%","border":"1px solid lightgrey", "fontSize":"11px"}}>Agregar ubicaci&oacute;n <span style={{"float":"right"}}>&gt;</span></button>:
                        (
                        <div className="col-12">
                            <div style={{"border":"1px solid lightgrey"}} className="gap-2 d-md-block"><button style={{"textAlign":"right","float":"right","paddingBottom":"15px"}} type="button"
                            onClick={handleRemovePlace} className="btn-close" aria-label="Close"></button><button className="btn btn-light" style={{"textAlign":"left", "fontSize":"11px"}} type="button">{selectedPlace}</button></div>
                        </div>
                        )
                    }
                </div>
            </div>
        </div>
        </Fragment>
    );
}

export default New;
