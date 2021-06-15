import { useState, useEffect, useRef } from 'react'
import { sendVerificationToSignUp, loginWithFacebook, getUserInCollectionFirebaseID, updateConnectFirebaseID } from 'firebase/client.js'
import styles from 'styles/Login.module.css'
import { Facebook_icon } from 'components/icons'
import FormRegisterFacebook from 'components/FormRegisterFacebook'

const FormSignUp = () => {

    const refPass = useRef(null)
    const refPassconfirm = useRef(null)
    const [mail, setMail] = useState('')
    const [pass, setPass] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState(null)
    const [username, setUsername] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [passConfirm, setPassConfirm] = useState('')
    const [optionEmail, setOptionEmail] = useState(true)
    const [optionPhone, setOptionPhone] = useState(false)
    const [verificationSended, setVerificationSended] = useState('')
    const [registerWithFacebook, setRegisterWithFacebook] = useState('')

    const handleClick = async () => {
        await loginWithFacebook().then(async logged => {
            if(logged){
                const resID = await getUserInCollectionFirebaseID(logged.user.uid)
                if(resID.length)
                    updateConnectFirebaseID(logged.user.uid, true)
                else
                    setRegisterWithFacebook(logged)
            }
            else
                console.log("Error al loguear")
        })
    }

    useEffect(() => {
        setVerificationSended('')
    },[username,mail, pass, passConfirm])

    const handleSubmitPhone = e => {
        e.preventDefault()
        setPhoneError(false)
        if(!phone || phone.length < 3)
        setPhoneError("Ingrese un telefono válido")
    }

    const handlePasswords = () => {
        if(refPass.current.value != refPassconfirm.current.value)
        setError('Las contraseñas no coinciden')
        else setError(null)
    }

    const handleSubmit = async e => {

        e.preventDefault()

        if(!mail || !pass || !passConfirm) {
        setError('Deben completarse todos los campos');
        return false;
        }

        if(pass != passConfirm) return false
        else setError(null)

        sendVerificationToSignUp(mail,pass,username,setVerificationSended,setError)
    }

    if(registerWithFacebook)
        return (
            <FormRegisterFacebook registerWithFacebook={registerWithFacebook} />
        )
    else
        return (
            <div className='card-body' >
                <div className="row" style={{"width":"100%","marginBottom":"10px"}}>
                    <nav className="nav nav-pills nav-justified" >
                        <a onClick={()=>{setOptionPhone(true); setOptionEmail(false)}} style={{"backgroundColor":"white !important","borderRadius":"0"}} className={`flex-sm-fill text-sm-center nav-link ${optionPhone?styles.active:styles.inactive}`} aria-current="page" href="#">TELEFONO</a>
                        <a onClick={()=>{setOptionEmail(true); setOptionPhone(false)}} style={{"backgroundColor":"white !important","borderRadius":"0"}} className={`flex-sm-fill text-sm-center nav-link ${optionEmail?styles.active:styles.inactive}`} href="#">EMAIL</a>
                    </nav>
                </div>
                {
                optionEmail?
                <form onSubmit={handleSubmit}>
                    <div className="row" style={{"textAlign":"center","fontSize":"13px","fontWeight":"600"}}>
                    {error && <p className="text-danger">{error}</p>}
                    {verificationSended && <p className="text-success">{verificationSended}</p>}
                    </div>
                    <div className="mb-3">
                    <input type="text" style={{"fontSize":"13px"}} onChange={(e)=>setUsername(e.target.value)} value={username} className="form-control"  placeholder="Nombre de usuario"/>
                    </div>
                    <div className="mb-3">
                    <input type="email" style={{"fontSize":"13px"}} onChange={(e)=>setMail(e.target.value)} value={mail} className="form-control" placeholder="Correo Electronico"/>
                    </div>
                    <div className="mb-3">
                    <input type="password" style={{"fontSize":"13px"}} ref={refPass} onBlur={handlePasswords} onChange={(e)=>setPass(e.target.value)} value={pass} className="form-control" placeholder="Contraseña"/>
                    </div>
                    <div className="mb-3">
                    <input type="password" style={{"fontSize":"13px"}} ref={refPassconfirm} onKeyUp={handlePasswords} onChange={(e)=>setPassConfirm(e.target.value)} value={passConfirm} className="form-control"  placeholder="Repetir Contraseña"/>
                    </div>
                    <button type="submit" style={{"fontSize":"13px"}} disabled={!username || !mail || !pass || !passConfirm?true:false} className="btn btn-primary">Registrarme</button>
                </form>:
                <form onSubmit={handleSubmitPhone}>
                    <div className="row" style={{"textAlign":"center","fontSize":"13px","fontWeight":"600"}}>
                    {phoneError && <p className="text-danger">{phoneError}</p>}
                    </div>
                    <div className="mb-3">
                    <input type="text" style={{"fontSize":"13px"}} onChange={(e)=>setPhone(e.target.value)} value={phone} className="form-control"  placeholder="Telefono"/>
                    </div>
                    <button type="submit" style={{"fontSize":"13px"}} className="btn btn-primary">Registrarme</button>
                </form>
                }
                <br></br>
                <div className="row">
                    <button style={{"color":"white"}}  onClick={handleClick} className="btn btn-info btn-sm"><Facebook_icon/>&nbsp;&nbsp;Registrar con Facebook</button>
                </div>
            </div>
        );
    }

export default FormSignUp;
