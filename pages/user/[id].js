import React, { useEffect, useState, Fragment, lazy, Suspense } from 'react'
import Loadingbar from 'react-multicolor-loading-bar'
import { logout, getPostsLikesCommentsbyUser, getPostsSaved, getLikesUser, getCommentsbyPostArray, getRequestbyUser } from 'firebase/client'
import Head from 'next/head'
import Link from 'next/link'
import router from 'next/router'
import { Logout_icon, Add_icon, Wall_icon, Wall_icon_selected, Bookmark_icon, Bookmark_icon_selected, Posts_icon,Posts_icon_selected, UserCheckIcon } from 'components/icons'
import Header from "components/Header";
import styles from 'styles/User.module.css'
import useFollows from 'hooks/useFollows'

const ModalWindow = lazy(() => import('components/ModalWindow'))
const Wallphoto = lazy(() => import('components/Wallphoto'))
const Card = lazy(() => import('components/Card'))

const options = {
    wall: 1,
    posts: 2,
    saved: 3
}

const User = () => {

    const { userAct, user, handleCancelFollow, handleFollow, FollowRequest } = useFollows();
    const [selectedOption, SetSelectedOption] = useState(options.wall)
    const [posts, setPosts] = useState(null)
    const [saves, setSaves] = useState('')
    const [idPostsComments, setidPostsComments] = useState([]);
    const [commentsPosts, setcommentsPosts] = useState();
    const [likesUser, setLikesUser] = useState([])
    const [savesUser, setSavesUser] = useState('')
    const [modalShow, setModalShow] = useState(false)
    const [requestSended, setRequestSended] = useState(null)

    const handleLogout = async () => {
        const res = await logout(user.userID)
        if(res) {
            router.replace("/")
        }
    }

    const handleOptions = option => {
        SetSelectedOption(option)
    }

    useEffect(() =>{

        let unsubscribe
        let unsubscribeLikes
        let unsubscribeSaves
        let unsubscribeRequest

        if(user && userAct)
            unsubscribeRequest = getRequestbyUser(userAct.userID, user.userID, setRequestSended)

        if(selectedOption==options.wall){
            if(user){
                unsubscribe = getPostsLikesCommentsbyUser(user.userID,setPosts);
            }
        }

        if(selectedOption == options.posts){
            if(user){
                unsubscribe = getPostsLikesCommentsbyUser(user.userID,setPosts);
                unsubscribeSaves = getPostsSaved(user.userID, setSavesUser)
                unsubscribeLikes = getLikesUser(user.userID, setLikesUser)
            }
        }

        if(selectedOption==options.saved)
        {
            if(user)
                unsubscribe = getPostsSaved(user.userID,setSaves);
        }

        return () => {
            unsubscribe && unsubscribe()
            unsubscribeLikes && unsubscribeLikes()
            unsubscribeSaves && unsubscribeSaves()
            unsubscribeRequest && unsubscribeRequest()
        }

    }, [user, selectedOption, userAct])

    useEffect(() =>{
        let postComments = []
        if(posts && selectedOption == options.posts){
            postComments = posts.map(post => post.id)
        }
        if(postComments.length){
            setidPostsComments(postComments)
        }

    },[])

    useEffect(() =>{
         if(idPostsComments.length && selectedOption == options.posts){
            getCommentsbyPostArray(idPostsComments, setcommentsPosts)
        }
    },[])

    useEffect(() =>{
        if(Array.isArray(requestSended) && !requestSended.length)
            setRequestSended(null)
    }, [requestSended])
    

    return (
        <Fragment>
            <Head>
                <title>Datos del usuario</title>
                <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                <meta name="robots" content="noimageindex, noarchive"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            <Header />
            {user && userAct?
                <div className="container" style={{"padding":"0"}}>
                    <div className="row" style={{"borderBottom":"1px solid gainsboro"}}>
                        <div className="col-2" style={{"paddingLeft": "20px","paddingTop":"5px"}} ><a onClick={handleLogout} style={{"textDecoration":"none", "color":"black"}}><Logout_icon/></a></div>
                        <div className="col-8" style={{"textAlign":"center","marginTop":"7px","paddingRight":"0px !important"}}><h6>{user.userName}</h6></div>
                        <div className="col-2"><button style={{"textDecoration":"none","color":"black"}} className="btn btn-link"><Add_icon/></button></div>
                    </div>
                    <div className="row" style={{"marginTop":"10px"}}>
                        <div className={`col-4`} style={{"paddingLeft": "20px","paddingTop":"5px", justifyContent:'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}} ><img width="80" height="80" className={`${styles.avatar} filter-${user.filter}`} alt={user?user.avatar:''} src={user?user.avatar:''}></img>
                        <p style={{"fontSize":"14px","marginBottom":"5px", "paddingRight": '20%'}} >{user.displayName}</p>
                        </div>
                        <div className={`col-4 ${styles.containerButton}`} style={{"paddingLeft": "30px","paddingTop":"5px"}} >
                        <p style={{"fontSize":"20px","marginBottom":"5px", 'marginRight':'20px'}} >{user.userName}</p>
                        {
                            userAct?.userID == user?.userID?
                            <div style={{"border":"1px solid gainsboro", "textAlign":"center","height":"30px"}} className={`col-4 ${styles.perfilContainer}`} >
                                <Link href="/accounts/edit/"><a style={{"width":"100%","padding":"0px"}} className="btn btn-block btn-white">Editar Perfil</a></Link>
                            </div>:
                            <div style={{"textAlign":"center"}} className="row" >
                                {
                                    userAct?.followsCount.includes(user.userID)?
                                    <Fragment>
                                        <div style={{"textAlign":"center","marginRight":"5px"}} className="col-7" >
                                            <button style={{"width":"100%","padding":"0px","border":"1px solid gainsboro"}} onClick={()=>router.push('/chat/[id]',`/chat/${user.userID}`, { shallow: true })} className="btn btn-sm btn-light">Enviar mensaje</button>
                                        </div>
                                        <div style={{"textAlign":"center"}} className="col-2" >
                                            <button style={{"width":"100%","padding":"0px","border":"1px solid gainsboro"}} onClick={() => setModalShow(true)} className="btn btn-sm btn-light"><UserCheckIcon width="15" height="15"/></button>
                                        </div>
                                        <Suspense fallback={'cargando...'}>
                                            <ModalWindow show={modalShow} >
                                                <div className="row">
                                                    <div className="col-12" style={{"textAlign":"center","fontSize":"13px"}}>
                                                        <img style={{"margin":"35px"}} width="80" height="80" className={`${styles.avatar}`} alt={user?user.avatar:''} src={user?user.avatar:''}></img>
                                                        <p style={{"fontSize":"13px","borderBottom":"1px solid gainsboro","paddingBottom":"40px","paddingLeft":"40px","paddingRight":"40px"}} className="text-muted">{`Si cambias de opinión, tendrás que volver a enviar una solicitud de seguimiento a @${user.userName} .`}</p>
                                                        <ul className="list-group lista_modal" style={{"padding":"0px","margin":"0px","borderRadius":"1rem !important"}}>
                                                            <li style={{"color":"red", "fontWeight":"bold","border":"none","paddingTop":"0px"}} onClick={()=>handleCancelFollow(user.userID,requestSended?.id, setModalShow)} className="list-group-item">Dejar de seguir</li>
                                                            <li style={{"border":"none"}} onClick={()=>setModalShow(false)} className="list-group-item">Cancelar</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </ModalWindow>
                                        </Suspense>
                                    </Fragment>
                                    :
                                    !requestSended?.view && requestSended && user.private?
                                    <div style={{"textAlign":"center"}} className="col-11" >
                                        <button style={{"width":"100%","padding":"0px","border":"1px solid gainsboro"}} onClick={() => setModalShow(true)} className="btn btn-sm btn-light">Solicitado</button>
                                        <Suspense fallback={'cargando...'}>
                                            <ModalWindow show={modalShow} >
                                                <div className="row">
                                                    <div className="col-12" style={{"textAlign":"center","fontSize":"13px"}}>
                                                        <img style={{"margin":"35px"}} width="80" height="80" className={`${styles.avatar}`} alt={user?user.avatar:''} src={user?user.avatar:''}></img>
                                                        <p style={{"fontSize":"13px","borderBottom":"1px solid gainsboro","paddingBottom":"40px","paddingLeft":"40px","paddingRight":"40px"}} className="text-muted">{`Si cambias de opinión, tendrás que volver a enviar una solicitud de seguimiento a @${user.userName} .`}</p>
                                                        <ul className="list-group lista_modal" style={{"padding":"0px","margin":"0px","borderRadius":"1rem !important"}}>
                                                            <li style={{"color":"red", "fontWeight":"bold","border":"none","paddingTop":"0px"}} onClick={()=>handleCancelFollow(user.userID,requestSended.id, setModalShow)} className="list-group-item">Dejar de seguir</li>
                                                            <li style={{"border":"none"}} onClick={()=>setModalShow(false)} className="list-group-item">Cancelar</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </ModalWindow>
                                        </Suspense>
                                    </div>:
                                    !requestSended?.view && requestSended?
                                    <div style={{"textAlign":"center"}} className="col-11" >
                                        <button style={{"width":"100%","padding":"0px"}} onClick={e =>handleFollow(e, user.userID, user.private)} className="btn btn-sm btn-primary">{FollowRequest?'Enviando Solicitud...':'Seguir'}</button>
                                    </div>:
                                    !requestSended?
                                    <div style={{"textAlign":"center"}} className="col-11" >
                                        <button style={{"width":"100%","padding":"0px"}} onClick={e =>handleFollow(e, user.userID, user.private)} className="btn btn-sm btn-primary">Seguir</button>
                                    </div>:
                                    <div style={{"textAlign":"center"}} className="col-12" ><img width="42" height="42" src='/loading.gif'></img></div>
                                }
                            </div>
                        }
                        </div>
                    </div>
                    <div className="row" style={{"marginTop":"15px","borderTop":"1px solid gainsboro","borderBottom":"1px solid gainsboro"}}>
                        <div className="col-4" style={{"paddingTop":"5px","textAlign":"center","fontSize":"14px"}} >
                            <section style={{"fontWeight":"bold"}}>{posts?posts.length:<img width="20" height="20" src='/loading.gif'></img>}</section>
                            <p style={{"color":"darkgray"}}>Publicaciones</p>
                        </div>
                        <div className="col-4" style={{"paddingTop":"5px","textAlign":"center","fontSize":"14px"}} >
                            <section style={{"fontWeight":"bold"}}>{posts?user.followersCount.length:<img width="20" height="20" src='/loading.gif'></img>}</section>
                            <p style={{"color":"darkgray"}}>Seguidores</p>
                        </div>
                        <div className="col-4" style={{"paddingTop":"5px","textAlign":"center","fontSize":"14px"}} >
                            <section style={{"fontWeight":"bold"}}>{posts?user.followsCount.length:<img width="20" height="20" src='/loading.gif'></img>}</section>
                            <p style={{"color":"darkgray"}}>Seguidos</p>
                        </div>
                    </div>
                    {
                        user.userID == userAct.userID || userAct.followsCount.includes(user.userID) || !user.private?
                        <Fragment>
                            <div className="row" style={{"borderBottom":"1px solid gainsboro","paddingTop":"5px","paddingBottom":"10px","display":"grid","gridTemplateColumns":`repeat(auto-fit, minmax(50px, 1fr))`,"textAlign":"center"}}>
                                <div onClick={() =>handleOptions(options.wall)}  style={{"paddingTop":"5px","textAlign":"center","fontSize":"14px"}} >
                                    {selectedOption == options.wall? <Wall_icon_selected/>:<Wall_icon/>}
                                </div>
                                <div onClick={() =>handleOptions(options.posts)} style={{"paddingTop":"5px","textAlign":"center","fontSize":"14px"}} >
                                    {selectedOption == options.posts? <Posts_icon_selected/>:<Posts_icon/>}
                                </div>
                                {
                                    user.userID == userAct.userID &&
                                        <div onClick={() =>handleOptions(options.saved)} style={{"paddingTop":"5px","textAlign":"center","fontSize":"14px"}} >
                                            {selectedOption == options.saved? <Bookmark_icon_selected/>:<Bookmark_icon/>}
                                        </div>
                                }
                            </div>
                            <div className={`row ${styles.rowWallPhoto}`}>
                                <div className={`col-8 ${styles.containerWallPhoto}`} style={{"fontSize":"14px","paddingBottom":"12px"}} >
                                    {
                                        selectedOption == options.wall?
                                        (
                                            <Suspense fallback={<div className="col-12" style={{"textAlign":"center"}}><img width="42" height="42" src='/loading.gif'></img></div>}>
                                                <Wallphoto dataPhotos={posts}  isClickeable={true} columnas="3" />
                                            </Suspense>
                                        ):
                                        selectedOption == options.posts?
                                        posts?.length?
                                            posts.map(
                                                ({createdAt,userName, id, img, likeCount, commentCount, content, avatar, userID, place, filter }) => (
                                                <Suspense key={id} fallback={<div className="col-12" style={{"textAlign":"center"}}><img width="42" height="42" src='/loading.gif'></img></div>}>
                                                    <Card
                                                    createdAt={createdAt}
                                                    userName={userName}
                                                    img={img}
                                                    likeCount={likeCount}
                                                    content={content}
                                                    id={id}
                                                    avatar={avatar}
                                                    userID={userID}
                                                    likesUser={likesUser}
                                                    commentCount={commentCount}
                                                    comments={commentsPosts? commentsPosts.filter(post => post.idPost == id):[]}
                                                    place={place}
                                                    savesUser={savesUser}
                                                    filter={filter}
                                                    />
                                                </Suspense>
                                                )
                                            ):<div className="col-12" style={{"textAlign":"center","marginTop":"50px"}}><p>No hay Publicaciones</p></div>
                                        :
                                        selectedOption == options.saved?
                                        (
                                            <div className="col-12" style={{"textAlign":"center"}}>
                                                <p style={{"color":"darkgray","fontSize":"12px"}}>Solo tu puedes ver lo que guardaste</p>
                                                {
                                                saves.length? <Suspense><Wallphoto dataPhotos={saves} columnas="3" /></Suspense>:
                                                !saves? <img width="42" height="42" src='/loading.gif'></img>:
                                                !saves.length && saves?
                                                    <div className="col-12" style={{"textAlign":"center"}}>
                                                        <Bookmark_icon width="35" height="35"/>
                                                        <p style={{"fontSize":"25px","marginTop":"15px"}}>Guardar</p>
                                                        <p>Guarda fotos y videos que quieras volver a ver. Nadie recibirá una notificación y solo tú podrás ver lo que guardaste.</p>
                                                    </div>:''
                                                }
                                            </div>
                                        )
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                            </Fragment>:
                            <div className="row" style={{"borderBottom":"1px solid gainsboro","paddingTop":"5px","paddingBottom":"10px","textAlign":"center","fontSize":"13px"}}>
                                <p style={{"fontWeight":"600"}}>Esta cuenta es privada</p>
                                <p>Siguela para ver sus fotos y videos</p>
                            </div>
                            }
                        </div>
                    :
                    <Loadingbar
                        colors={["#dc3545", "#25C5EC", "#E3F10C", "#21F10C"]}
                        height={5}
                        cycleDurationInMs={200}
                        positionAtTop={true}>
                    </Loadingbar>}
                </Fragment>
    )
}

export default User;
