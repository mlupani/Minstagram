import { useEffect, useState, Fragment, useRef } from 'react'
import { updateUser, updateAvatarUser, handleInputFileAvatar, generateKeyWords, desvinculateFacebook, vinculateFacebook, updateProvidersUser } from 'firebase/client'
import Head from 'next/head'
import useUser from 'hooks/useUser'
import router from 'next/router'
import styles from 'styles/editUser.module.css'
import { Arrow_icon } from 'components/icons'
import FormEditUser from 'components/FormEditUser'
import ModalWindow from 'components/ModalWindow'
import Loadingbar from 'react-multicolor-loading-bar'
import EditAvatar from 'components/EditAvatar'

const EditUser = () => {

    const user = useUser()
    const inputFile = useRef(null)
    const [saved, setSaved] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [privacy, setprivacy] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [userName, setUserName]       = useState('')
    const [email, setEmail]             = useState('')
    const [phone, setPhone]             = useState('')
    const [avatarState, setavatarState] = useState('')
    const [initprivacy, setinitprivacy] = useState('')
    const [showActivity, setShowActivity] = useState('')
    const [modalShow, setModalShow]     = useState(false)
    const [stateSend, setStateSend ]    = useState('disabled')
    const [initshowActivity, setinitShowActivity] = useState('')
    const [editAvatarMode, setEditAvatarMode] = useState(false)
    const [targetFiles, setTargetFiles] = useState('')
    const recaptchaRef = useRef()
    const [loadingFacebookLink, setLoadingFacebookLink] = useState('')
    const [providers, setProviders] = useState([])

    useEffect(() => {
        if(user)
        {
            setDisplayName(user.displayName)
            setUserName(user.userName)
            setEmail(user.email)
            setPhone(user.phone)
            setprivacy(user.private)
            setShowActivity(user.showActivity)
            setProviders(user.providers)

            setinitprivacy(user.private)
            setinitShowActivity(user.showActivity)

        }
    },[user])

    useEffect(() => {
        if(user)
            setStateSend('')

    },[displayName, userName, email, phone, privacy, showActivity])

    const handleDelImg = () => {

        const img = "https://www.seekpng.com/png/full/245-2454602_tanni-chand-default-user-image-png.png"
        setavatarState(1)
        updateAvatarUser(img, user.userID, 'normal').then(() => {
            setStateSend('disabled')
            setModalShow(false)
            setavatarState('')
        }).catch((error) => {
            // The document probably doesn't exist.
            console.error("Error al actualizar el avatar: ", error)
        })

    }

    useEffect(() => {

        if(user){
            if(initprivacy != privacy || initshowActivity != showActivity) handleSubmit()
        }

    }, [privacy, showActivity])

    const handleSubmit = (e) => {

        setStateSend('disabled')
        if(e)
            e.preventDefault()

        let keyword = generateKeyWords(displayName+userName)

        const data = {
            id: user.userID,
            displayName,
            userName,
            email,
            phone,
            keyword,
            privacy,
            showActivity,
            recaptchaRef,
            oldPhone: user.phone
        }

        updateUser(data).then(() => {

            setMensaje("Se guardo la configuración")
            setSaved(true)
            setStateSend('')
        }).catch((error) => {
            console.log(error)
            setMensaje(error)
            setSaved(true)
            setStateSend('')
        })

        setTimeout(() => setSaved(false), 5000)
    }

    const handleClickFile = e => {
        e.preventDefault(),
        inputFile.current.click()
    }

    const handleUploadAvatar = e => {
        //handleInputFileAvatar(e,"/accounts/edit/",inputFile, user, setModalShow, setavatarState)
        setEditAvatarMode(true)
        setModalShow(false)
        setTargetFiles(e.target.files[0])
    }

    const handleFacebook = (e, type) => {

        e.preventDefault();

        if(type == "vincular"){
            setLoadingFacebookLink('Vinculando...')
            vinculateFacebook(user.userID).then(() =>{
                updateProvidersUser(user.userID, 'facebook.com', 'vincular')
                setLoadingFacebookLink('Vinculado')
            })

        }

        if(type == "desvincular"){
            setLoadingFacebookLink('Desvinculando...')
            desvinculateFacebook(setLoadingFacebookLink, user.userID).then(() =>{
                updateProvidersUser(user.userID, 'facebook.com', 'desvincular')
                setLoadingFacebookLink('Desvinculado')
            })
        }

    }

    if(editAvatarMode)
        return (
            <Fragment>
                {avatarState? <Loadingbar colors={["#dc3545", "#25C5EC", "#E3F10C", "#21F10C"]} height={5} cycleDurationInMs={200} positionAtTop={true}></Loadingbar>:''}
                <EditAvatar image={targetFiles} setEditAvatarMode={setEditAvatarMode} avatarState={avatarState} setavatarState={setavatarState} />
            </Fragment>
        )
    else
        return (
            <Fragment>
                <Head>
                    <title>Editar Perfil</title>
                    <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                    <meta name="robots" content="noimageindex, noarchive"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                    <meta name="mobile-web-app-capable" content="yes"/>
                </Head>
                {user?
                    <Fragment>
                        <div className="container" style={{"padding":"0"}}>
                            {
                                !avatarState?
                                <div className="row" style={{"borderBottom":"1px solid gainsboro"}}>
                                    <div onClick={() => router.push('/user/[id]', `/user/${user?.userID}`)} className="col-1" style={{"paddingLeft": "20px","paddingTop":"5px"}} ><a style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a></div>
                                    <div className="col-10" style={{"textAlign":"center","marginTop":"7px","paddingRight":"0px !important"}} ><h6>Editar Perfil</h6></div>
                                </div>:
                                <Loadingbar
                                    colors={["#dc3545", "#25C5EC", "#E3F10C", "#21F10C"]}
                                    height={5}
                                    cycleDurationInMs={200}
                                    positionAtTop={true}>
                                </Loadingbar>
                            }
                        </div>
                        <div ref={recaptchaRef}></div>
                        <div className="row" style={{"marginTop":"10px"}}>
                                <div className={`col-2`} style={{"paddingLeft": "20px","paddingTop":"12px","cursor":"pointer"}} onClick={()=>{setModalShow(true)}} ><img className={`${styles.avatar} filter-${user.filter}`} alt={user?user.avatar:''} src={user?user.avatar:''}></img></div>
                                <div className="col-9" style={{"paddingLeft": "15px","paddingTop":"5px"}} >
                                    <p style={{"fontSize":"17px","marginBottom":"0px"}} >{userName}</p>
                                    <button onClick={()=>{setModalShow(true)}} className="btn btn-link" style={{"fontSize":"14px","marginBottom":"5px","padding":"0","textDecoration":"none","fontWeight":"700","color":"#0095f6"}} >Editar foto de perfil</button>
                                </div>
                        </div>
                        <FormEditUser handleSubmit={handleSubmit} setDisplayName={setDisplayName} setUserName={setUserName} setEmail={setEmail} setPhone={setPhone} 
                        email={email} displayName={displayName} userName={userName} phone={phone} stateSend={stateSend} privacy={privacy} showActivity={showActivity} setprivacy={setprivacy} setShowActivity={setShowActivity} saved={saved} providers={providers} handleFacebook={handleFacebook} loadingFacebookLink={loadingFacebookLink}  />
                        <div className={`${!saved?`${styles.alertHidden}`:`${styles.alertShown}`}`} style={{"position": "fixed","bottom": "0", "width": "100%", "color": "white","fontSize": "14px","padding": "10px", "backgroundColor": "black"}} >
                            {mensaje}
                        </div>
                        <ModalWindow show={modalShow}>
                                <div className={avatarState?"row d-none":"row"}>
                                    <div className="col-12">
                                        <ul className="list-group lista_modal" style={{"padding":"0px","margin":"0px","borderRadius":"1rem !important"}}>
                                            <li className="list-group-item" style={{"padding":"22px","fontSize":"18px","fontWeight":"500"}} ><p>Cambiar Foto de Perfil</p></li>
                                            {<li style={{"color":"#0095f6", "fontWeight":"700","fontSize":"14px"}} onClick={handleClickFile} className="list-group-item">Subir Foto</li>}
                                            {<li onClick={(e)=>handleDelImg(e)} style={{"color":"red", "fontWeight":"700","fontSize":"14px"}} className="list-group-item">Eliminar Foto Actual</li>}
                                            <li  onClick={()=>setModalShow(false)}  style={{"fontSize":"14px"}} className="list-group-item">Cancelar</li>
                                        </ul>
                                    </div>
                                </div>
                        </ModalWindow>
                        <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={(e) => handleUploadAvatar(e)}/>
                    </Fragment>
                    :''
                }
            </Fragment>
        )
}

export default EditUser
