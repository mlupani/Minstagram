import React, { useState, useEffect, Fragment } from 'react';
import { addUserToCollection, updateConnectFirebaseID, generateKeyWords } from 'firebase/client'
import { Arrow_icon } from 'components/icons'

const FormRegisterPhone = ({registerWithPhone}) => {

    let [userLogin, setUserLogin] = useState('')
    const [passLogin, setPassLogin] = useState('')
    const [phone, setPhone] = useState()
    const [uid, setUid] = useState()

    useEffect(() => {
        setPhone(registerWithPhone.phoneNumber)
        setUid(registerWithPhone.uid)
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
        addUserToCollection(uid, userLogin, userLogin, '', '', phone, keyword ).then(() =>{
            updateConnectFirebaseID(uid)
        })
    }

    return (
        <div className='card-body' style={{"marginTop":"30px"}}>
            <div className="row">
                <div className="col-12">
                    <input type="text" id="user" autoComplete="off" value={userLogin} onChange={handleChangeInput} style={{"fontSize":"13px"}} className="form-control" placeholder="Usuario"/>
                </div>
                <div className="col-12">
                    <input type="password" id="pass" autoComplete="off" value={passLogin} onChange={handleChangeInput} style={{"fontSize":"13px"}} className="form-control" placeholder="Contraseña"/>
                </div>
                <div className="col-12">
                    <br></br>
                    <button style={{"color":"white"}} onClick={handleSubmit} className="btn btn-sm btn-info">Registrarme</button>
                </div>
            </div>
        </div>
    );
}

export default FormRegisterPhone;
