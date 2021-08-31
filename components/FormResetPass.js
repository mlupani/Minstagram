import { useState } from 'react'
import { sendResetPassword, getUserInCollectionByUsername } from 'firebase/client'

const FormResetPass = () => {

    let [user, setUser] = useState('')
    let flagIsMail = true
    let userSaved = ''
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleResetPass = async () => {

        if(user.search("@") == -1){
            userSaved = user
            const res = await getUserInCollectionByUsername(user)
            if(res.length) user = res[0]
            else user = 'a'
            flagIsMail = false
        }

        sendResetPassword(user)
        .then(res => {
            if(res == 1){
                if(flagIsMail)
                    setSuccess(`Se ha enviado un correo a ${user} para recuperar su contraseña`)
                else
                    setSuccess(`Se ha enviado un correo al mail perteneciente al usuario ${userSaved} para recuperar su contraseña`)

                setError('')
            }
            else{
                setSuccess('')
                setError(res)
            }

            setIsLoading(false)
        })
    }

    return (
        <div className='card-body' style={{"marginTop":"30px"}}>
                <div className="row">
                    <div className="col-12">
                        <input type="text" id="user" autoComplete="off" value={user} onChange={(e)=>setUser(e.target.value)} style={{"fontSize":"13px", "width": "250px"}} className="form-control" placeholder="Telefono, usuario o correo electronico"/>
                    </div>
                </div>
                <br></br>
                <div className="row">
                {
                    isLoading? <div className="col-12" style={{"textAlign":"center"}}><img width="42" height="42" src='/loading.gif'></img></div>:
                    <input type="button" style={{"color":"white"}} disabled={user.length > 4?false:true} onClick={handleResetPass} className="btn btn-info btn-sm" value="Recuperar Contraseña" />
                }
                </div>
                <br></br>
                <div className="row" style={{"textAlign":"center","fontSize":"13px","fontWeight":"700"}}>
                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}
                </div>
            </div>
    );
}

export default FormResetPass;
