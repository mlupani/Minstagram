import React, { useState } from 'react';
import ModalWindow from 'components/ModalWindow'
import { Facebook_icon } from 'components/icons'

const FormEditUser = ({handleSubmit, displayName, userName, email, phone, setDisplayName, setUserName, setEmail, setPhone, stateSend, showActivity, setShowActivity, privacy, setprivacy, saved, providers, handleFacebook, loadingFacebookLink }) => {

    const [modalShow, setModalShow] = useState(false);


    return (
        <form method="POST" onSubmit={e => handleSubmit(e)}>
            <div className="container" style={{"padding":"22px","marginBottom":"50px","paddingTop":"10px"}}>
                <div className="row">
                    <div className="form-group" >
                        <label htmlFor="nombre"><h6>Nombre</h6></label>
                        <input type="text" autoComplete="off" className="form-control" id="nombre" value={displayName} onChange={(e) => setDisplayName(e.target.value)} aria-describedby="emailHelp" placeholder="Nombre" />
                    </div>
                </div>
                <div className="row" style={{"marginTop":"15px","textAlign":"justify"}}>
                    <p className="text-muted" style={{"fontSize":"12px"}} >
                        Para ayudar a que las personas descubran tu cuenta, usa el nombre por el que te conoce la gente, ya sea tu nombre completo, apodo o nombre comercial.
                    </p>
                    <p className="text-muted" style={{"fontSize":"12px"}} >
                        Solo puedes cambiar el nombre del grupo dos veces en un plazo de 14 días.
                    </p>
                </div>
                <div className="row">
                    <div className="form-group" >
                        <label htmlFor="username"><h6>Nombre de Usuario</h6></label>
                        <input type="text" autoComplete="off" className="form-control" id="username" value={userName} onChange={(e) => setUserName(e.target.value)} aria-describedby="emailHelp" placeholder="Nombre" />
                    </div>
                </div>
                <div className="row" style={{"marginTop":"15px","textAlign":"justify"}}>
                    <h6 className="text-muted" style={{"fontWeight":"600"}} >
                        Informacion Personal
                    </h6>
                </div>
                <div className="row" style={{"textAlign":"justify"}}>
                    <p className="text-muted" style={{"fontSize":"12px"}} >
                        Proporciona tu información personal, incluso si la cuenta se usa para un negocio, una mascota, etc. Esta información no se incluirá en tu perfil público.
                    </p>
                </div>
                <div className="row">
                    <div className="form-group" >
                        <label htmlFor="email"><h6>Correo electr&oacute;nico</h6></label>
                        <input type="text" autoComplete="off" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Email" />
                    </div>
                </div>
                <div className="row"  style={{"marginTop":"15px"}}>
                    <div className="form-group" >
                        <label htmlFor="phone"><h6>N&uacute;mero de Tel&eacute;fono</h6></label>
                        <input type="text" autoComplete="off" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} aria-describedby="emailHelp" placeholder="Telefono" />
                    </div>
                </div>
                <div className="row"  style={{"marginTop":"15px"}}>
                    <div className="col-3">
                        <div className="form-group" >
                            <input type="submit" disabled={stateSend?true:false} style={{"color":"white","fontWeight":"700"}} className="form-control btn btn-primary btn-sm" id="submit" value='Guardar'  />
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <h4 className="text-muted" style={{"fontSize":"18px","marginBottom":"5px"}} >
                        Privacidad de la cuenta
                    </h4>
                    <div className="form-group">
                        <div className="form-check">
                        <input value={privacy} disabled={stateSend?true:false} onChange={(e)=>{if(e.target.checked) setprivacy(e.target.checked); else setModalShow(true)}} checked={privacy?'checked':false} className="form-check-input" type="checkbox" id="checkPrivada"/>
                        <label className="form-check-label" htmlFor="checkPrivada"  style={{"fontSize":"14px", "fontWeight":"600"}}>
                            Cuenta privada
                        </label>
                        <p className="text-muted" style={{"fontSize":"13px"}}>Si tu cuenta es privada, solo las personas que apruebes podrán ver tus fotos y videos en Mistagram. Esto no afectará a tus seguidores actuales.</p>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <h4 className="text-muted" style={{"fontSize":"18px","marginBottom":"5px"}} >
                        Estado de la actividad
                    </h4>
                    <div className="form-group">
                        <div className="form-check">
                        <input value={showActivity} disabled={stateSend?true:false} onChange={(e)=>{setShowActivity(e.target.checked)}} checked={showActivity?'checked':false} className="form-check-input" type="checkbox" id="checkPrivada"/>
                        <label className="form-check-label" htmlFor="checkPrivada" style={{"fontSize":"14px", "fontWeight":"600"}}>
                            Mostrar estado de actividad
                        </label>
                        <p className="text-muted" style={{"fontSize":"13px"}}>Permite que las cuentas que sigues y cualquier persona a quien envíes mensajes vean cuándo fue la última vez que estuviste activo en las apps de Mistagram. Cuando esta opción esté desactivada, no podrás ver el estado de actividad de otras cuentas.</p>
                        </div>
                    </div>
                </div>
                <br></br>
                {loadingFacebookLink == "Vinculado" ?
                    <div className="row">
                        <div className="col-12">
                            <button style={{"color":"white", "width":"100%"}} className="btn btn-info btn-sm"><Facebook_icon/>&nbsp;&nbsp;{loadingFacebookLink}</button>
                        </div>
                    </div>
                :
                    <div className="row">
                        <div className="col-12">
                            <button style={{"color":"white", "width":"100%"}}  onClick={e => handleFacebook(e, providers.includes('facebook.com') ? 'desvincular':'vincular')} className="btn btn-info btn-sm"><Facebook_icon/>&nbsp;&nbsp;{loadingFacebookLink? loadingFacebookLink:providers.includes('facebook.com') ? 'Desvincular con Facebook':'Vincular con Facebook'}</button>
                        </div>
                    </div>
                }
                
                <ModalWindow show={modalShow}>
                        <div className="row">
                            <div className="col-12">
                                <ul className="list-group lista_modal" style={{"padding":"0px","margin":"0px","borderRadius":"1rem !important"}}>
                                    <li className="list-group-item" style={{"padding":"22px"}} >
                                        <p style={{"fontSize":"18px","fontWeight":"500"}}>¿Cambiar la privacidad?</p>
                                        <p className="text-muted" style={{"fontSize":"13px"}}>Cualquiera podrá ver tus fotos y videos en Instagram. Ya no tendrás que aprobar a los seguidores.</p>
                                    </li>
                                    <li onClick={()=>{ setprivacy(false); setModalShow(false);}} className="list-group-item" style={{"fontWeight":"700","color":"#0095f6","fontSize":"13px"}} >Aceptar</li>
                                    <li style={{"fontSize":"13px"}} onClick={()=>setModalShow(false)} className="list-group-item">Cancelar</li>
                                </ul>
                            </div>
                        </div>
                </ModalWindow>
            </div>
        </form>
    );
}

export default FormEditUser;
