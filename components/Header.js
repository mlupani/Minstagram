import { useRef, useState, Fragment, useEffect } from 'react'
import { IMAGEUPLOADSTATES, handleInputFile, countNewMessages } from 'firebase/client'
import styles from 'styles/Header.module.css'
import { Msg_icon, Cam_icon } from 'components/icons'
import Loadingbar from 'react-multicolor-loading-bar'
import Link from 'next/link'
import useUser from 'hooks/useUser'


const header = () => {

    const inputFile = useRef(null)
    const [imageUpdaloadState, setimageUploadState] = useState(null)
    const user = useUser()
    const [countMessages, setCountMessages] = useState(0)

    const handleClickFile = e => {
        e.preventDefault();
        inputFile.current.click();
    }

    useEffect(() => {

        setCountMessages(0)
        if(user){
            let unsubscribe
            unsubscribe = countNewMessages(user.chats, user.userID, setCountMessages)

            return () => unsubscribe && unsubscribe()
        }

    },[user])

    return (
        <Fragment>
            <div className={`row ${imageUpdaloadState != IMAGEUPLOADSTATES.ONPROGRESS?'d-none':''} `}>
                <Loadingbar style={{"position":"relative"}}
                    colors={["#dc3545", "#25C5EC", "#E3F10C", "#21F10C"]}
                    height={5}
                    cycleDurationInMs={200}>
                </Loadingbar>
            </div>
            <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbar} ${imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS?'d-none':''}`} >
                <div className={`container-fluid ${styles.container}`} >
                    <a className="nav-link" onClick={handleClickFile} style={{"color":"black"}} href="#"><Cam_icon/></a>
                    <a className="navbar-brand" href="#">Minstagram</a>
                    <Link href={"/inbox/"}><a className="nav-link" style={{"color":"black"}} href="#"><Msg_icon/>{<span style={{'display':`${countMessages?'inline':'none'}`}} className={`${styles.alertMessage}`} >{countMessages}</span>}</a></Link>
                </div>
                <input type='file' multiple accept="image/png, image/jpeg, video/mp4" id='file' ref={inputFile} style={{display: 'none'}} onChange={(e) => handleInputFile(e,setimageUploadState,"new",inputFile)}/>
            </nav>
        </Fragment>
    )
}

export default header;
