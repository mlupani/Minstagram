import React, { useEffect, useState } from 'react';
import { getUserByDoc } from "firebase/client";
import styles from 'styles/ChatInbox.module.css'
import useUser from 'hooks/useUser'
import useTimeAgo from 'hooks/useTimeAgo'
import { useRouter } from 'next/router'
//import { Circle_selected } from 'components/icons'

const ChatInbox = ({chat, userChat, changeChat, isMobile, usuarioChat}) => {

    const user = useUser()
    const timeAgo = useTimeAgo(chat.createdAt, 'short')
    const router = useRouter()
    const [usuarioChatSel, setUsuarioChatSel] = useState(null)

    useEffect(() => {
        getUserByDoc(usuarioChat, setUsuarioChatSel);
    }, []);

    if(user && usuarioChatSel)
        return (
            <div className={`row ${!isMobile && (userChat?.userID === chat?.fromUserID || userChat?.userID === chat?.toUserID) ? styles.selectedRow : ''}`}
            onClick={isMobile ? () =>router.push(`/chat/${chat.fromUserID == user.userID ? chat.toUserID : chat.fromUserID}`) : () => changeChat(usuarioChatSel)  } style={{"padding":"20px", "fontWeight":`${!chat.view && user.userID == chat.toUserID?'700':'100'}`, cursor: 'pointer'}} >
                <div className="col-3">
                    <img style={{"width":"55px !important","height":"55px !important"}} src={`${chat.fromUserID == user.userID?chat.toUserAvatar:chat.fromUserAvatar}`} className={`${styles.avatar}`} alt="" />
                </div>
                <div className="col-9" style={{textAlign: 'left'}}>
                    <span style={{"fontSize":"14px"}}>{`${chat.fromUserID == user.userID?chat.toUsername:chat.fromUsername}`}</span> <br></br>
                    <small className="text-muted">{chat.message} - {timeAgo.replace("hace","")}</small>
                </div>
                {/* <div className="col" style={{"textAlign":"right","paddingTop":"5px"}}>
                    { !chat.view && user.userID == chat.toUserID?
                        <span style={{"color":"rgba(var(--d69,0,149,246),1)","marginRight":"15px"}}><Circle_selected width="8" height="8" /></span>:''
                    }
                </div> */}
            </div>
        );
    else return ('')
}

export default ChatInbox;
