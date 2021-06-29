import Head from 'next/head'
import useUser from 'hooks/useUser'
import Activity from 'components/Activity'
import styles from 'styles/Search.module.css'
import { useState, useEffect, Fragment } from 'react'
import { getActivity, getRequestbyUserPendings, removeFollowRequest, updateFollowRequest, UpdatefollowUser, updateFollowRequestNotif, getRequestbyUserAccepted, sendFollowRequest, RemovefollowUser, getUserByDoc_2 } from 'firebase/client'
import { Arrow_icon, Fav_icon, Circle_selected, Chevron } from 'components/icons'
import { useRouter } from 'next/router'
import ModalWindow from 'components/ModalWindow'
import { sendNotification } from 'services/notifications'

const Actividad = () => {

    const router = useRouter()
    const user = useUser()
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [commentsOfComments, setcommentsOfComments] = useState([])
    const [activity, setActivity] = useState('')
    const [categories, setCategories] = useState([])
    const [requests, setRequests] = useState('')
    const [requestsAccepted, setRequestsAccepted] = useState([])
    const [checkRequest, setCheckRequest] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [FollowRequest, setFollowRequest] = useState(false)
    const [modalShow, setModalShow] = useState(false)
    const [nameModal, setNameModal] = useState('')
    const [avatarModal, setAvatarModal] = useState('')
    const [avatarFilterModal, setAvatarFilterModal] = useState('')
    const [activityFromUserIDModal, setActivityFromUserIDModal] = useState('')
    const [activityIDModal, setActivityIDModal] = useState('')

    useEffect(() =>{
        let unsubscribe
        let unsubscribeRequest
        let unsubscribeRequestAccepted

        if(user){
            unsubscribe = getActivity(user.userID, setComments, setLikes,setcommentsOfComments)
            unsubscribeRequest = getRequestbyUserPendings(user.userID,setRequests)
            unsubscribeRequestAccepted = getRequestbyUserAccepted(user.userID,setRequestsAccepted)
        }

        return () => {
            unsubscribe && unsubscribe()
            unsubscribeRequest && unsubscribeRequest()
            unsubscribeRequestAccepted && unsubscribeRequestAccepted()
        }
    },[user])

    useEffect(() =>{
        if(comments || likes || commentsOfComments||requestsAccepted){
            setActivity(likes.concat(comments, commentsOfComments, requestsAccepted ))
        }
    },[comments, likes, commentsOfComments,requestsAccepted])

    useEffect(() =>{
        let categorias = []
        const date_now = Date.now()

        if(activity.length)
        {
            activity.sort((a,b)=> b.createdAt - a.createdAt)
            activity.map((act,index) => {
                let nombre = ''
                let elapsed = Math.abs(act.createdAt - date_now)
                if(elapsed <= 300000) nombre = "Nuevo"
                else if(elapsed <= 86400000) nombre = "Hoy"
                else if(elapsed > 86400000 && elapsed <= 129600000) nombre = "Ayer"
                else if(elapsed > 129600000 && elapsed <= 604800000) nombre = "Esta semana"
                else if(elapsed > 604800000 && elapsed <= 83030400000) nombre = "Este Mes"
                if(categorias.indexOf(nombre) < 0)
                    categorias.push(nombre)

                activity[index] = {...act, "categoryTime":nombre}
            })

            setCategories(categorias.sort(() => 0))
        }

    },[activity])

    useEffect(() =>{
        if(requests){
            setIsLoading(false)
            requests.map(req => updateFollowRequestNotif(req.id))
        }
    },[requests])

    useEffect(() =>{
        if(requestsAccepted){
            setIsLoading(false)
            requestsAccepted.map(req => updateFollowRequestNotif(req.id))
        }
    },[requestsAccepted])

    const handleCancelFollow = reqID => {
        removeFollowRequest(reqID)
        setCheckRequest(false)
    }

    const handleAcceptFollow = (reqID, reqUserID) => {
        updateFollowRequest(reqID)
        UpdatefollowUser(reqUserID, user.userID);
        setCheckRequest(false)
    }

    const handleFollow = (e, userFollowed, privacy) => {
        //COMPROBAR PRIVACIDAD DEL POSIBLE FOLLOW PARA VER SI AGREGO O NO A MIS FOLLOWS
        if(!privacy){
            UpdatefollowUser(user.userID, userFollowed);
            sendFollowRequest(userFollowed, user.userID, user.userName, user.displayName, user.avatar, user.filter, true  ).then(async res => {
                const userNotif = await getUserByDoc_2(userFollowed);
                await sendNotification
                (
                    {
                        title: "Tienes un nuevo seguidor",
                        message: `${user.userName} te esta siguiendo.`,
                        icon: user.avatar,
                        data: { url: window.location.origin+'/actividad/' },
                        actions: [{action: "follow", title: "Notificacion de seguimiento"}]
                    },
                    JSON.parse(userNotif.subscriptionNotifications)
                )
            })
        }else{
            setFollowRequest(true)
            sendFollowRequest(userFollowed, user.userID, user.userName, user.displayName, user.avatar, user.filter ).then(async res => {
                const userNotif = await getUserByDoc_2(userFollowed);
                await sendNotification
                (
                    {
                        title: "Tienes un nuevo seguidor",
                        message: `${user.userName} te esta siguiendo.`,
                        icon: user.avatar,
                        data: { url: window.location.origin+'/actividad/' },
                        actions: [{action: "follow", title: "Notificacion de seguimiento"}]
                    },
                    JSON.parse(userNotif.subscriptionNotifications)
                )
                setFollowRequest(false)
            })
        }
    }

    const handleCancelFollowUsers = (userFollowed,reqID) => {
        handleCancelFollow(reqID)
        RemovefollowUser(user.userID, userFollowed);
        setModalShow(false)
    }

    return (
        <Fragment>
            <Head>
                <title>Actividad</title>
                <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                <meta name="robots" content="noimageindex, noarchive"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            <div className="container" style={{"padding":"0"}}>
                <div className="row">
                    <div className="col-1" style={{"paddingLeft": "20px", "cursor":"pointer"}} ><a onClick={() => !checkRequest?router.back():setCheckRequest(false)} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a></div>
                    <div className="col-10" style={{"textAlign":"center","marginTop":"7px"}}><h6>{!checkRequest?'Actividad':'Solicitud de Seguidores'} </h6></div>
                </div>
                <ol className="list-group" style={{"borderTop":"1px solid lightgray","marginTop":"10px"}}>
                {
                    requests?.length && !isLoading?
                        requests.map(req =>
                            !checkRequest?
                            <div key={req.id} onClick={() =>setCheckRequest(true)} className="row" style={{"marginTop":"10px"}}>
                                <div className="col-2" style={{"paddingLeft": "10px","paddingTop":"5px"}} ><img className={`${styles.avatar} filter-${req.fromAvatarFilter}`} alt={req.fromAvatar} src={req.fromAvatar}></img></div>
                                <div className="col-7" style={{"marginLeft":"10px","fontSize":"14px","fontWeight":"600","paddingTop":"5px"}}>
                                    Solicitudes de Seguidores
                                    <p style={{"color":"darkgray","fontSize":"14px","fontWeight":"100"}}>{req.fromUsername}</p>
                                </div>
                                <div onClick={() =>setCheckRequest(true)} style={{"textAlign":"right","paddingTop":"3px"}} className="col-2">
                                    <span style={{"color":"rgba(var(--d69,0,149,246),1)","marginRight":"15px"}}><Circle_selected width="8" height="8" /></span>
                                    <Chevron width="14" height="14"/>
                                </div>
                            </div>:
                            <div key={req.id} className="row" style={{"marginTop":"10px"}}>
                                <div onClick={()=>router.push(`user/${req.fromUserID}`)} className="col-2" style={{"paddingLeft": "10px","paddingTop":"5px"}} ><img className={`${styles.avatar}`} alt={req.fromAvatar} src={req.fromAvatar}></img></div>
                                <div onClick={()=>router.push(`user/${req.fromUserID}`)} className="col-4" style={{"fontSize":"14px","fontWeight":"600","paddingTop":"5px", "textOverflow":"ellipsis", "whiteSpace":"nowrap","overflow":"hidden"}}>
                                    {req.fromUsername}
                                    <p style={{"color":"darkgray","fontSize":"14px","fontWeight":"100", "textOverflow":"ellipsis","overflow":"hidden"}}>{req.fromDisplayName}</p>
                                </div>
                                <div style={{"textAlign":"right","paddingTop":"3px","display":"flex","justifyContent":"center"}} className="col-6">
                                    <div style={{"textAlign":"center","paddingTop":"3px"}} className="col-5"><button style={{"backgroundColor":"rgba(var(--d69,0,149,246),1)","border":"rgba(var(--d69,0,149,246),1)"}} onClick={() =>handleAcceptFollow(req.id, req.fromUserID)} className="btn btn-primary btn-sm">Confirmar</button></div>
                                    <div style={{"textAlign":"center","paddingTop":"3px"}} className="col-6"><button style={{"border":"1px solid gainsboro"}} onClick={()=>handleCancelFollow(req.id)} className="btn btn-light btn-sm">Eliminar</button></div>
                                </div>
                            </div>
                        ):''
                }
                {

                    activity?.length && !isLoading?
                        <div style={{"marginBottom":"50px"}}>
                        {categories.map((category,index) => {
                            return (
                                <div key={index} style={{"borderBottom":"1px solid lightgray"}}>
                                    <p style={{"paddingLeft":"10px", "color":"gray","fontWeight":"600","fontSize":"13px","marginBottom":"4px","marginTop":"10px"}}>{category}</p>
                                    {activity.map(activity => {if(activity.categoryTime == category)
                                        return <Activity key={activity.id} activity={activity} handleFollow={handleFollow} setModalShow={setModalShow} handleCancelFollowUsers={handleCancelFollowUsers} setNameModal={setNameModal} setAvatarModal={setAvatarModal} setAvatarFilterModal={setAvatarFilterModal} setActivityFromUserIDModal={setActivityFromUserIDModal} setActivityIDModal={setActivityIDModal}  />})}
                                </div>
                            )
                        })}
                        </div>
                    :''
                }
                {
                    !activity?.length && !requests?.length && !isLoading?
                        <div className="row" style={{"textAlign":"center"}}>
                            <hr></hr>
                            <Fav_icon width="45" height="45" />
                            <br></br><br></br>
                            <h2>Actividad en tus <br></br>publicaciones</h2>
                            <p className="card-text">Aquí verás si alguien indica que le gusta una de tus publicaciones o la comenta.</p>
                        </div>:
                        isLoading?
                            <div className="row" style={{"textAlign":"center"}}>
                                <div className="col-12">
                                    <img width="42" height="42" src='/loading.gif'></img>
                                </div>
                            </div>:''
                }
                </ol>
             </div>

             <ModalWindow show={modalShow}>
                <div className="row">
                    <div className="col-12">
                        <ul className="list-group lista_modal" style={{"padding":"0px","margin":"0px","borderRadius":"1rem !important"}}>
                            <li className="list-group-item" style={{"padding":"22px"}} >
                                <img style={{"width":"80px", "height":"80px"}} src={avatarModal} className={`${styles.avatar} filter-${avatarFilterModal}`}></img>
                                <p className="text-muted" style={{"fontSize":"13px","paddingTop":"25px"}}>¿Dejar de seguir a @{nameModal}? </p>
                            </li>
                            <li onClick={()=>handleCancelFollowUsers(activityFromUserIDModal, activityIDModal)} style={{"color":"red", "fontWeight":"bold"}} className="list-group-item">Dejar de seguir</li>
                            <li onClick={()=>setModalShow(false)} className="list-group-item">Cancelar</li>
                        </ul>
                    </div>
                </div>
            </ModalWindow>

        </Fragment>
    );
}

export default Actividad