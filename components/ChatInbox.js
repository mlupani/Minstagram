import React from 'react';
import styles from 'styles/ChatInbox.module.css'
import useUser from 'hooks/useUser'
import useTimeAgo from 'hooks/useTimeAgo'
import { useRouter } from 'next/router'
import { Circle_selected } from 'components/icons'

const chatInbox = ({chat}) => {

    const user = useUser()
    const timeAgo = useTimeAgo(chat.createdAt, 'short')
    const router = useRouter()

    if(user)
        return (
            <div className="row" onClick={() =>router.push(`/chat/${chat.fromUserID == user.userID?chat.toUserID:chat.fromUserID}`)} style={{"margin":"20px", "fontWeight":`${!chat.view && user.userID == chat.toUserID?'700':'100'}`}} >
                <div className="col-2">
                    <img style={{"width":"55px !important","height":"55px !important"}} src={`${chat.fromUserID == user.userID?chat.toUserAvatar:chat.fromUserAvatar}`} className={`${styles.avatar}`} alt="" />
                </div>
                <div style={{"marginLeft":"10px"}} className="col-8">
                    <span style={{"fontSize":"14px"}}>{`${chat.fromUserID == user.userID?chat.toUsername:chat.fromUsername}`}</span> <br></br>
                    <small className="text-muted">{chat.message} - {timeAgo.replace("hace","")}</small>
                </div>
                <div className="col-1" style={{"textAlign":"right","paddingTop":"5px"}}>
                    { !chat.view && user.userID == chat.toUserID?
                        <span style={{"color":"rgba(var(--d69,0,149,246),1)","marginRight":"15px"}}><Circle_selected width="8" height="8" /></span>:''
                    }
                </div>
            </div>
        );
    else return ('')
}

export default chatInbox;
