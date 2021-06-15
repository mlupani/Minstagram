import React, { Fragment, useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import { Arrow_icon, Rotate_icon, Expand_icon, XIcon } from 'components/icons'
import router from 'next/router'
import Loadingbar from 'react-multicolor-loading-bar'
import useUser from 'hooks/useUser'
import Cropper from 'react-easy-crop'
import getCroppedImg from 'components/cropImage'
import { compressingFiles, putStorageItem, updateAvatarUser } from 'firebase/client'
import Filters from 'components/Filters'
import styles from 'styles/Preview.module.css'

const EditAvatar = ({image, setEditAvatarMode, setavatarState, avatarState}) => {

    const user = useUser()
    const [imageURL, setImageUrl] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [cropperWidth, setcropperWidth] = useState(360)
    const [cropperHeight, setcropperHeight] = useState(358)
    const [countRotation, setCountRotation] = useState(0)
    const [optionFilter, setOptionFilter] = useState(false)
    const [optionEdit, setOptionEdit] = useState(true)
    const filters = ["Normal","1977","Aden","Amaro","Brannan","Brooklyn","Clarendon","Crema","Gingham","Ginza","Helena","Hudson","Inkwell","Kelvin","Lo-Fi","Maven","Moon","Perpetua","Poprocket","Reyes","Skyline","Toaster","Valencia","Walden","Willow","XPro-II"]
    const [modeExpand, setModeExpand] = useState(true)
    const [rotate, setRotate] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(0);
    const [filter, setFilter] = useState("normal")

    useEffect(() =>{
        if(image)
        {
            handleImage(image)
        }
    },[image])

    const handleExpand = () => {

        if(!modeExpand)
        {
            setcropperWidth(360)
            setcropperHeight(358)
        }
        else{
            setcropperWidth(width)
            setcropperHeight(height)
        }

        setModeExpand(modeExpand?false:true)
    }

    const onMediaLoaded = ({width, height}) => {
        setWidth(width)
        setHeight(height)
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        if(imageURL){
            setCroppedAreaPixels(croppedAreaPixels)
        }
    }, [imageURL])

    const setRotation = useCallback(() => {
        setCountRotation(countRotation+1)
        setRotate(rotate-90)

        if(!modeExpand){
            setcropperWidth(countRotation%2?width:height)
            setcropperHeight(countRotation%2?height:width)
        }
    })

    const setupReader = async file => {
        return new Promise((resolve, reject) =>{
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(URL.createObjectURL(file))
            }
            reader.onerror = () => {
                reject(reader);
            };
        })
    }

    const handleImage = async (image) => {
        let compressImg
        compressImg = await compressingFiles(image)
        setImageUrl(await setupReader(compressImg))
    }

    const handleNext = useCallback(async (filter) => {
        try {
            setavatarState(true)
            const croppedImage = await getCroppedImg(
                imageURL,
                croppedAreaPixels,
                rotate
            )
            croppedImage.img = croppedImage.base64
            croppedImage.name = "avatar_"+user.userID

            const url = await putStorageItem(croppedImage)
            const filtro = filter.toLowerCase()

            updateAvatarUser(url, user.userID, filtro)
                .then(() => { setEditAvatarMode(false);setavatarState(false); })
                .catch(e => console.log("hubo un error al actualizar el avatar: "+e))

        } catch (e) {
            console.error(e)
        }

    },[croppedAreaPixels, rotate])

    return (
            <Fragment>
                <Head>
                    <title>Subir Foto de Perfil</title>
                    <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                    <meta name="robots" content="noimageindex, noarchive"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                    <meta name="mobile-web-app-capable" content="yes"/>
                </Head>
            <div className="container" style={{"padding":"0"}}>
                <div className="row" style={{"borderBottom":"1px solid gainsboro"}}>
                    <div onClick={() => router.back()} className="col-1" style={{"paddingLeft": "10px","paddingTop":"5px"}} ><a style={{"textDecoration":"none", "color":"black"}}><XIcon/></a></div>
                    <div className="col-8" style={{"textAlign":"center","marginTop":"7px","paddingRight":"0px !important"}} ><h6>{!avatarState?'Subir foto de Perfil':'Procesando imagen'}</h6></div>
                    <div className="col-3">
                        <button onClick={()=>handleNext(filter)} style={{"textDecoration":"none","fontWeight":"500","paddingRight":"0px"}} className="btn btn-link">Guardar</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{"position":"relative", "height":"360px", "borderTop":"1px solid lightgray","borderBottom":"1px solid lightgray","overflow":"hidden"}}>
                        {
                            imageURL?
                                <Cropper
                                    image={imageURL}
                                    crop={modeExpand?crop:{x:0,y:0}}
                                    zoom={modeExpand?2:1}
                                    cropSize={{width:cropperWidth,height:cropperHeight}}
                                    aspect={4 / 3}
                                    controls={true}
                                    rotation={rotate}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    showGrid={modeExpand?true:false}
                                    classes={{containerClassName:`filter-${filter.toLowerCase()}`}}
                                    onMediaLoaded={onMediaLoaded}
                                    cropShape={"round"}
                                    />:'Loading...'
                        }

                        {
                            optionEdit && image?
                            <Fragment>
                                <span onClick={handleExpand} style={{"position":"absolute", "left":"5%","top":"86%","borderRadius":"100%","padding":"6px 6px", "backgroundColor":"rgba(0, 0, 0, 0.5)","color":"white", "display":"flex","borderRadius":"100%", "width":"30px","height":"30px"}}><Expand_icon width="18" height="18" /></span>
                                <span onClick={setRotation} style={{"position":"absolute", "right":"5%","top":"86%","borderRadius":"100%","padding":"6px 6px", "backgroundColor":"rgba(0, 0, 0, 0.5)","color":"white", "display":"flex","borderRadius":"100%", "width":"30px","height":"30px"}}><Rotate_icon width="18" height="18" /></span>
                            </Fragment>
                            :''
                        }
                    </div>
                </div>
            </div>
            {
                optionFilter?
                    <Filters dataFilters={filters} setFilter={setFilter} filterApplied={filter} />:''
            }

            <div className="row" style={{"bottom":"0","width":"100%","position":"fixed"}}>
                <nav className="nav nav-pills nav-justified" >
                    <a onClick={()=>{setOptionFilter(true); setOptionEdit(false)}} style={{"backgroundColor":"white !important","borderRadius":"0"}} className={`flex-sm-fill text-sm-center nav-link ${optionFilter?styles.active:styles.inactive}`} aria-current="page" href="#">Filtro</a>
                    <a onClick={()=>{setOptionEdit(true); setOptionFilter(false)}} style={{"backgroundColor":"white !important","borderRadius":"0"}} className={`flex-sm-fill text-sm-center nav-link ${optionEdit?styles.active:styles.inactive}`} href="#">Editar</a>
                </nav>
            </div>

        </Fragment>

    );
}

export default EditAvatar;
