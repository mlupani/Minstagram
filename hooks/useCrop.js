import { useCallback, useEffect, useState } from "react";
import getCroppedImg from "components/cropImage";
import router from "next/router";

const useCrop = () => {

    const [modeExpand, setModeExpand] = useState(true);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [cropperWidth, setcropperWidth] = useState(360);
    const [cropperHeight, setcropperHeight] = useState(358);
    const [countRotation, setCountRotation] = useState(0);
    const [uploadedImg, setUploadedImg] = useState([]);
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() =>{
        if(localStorage.getItem("filesSelected")){
            const files = JSON.parse(localStorage.getItem("filesSelected"))
            const imagenes = files.map(img => { return {img: img.baseurl, name:img.name, rotation:img.rotation, type:img.type, base64:img.base64, filterApplied:'normal'}})
            setUploadedImg(imagenes)
        }
        else
            setUploadedImg(1);
    },[])

     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        if(uploadedImg.length){
            const imagenes = uploadedImg.map((img,index) => { if(index == selectedImg){ img.croppedAreaPixels = croppedAreaPixels; return img} else {return img;} })
            setUploadedImg(imagenes)
        }
    }, [uploadedImg])

    const onMediaLoaded = ({width, height}) => {
        setWidth(width)
        setHeight(height)
    }

    const setRotation = useCallback(() => {
        setCountRotation(countRotation+1)
        const imagenes = uploadedImg.map((img,index) => { if(index == selectedImg){ img.rotation = img.rotation-90; return img} else {return img;} })
        setUploadedImg(imagenes)

        if(!modeExpand){
            setcropperWidth(countRotation%2?width:height)
            setcropperHeight(countRotation%2?height:width)
        }
    })

    const handleNext = useCallback(async () => {

        try {
            const croppedImage = await getCroppedImg(
                uploadedImg[0].img,
                uploadedImg[0].croppedAreaPixels,
                uploadedImg[0].rotation
            )
            const imagenes = uploadedImg.map((img,index) => { if(index == selectedImg){ img.base64 = croppedImage.base64, img.img = croppedImage.baseurl;img.baseurl = croppedImage.baseurl; return img} else {return img;} })
            localStorage.setItem("imgUpload",JSON.stringify(imagenes))
            router.push('/new')
        } catch (e) {
            console.error(e)
        }

    })

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

    const handleSetFilterApplied = e => {
        const imagenes = uploadedImg.map((img,index) => { if(index == selectedImg){ img.filterApplied = e.toLowerCase(); return img} else {return img;} })
        setUploadedImg(imagenes)
    }

    const handleChangeSlide = (index) => {
        setSelectedImg(index)
    }

    return {
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
    }
}

export default useCrop
