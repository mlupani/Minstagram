import Head from 'next/head'
import { useState, useEffect, Fragment } from 'react'
import { addUserToCollection, signUpWithEmail, generateKeyWords, signInWithEmail} from 'firebase/client.js'
import useUser from 'hooks/useUser'
import { Arrow_icon } from 'components/icons'
import router, { useRouter } from 'next/router'
import FormLogin from 'components/FormLogin'
import FormSignUp from 'components/FormSignUp'
import FormResetPass from 'components/FormResetPass'

const Login = () => {

  const user = useUser()
  const Router = useRouter();
  const [error, setError] = useState(null)
  const [signUp, setSignup] = useState(false)
  const [entering, setEntering] = useState(false)
  const [errorLogin, setErrorLogin] = useState('')
  const [usuarioLogin, setUsuarioLogin] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)

  useEffect(() => {

    if(user) {
      router.push('/home')
    }

  },[user, usuarioLogin])

  useEffect(async () => {

    if(Router.query.emailSignUp && Router.query.passSignUp && Router.query.usernameSignUp){
      setEntering(true)
      signUpWithEmail(Router.query.emailSignUp, Router.query.passSignUp, setError).then(user => {
            signInWithEmail(Router.query.emailSignUp, Router.query.passSignUp, setErrorLogin).then(async () => {
                await addUserToCollection(user.userID_firebase, Router.query.usernameSignUp, Router.query.usernameSignUp, "https://www.seekpng.com/png/full/245-2454602_tanni-chand-default-user-image-png.png", user.email, '', generateKeyWords(Router.query.usernameSignUp)).then(() => {
              })
            })
      })
    }
  },[Router, Router.query.emailSignUp, Router.query.passSignUp])

  return (
          <Fragment>
            <Head>
                <title>{signUp?'Sign Up':'Ingresar'}</title>
                <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                <meta name="robots" content="noimageindex, noarchive"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            {
              (signUp || forgotPassword) &&
              <div className="row">
                  <div className="col-1" style={{"paddingLeft": "20px", "cursor":"pointer"}} >
                    <a href='#' onClick={(e) => {e.preventDefault(); signUp?setSignup(false):setForgotPassword(false)}} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a>
                  </div>
                </div>
            }
            <div className="container" style={{"marginTop":"100px", "width":"350px"}} >
                  <div className="row">
                    <div className="col-12 ">
                      <div className="card text-center">
                          <div className="card-header">
                            <div className="row">
                                <h3>Minstagram</h3>
                            </div>
                          </div>
                          {
                            entering?
                              <div className="col-12" style={{"textAlign":"center"}}><img width="42" height="42" src='/loading.gif'></img></div>:
                            signUp?
                              <FormSignUp />:
                            forgotPassword?
                              <FormResetPass />
                            :
                              <FormLogin setUsuarioLogin={setUsuarioLogin} setSignup={setSignup} errorLogin={errorLogin} setErrorLogin={setErrorLogin} setForgotPassword={setForgotPassword} />
                          }
                      </div>
                    </div>
                  </div>
            </div>
        </Fragment>
    )
}

//SERVER SIDE RENDERING
export const getServerSideProps = () => {

    return {
        props: {
            page: "login"
        }
    }
}

export default Login
