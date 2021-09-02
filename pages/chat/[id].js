import React, { useEffect, useState } from 'react';
import useUser from 'hooks/useUser'
import Head from 'next/head'
import { Arrow_icon } from 'components/icons'
import { useRouter } from 'next/router'
import styles from 'styles/Chat.module.css'
import MessagesBox from 'components/MessagesBox';
import { getUserByDoc } from 'firebase/client';

const Chat = () => {

    const user = useUser()
    const Router = useRouter()
    const [params, setParams] = useState("");
    const [userChat, setChatUser] = useState("");

    useEffect(() => {
        if (Router.query.id) setParams(Router.query.id);
    }, [Router.query.id]);

    useEffect(() =>{
        if(params)
            getUserByDoc(params, setChatUser)
    },[params])

    return (
        <>
            <Head>
                <title>Chats</title>
                <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                <meta name="robots" content="noimageindex, noarchive"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            {user && userChat &&
                <div className="container" style={{"padding":"0", "display":'flex',"flexDirection":"column"}}>
                    <div className="row" style={{"borderBottom":"1px solid gainsboro","paddingBottom":"5px"}}>
                        <div className="col-1" style={{"paddingLeft": "20px","paddingTop":"5px"}} >
                            <a onClick={() => Router.back()} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a>
                        </div>
                        <div onClick={() => Router.push(`/user/${userChat.userID}`)} className="col-10" style={{"textAlign":"left","marginTop":"7px","paddingRight":"0px !important","display":"flex","marginLeft":"15px"}}>
                            <img className={`${styles.avatar} filter-${userChat.filter}`} alt={userChat.avatar} src={userChat.avatar}></img>
                            <h6 style={{"marginLeft":"15px","paddingTop":"2px"}}>{userChat.userName}</h6>
                        </div>
                    </div>
                    <MessagesBox userChat={userChat} />
                </div>
            }
        </>
    );
}

export default Chat;
