import React, { useState, Fragment, useEffect } from 'react';
import useTimeAgo from 'hooks/useTimeAgo'
import styles from 'styles/Chat.module.css'
import { useRouter } from 'next/router'
import { updateViewMessage } from 'firebase/client'

const Message = ({message, contador, setContador, index, countMessages, nameChat, setVistoHace, updateMesageViewAt, user}) => {

    const timeAgo = useTimeAgo(message.createdAt)
    const timeAgoViewAt = useTimeAgo(message.viewAt,'short')
    const [showTimeAgo, setShowTimeAgo] = useState(true)
    const router = useRouter()
    const date_now = Date.now()
    let elapsed_view = Math.abs(message.viewAt - date_now)

    useEffect(() =>{
        if(Array.isArray(contador))
            if(!contador.includes(timeAgo)){
                setShowTimeAgo(true)
                setContador(contador.push(timeAgo))
            }else
                setShowTimeAgo(false)
    },[])

    useEffect(() =>{
        if(user)
            if(index+1 == countMessages && message.view && message.fromUserID == user.userID){
                setVistoHace(elapsed_view>60000?timeAgoViewAt.replace("hace",""):'un momento')
            }
    },[timeAgoViewAt])

    useEffect(() =>{
        if(user){
            if(user.userID == message.toUserID && !message.view){
                updateViewMessage(nameChat, message.id)

                if(index+1 == countMessages){
                    updateMesageViewAt(nameChat, message.id)
                    setVistoHace('')
                }
            }
        }
    },[])
    


    if(user)
        return (
            <Fragment>
                <div className="row" style={{"textAlign":"center", "fontSize":"11px"}}>
                    {
                        showTimeAgo && <p style={{"marginBottom":"5px"}} className="text-muted">{timeAgo}</p>
                    }
                </div>
                {
                    message.fromUserID == user?.userID?
                    <Fragment>
                    <div className="row" style={{"textAlign":"right", "fontSize":"13px","marginBottom":"10px","marginTop":"15px"}}>
                        <p>{message.message}</p>
                    </div>
                    </Fragment>:
                    <div className="row" style={{"textAlign":"left", "fontSize":"13px","marginBottom":"10px","marginTop":"15px"}}>
                        <div className="col-12" style={{"display":"flex"}}>
                            <img onClick={() =>router.push(`/user/${message.fromUserID == user.userID?message.toUserID:message.fromUserID}`)}  className={`${styles.avatar}`} style={{"marginTop":"5px"}} alt={message.fromUserAvatar} src={message.fromUserAvatar}></img>
                            <p style={{"marginLeft":"10px"}}>{message.message}</p>
                        </div>
                    </div>
                }
            </Fragment>
        );
    else
        return ''
}

export default Message;
