import { useState, useEffect, useRef } from 'react'
import { loginWithFacebook, getUserInCollection, addUserToCollection, generateKeyWords, signInWithEmail, updateConnectFirebaseID, getUserInCollectionByUsername, phoneRecapchaVerifier,sendPhoneCode, phoneSign, getUserInCollectionFirebaseID } from 'firebase/client.js'
import { Facebook_icon } from 'components/icons'
import ModalWindow from 'components/ModalWindow'
import FormRegisterPhone from 'components/FormRegisterPhone'
import FormRegisterFacebook from 'components/FormRegisterFacebook'

const FormLogin = ({setUsuarioLogin, setSignup, errorLogin, setErrorLogin, setForgotPassword}) => {

    let [userLogin, setUserLogin] = useState('')
    const [passLogin, setPassLogin] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const divContainer = useRef()
    const [showModalCode, setShowModalCode] = useState(false)
    const [digitsCode, setDigitsCode] = useState([])
    const references = useRef(new Array())
    const [sendCode, setSendCode] = useState(0)
    const [sendingCode, setSendingCode] = useState(0)
    const buttonCode = useRef()
    const [errorSMS, seterrorSMS] = useState(null)
    const [isPhone, setIsPhone] = useState(false)
    const [user, setUser] = useState(null)
    const [registerWithPhone, setRegisterWithPhone] = useState('')
    const [registerWithFacebook, setRegisterWithFacebook] = useState('')

    const handleClick = async () => {
        await loginWithFacebook().then(async logged => {
        if(logged){
            console.log(logged)
            const resID = await getUserInCollectionFirebaseID(logged.user.uid)
            if(resID.length)
            {
                updateConnectFirebaseID(logged.user.uid, true)
                setIsLoading(false)
            }
            else
                setRegisterWithFacebook(logged)
        }
        else{
            console.log("Error al loguear")
        }
        })
    }

    const isPhoneNumber = (phone) => {

        let res = false
        if(phone.replace(" ","").length == 10)
            if(phone.substring(0,2) == "11" || phone.substring(0,2) == "15")
                res = true

        return res
    }

    useEffect(() => {
        if(isPhoneNumber(userLogin))
            setIsPhone(true)
        else
            setIsPhone(false)
    }, [userLogin])

    useEffect(() => {
        if(showModalCode){
            let options = []
            for(let i = 0 ; i<6 ; i++){
                if(i==0)
                    options.push(<input type="text" autoFocus autoComplete="off" onChange={() => handleChange(i)} ref={(element) => references.current[i] = element} key={i} maxLength="1" className="form-control" style={{"height":"40px","textAlign":"center", "fontSize":"18px", "fontWeight":"700","padding":"0px","marginTop":"20px","marginBottom":"20px"}} />)
                else
                    options.push(<input type="text" autoComplete="off" onChange={() => handleChange(i)} ref={(element) => references.current[i] = element} key={i} maxLength="1" className="form-control" style={{"height":"40px","textAlign":"center", "fontSize":"18px", "fontWeight":"700","padding":"0px","marginTop":"20px","marginBottom":"20px"}} />)
            }
            setDigitsCode(options)
        }

    },[showModalCode])

    const handleChange = (index) => {

        if(index == 5){
            if(references.current[0].value && references.current[1].value && references.current[2].value && references.current[3].value && references.current[4].value && references.current[5].value){
                let code = references.current.map(element => element.value)
                code = code.join('')
                buttonCode.current.disabled = true
                seterrorSMS(null)
                phoneSign(code, seterrorSMS).then(async (logged) => {
                    const resID = await getUserInCollectionFirebaseID(logged.uid)
                    if(resID.length)
                    {
                        updateConnectFirebaseID(logged.uid, true)
                        setIsLoading(false)
                    }
                    else
                        setRegisterWithPhone(logged)


                }).catch(err => {
                    console.log(err)
                })
            }
        }

        if(references.current[index].value){
            references.current[index].blur()

            if(index < 5)
                references.current[index+1].focus()
        }
    }

    const handleSignIn = async () => {
        if((userLogin && passLogin && passLogin.length > 5) || isPhone){
            setIsLoading(true)

            //NO ES UN EMAIL
            if(userLogin.search("@") == -1){

                 //CHEQUEO SI ES UN NUMERO DE TELEFONO SINO ES UN USERNAME
                if(isPhoneNumber(userLogin)){
                    setIsLoading(true)
                    userLogin = "+54"+userLogin.substring(0,2).replace("11","15")+userLogin.substring(2,10)
                    sendPhoneCode(userLogin, setShowModalCode, setSendingCode, divContainer.current)

                    return false
                }
                else{
                    const res = await getUserInCollectionByUsername(userLogin)
                    if(res.length) userLogin = res[0]
                    else userLogin = 'a'
                }
            }

            signInWithEmail(userLogin, passLogin, setErrorLogin)
            .then(uid => {
                if(uid)
                    updateConnectFirebaseID(uid, true)
                else
                    setIsLoading(false)
            })
        }


    }

    const handleChangeInput = e => {
        if(e.target.id == "user"){
            setUserLogin(e.target.value)
        }

        if(e.target.id == "pass")
        setPassLogin(e.target.value)
    }

    useEffect(() => {
        if(isLoading)
            setErrorLogin('')
    }, [isLoading])

    useEffect(() => {
        if(sendCode)
            setTimeout(() => {
                setSendCode(prevState => parseInt(prevState -1))
            },1000)
        else
            setSendingCode(0)
    },[sendCode])

    useEffect(() => {
        if(showModalCode)
            setSendCode(parseInt(30))
    },[showModalCode])

    const handleSendCode = () => {
        //setSendingCode(1)
        for(let i = 0 ; i<6 ; i++)
            references.current[i].value = ''

        references.current[0].focus()
        seterrorSMS(null)

        userLogin = "+54"+userLogin.substring(0,2).replace("11","15")+userLogin.substring(2,10)
        sendPhoneCode(userLogin, setShowModalCode, setSendingCode, divContainer.current)
        setSendCode(parseInt(30))
    }

    if(registerWithPhone.uid)
        return (
            <FormRegisterPhone registerWithPhone={registerWithPhone} setRegisterWithPhone={setRegisterWithPhone} />
        )
    else if(registerWithFacebook)
        return (
            <FormRegisterFacebook registerWithFacebook={registerWithFacebook} setRegisterWithFacebook={setRegisterWithFacebook} />
        )
    else
        return (
                <div className='card-body' style={{"marginTop":"30px"}}>
                    <div className="row">
                        <button style={{"color":"white"}}  onClick={handleClick} className="btn btn-info btn-sm"><Facebook_icon/>&nbsp;&nbsp;Continuar con Facebook</button>
                    </div>
                    <div className="row">
                        <div style={{"textAlign":"center", "marginTop":"20px", "marginBottom":"20px"}} className="col-12">
                        o
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <input type="text" id="user" autoComplete="off" value={userLogin} onChange={handleChangeInput} style={{"fontSize":"13px"}} className="form-control" placeholder="Telefono, usuario o correo electrónico"/>
                        </div>
                        <div className="col-12">
                            <input type="password" id="pass" autoComplete="off" value={passLogin} onChange={handleChangeInput} style={{"fontSize":"13px"}} className="form-control" placeholder="Contraseña"/>
                        </div>
                    </div>
                    <br></br>
                    <div className="col-12" style={{"paddingBottom":"10px","marginBottom":"0px"}} id="widgetContainer" ref={divContainer}></div>
                    <div className="row">
                    {
                        isLoading? <div className="col-12" style={{"textAlign":"center"}}><img width="42" height="42" src='/loading.gif'></img></div>:
                        <input type="button" style={{"color":"white"}} disabled={(userLogin && passLogin && passLogin.length > 5) || isPhone?false:true} onClick={handleSignIn} className="btn btn-info btn-sm" value="Iniciar sesion" />
                    }
                    </div>
                    <div className="row">
                        <p style={{"fontSize":"12px","marginTop":"10px"}} className="text-muted">¿No tienes cuenta?&nbsp;
                        <a href='#' onClick={(e) => {e.preventDefault(); setSignup(true)}} style={{"textDecoration":"none"}}>Registrate</a>
                        </p>
                    </div>
                    <div className="row">
                        <p style={{"fontSize":"12px"}}>
                            <a href='#' onClick={(e) => {e.preventDefault(); setForgotPassword(true)}} style={{"textDecoration":"none"}}>¿Olvidaste tu contraseña?</a>
                        </p>
                    </div>
                    <div className="row" style={{"textAlign":"center","fontSize":"13px","fontWeight":"700"}}>
                        {errorLogin && <p className="text-danger">{errorLogin}</p>}
                    </div>
                    <ModalWindow show={showModalCode} >
                        <div className="row">
                            <div className="col-12" style={{"textAlign":"center","fontSize":"13px","display":"grid", "gridTemplateColumns":"repeat(6, 1fr)","alignItems": "center","columnGap":"15px","padding":"15px","paddingBottom":"0px"}}>
                                {
                                    digitsCode
                                }
                            </div>
                            {
                                errorSMS ? <p style={{"fontSize":"11px"}} className="text-danger">{errorSMS}</p>:''
                            }
                            <p style={{"fontSize":"13px","marginTop":"0px"}} className="text-muted">Ingrese el codigo de 6 digitos que fue enviado al numero <span style={{"fontWeight":"700"}}>{userLogin}</span> para ingresar</p>
                            <button style={{"color":"white"}} ref={buttonCode} disabled={sendCode?true:false} onClick={handleSendCode} className="btn btn-info btn-sm">
                                {sendCode && sendingCode== 2 ? `Reenviar SMS en ${sendCode}`:sendingCode == 1? 'Enviando SMS...':'Reenviar SMS'}
                            </button>
                        </div>
                    </ModalWindow>
                </div>
        );
}

export default FormLogin;
