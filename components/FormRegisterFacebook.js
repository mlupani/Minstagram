import React, { useState, useEffect, Fragment } from 'react';
import { addUserToCollection, updateConnectFirebaseID, generateKeyWords, deleteUser } from 'firebase/client'
import styles from 'styles/User.module.css'
import { Arrow_icon } from 'components/icons'

const FormRegisterFacebook = ({registerWithFacebook, setRegisterWithFacebook, setIsLoading}) => {

    let [userLogin, setUserLogin] = useState('')
    const [passLogin, setPassLogin] = useState('')
    const [email, setEmail] = useState('')
    const [uid, setUid] = useState('')
    const [name, setName] = useState('')
    const [picture, setPicture] = useState('')

    useEffect(() => {

        let email = ''
        if(registerWithFacebook.user.providerData[0].email)
            email = registerWithFacebook.user.providerData[0].email
        else
            email = registerWithFacebook.additionalUserInfo.profile.email

        setEmail(email)
        setName(registerWithFacebook.additionalUserInfo.profile.name)
        setUid(registerWithFacebook.user.uid)
        setPicture(registerWithFacebook.additionalUserInfo.profile.picture.data.url)
    },[])

    const handleChangeInput = e => {
        if(e.target.id == "user"){
            setUserLogin(e.target.value)
        }

        if(e.target.id == "pass")
        setPassLogin(e.target.value)
    }

    const handleSubmit = () => {
        const keyword = generateKeyWords(userLogin)
        addUserToCollection(uid, name, userLogin, picture, email, '', keyword ).then(() =>{
            updateConnectFirebaseID(uid)
        })
    }

    const handleBack = (e) => {
        e.preventDefault();
        setIsLoading(false);
        setRegisterWithFacebook(false)
        deleteUser()
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-1" style={{"paddingLeft": "20px", "cursor":"pointer"}} >
                <a href='#' onClick={handleBack} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a>
                </div>
            </div>
            <div className='card-body'>
                <div className="row">
                    <div className="col-12">
                        <p className="text-muted" style={{"fontSize":"13px"}}>Ingrese un usuario y contraseña para continuar</p>
                    </div>
                    {
                        picture &&
                            <div className="col-12">
                                <img width="80" height="80" className={`${styles.avatar}`} alt={picture} src={picture}></img>
                            </div>
                    }
                    <div className="col-12" style={{marginBottom: '15px'}}>
                        <br></br>
                        <input type="text" id="usuario" autoComplete="off" value={userLogin} onChange={handleChangeInput} style={{"fontSize":"13px"}} className="form-control" placeholder="Usuario"/>
                    </div>
                    <div className="col-12">
                        <input type="password" id="contrasena" autoComplete="off" value={passLogin} onChange={handleChangeInput} style={{"fontSize":"13px"}} className="form-control" placeholder="Contraseña"/>
                    </div>
                    <div className="col-12">
                        <br></br>
                        <button style={{"color":"white"}} onClick={handleSubmit} className="btn btn-sm btn-info">Registrarme</button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default FormRegisterFacebook;
