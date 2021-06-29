import Link from 'next/link'
import styles from 'styles/Activity.module.css'
import useTimeAgo from 'hooks/useTimeAgo'
import { Fragment, useEffect, useState } from 'react'
import { UpdateViewNotif, UpdateViewCommentsNotif, UpdateViewCommentsofCommentsNotif, updateFollowRequestNotif, getUserByDoc, getRequestbyUserToUser} from 'firebase/client'
import { useRouter } from 'next/router'
import useUser from 'hooks/useUser'

const Activity = ({activity, handleFollow, setModalShow, setNameModal, setAvatarModal, setAvatarFilterModal, setActivityFromUserIDModal, setActivityIDModal}) => {

    const user = useUser()
    const router = useRouter()
    const timeAgo = useTimeAgo(activity.createdAt,"short")
    const [userActivity, setUserActivity] = useState('')
    const [requestSended, setRequestSended] = useState()

    if(activity.likeUserID && !activity.view){
        UpdateViewNotif(activity.id)
    }

    if(activity.toUserID && !activity.idComment && !activity.view)
        UpdateViewCommentsNotif(activity.id)

    if(activity.idComment && !activity.view)
        UpdateViewCommentsofCommentsNotif(activity.id)

    let palabras = []
    if(activity.comment)
    {
        palabras = activity.comment.split(' ')

        palabras.map((palabra,index) => {
            if(palabra.indexOf("@") >= 0)
                palabras[index] = <span onClick={()=>router.push(`/user/${activity.userID}`)} key={index} style={{"textDecoration": "none", "color":"cornflowerblue"}}>{palabra}&nbsp;</span>
        })

    }

    useEffect(() =>{
        let unsubscribe
        getUserByDoc(activity.fromUserID, setUserActivity)
        if(user?.userID && activity.fromUserID)
            unsubscribe = getRequestbyUserToUser(user.userID, activity?.fromUserID, setRequestSended)

        if(user && !activity.fromUserID){
            setRequestSended([])
        }

        return ()=> unsubscribe && unsubscribe()
    },[user])

    const handleModal = (name, avatar, avatarFilter, fromUserID, fromActivityID) => {
        setNameModal(name)
        setAvatarModal(avatar)
        setAvatarFilterModal(avatarFilter)
        setActivityFromUserIDModal(fromUserID)
        setActivityIDModal(fromActivityID)
        setModalShow(true)
    }

    console.log(requestSended)

    if(activity && user && typeof requestSended != "undefined")
        return (
            <div className="row" key={activity.id}>
                <div className="col-2" style={{"paddingLeft":"15px"}}>
                    <Link href={'/user/[id]'} as={`/user/${activity.userID?activity.userID:activity.fromUserID}`} >
                            <a><img src={activity.avatarLike?activity.avatarLike:activity.avatar?activity.avatar:activity.fromAvatar} className={`${styles.avatar} filter-${activity.avatarLikeFilter?activity.avatarLikeFilter:activity.filterAvatar?activity.filterAvatar:activity.fromAvatarFilter}`}></img></a>
                    </Link>
                </div>
                    {activity.likeUserID?
                        <Fragment>
                            <div className="col-7" style={{"paddingLeft":"10px","paddingTop":"3px"}} onClick={()=>router.push(`/status/[id]`,`/status/${activity.idPost}` )}>
                                <span style={{"fontSize":"13px","fontWeight":"600"}}>{activity.userName}</span>
                                <span style={{"fontSize":"13px"}}>&nbsp;le ha gustado tu foto.</span>
                                <p style={{"fontSize":"13px"}} className={"text-muted"}>{timeAgo.replace("hace","")}</p>
                            </div>
                        </Fragment>
                    :activity.toUserID && !activity.acceptedAt?
                        <Fragment>
                            <div className="col-7" style={{"paddingLeft":"10px","paddingTop":"3px"}} onClick={()=>router.push(`/status/[id]`,`/status/${activity.idPost}` )}>
                                <span style={{"fontSize":"13px","fontWeight":"600"}}>{activity.userName}</span>
                                <span style={{"fontSize":"13px"}}>&nbsp;ha comentado:</span>
                                <p style={{"fontSize":"13px"}}>{palabras.length?palabras:activity.comment}<span style={{"fontSize":"14px"}} className={"text-muted"}>&nbsp;{timeAgo.replace("hace","")}</span></p>
                            </div>
                        </Fragment>
                    :activity.acceptedAt?
                        <Fragment>
                            <div className="col-7" style={{"paddingLeft":"10px","paddingTop":"3px"}} onClick={()=>router.push(`/user/[id]`,`/user/${activity.fromUserID}` )}>
                                <span style={{"fontSize":"13px","fontWeight":"600"}}>{activity.fromUsername}</span>
                                <span style={{"fontSize":"13px"}}>&nbsp;&nbsp;Comenz&oacute; a seguirte</span>
                                <p style={{"fontSize":"13px"}} className={"text-muted"}>{timeAgo.replace("hace","")}</p>
                            </div>
                        </Fragment>
                    :''
                    }
                {
                    !activity.acceptedAt?
                        <div className="col-2" style={{"width":"45px","height":"45px"}} onClick={()=>router.push(`/status/[id]`,`/status/${activity.idPost}`)}>
                            <figure className={`filter-${activity.img[0].filterApplied}`}><img  style={{"objectFit": "cover", "width":"45px", "height":"45px"}}  src={activity.img[0].img}></img></figure>
                        </div>:
                        user?.followsCount.includes(activity.fromUserID)?
                            <div className="col-2" style={{"width":"45px","height":"45px"}} >
                                <button onClick={() => handleModal(activity.fromUsername, activity.avatarLike?activity.avatarLike:activity.avatar?activity.avatar:activity.fromAvatar, activity.avatarLikeFilter?activity.avatarLikeFilter:activity.filterAvatar?activity.filterAvatar:activity.fromAvatarFilter, activity.fromUserID, activity.id)} style={{"border":"1px solid gainsboro"}} className="btn btn-light btn-sm">Siguiendo</button>
                            </div>
                            :
                                requestSended?.fromUserID?
                                    !requestSended.view?
                                    <div className="col-2" style={{"width":"45px","height":"45px"}} >
                                        <button style={{"marginTop":"5px", "border":"1px solid gainsboro"}} onClick={() => handleModal(activity.fromUsername, activity.avatarLike?activity.avatarLike:activity.avatar?activity.avatar:activity.fromAvatar, activity.avatarLikeFilter?activity.avatarLikeFilter:activity.filterAvatar?activity.filterAvatar:activity.fromAvatarFilter, activity.fromUserID, activity.id)} className="btn btn-light btn-sm">Pendiente</button>
                                    </div>:
                                            user?.followsCount.includes(activity.fromUserID)?
                                    <div className="col-2" style={{"width":"45px","height":"45px","marginTop":"5px"}} >
                                        <button onClick={() => handleModal(activity.fromUsername, activity.avatarLike?activity.avatarLike:activity.avatar?activity.avatar:activity.fromAvatar, activity.avatarLikeFilter?activity.avatarLikeFilter:activity.filterAvatar?activity.filterAvatar:activity.fromAvatarFilter, activity.fromUserID, activity.id)} style={{"border":"1px solid gainsboro"}} className="btn btn-light btn-sm">Siguiendo</button>
                                    </div>
                                :<div className="col-2" style={{"width":"45px","height":"45px"}} >
                                    <button style={{"backgroundColor":"rgba(var(--d69,0,149,246),1)","border":"rgba(var(--d69,0,149,246),1)","marginTop":"5px"}} onClick={e =>handleFollow(e, activity.fromUserID, userActivity.private)} className="btn btn-primary btn-sm">Seguir</button>
                                </div>:''
                }

            </div>
        );
        else return ''
}

export default Activity;
