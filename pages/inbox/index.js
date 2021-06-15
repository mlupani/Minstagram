import React, { useState, useEffect, Fragment} from 'react';
import { Arrow_icon } from 'components/icons'
import Head from 'next/head'
import useUser from 'hooks/useUser'
import { getLastMsgOfChat } from 'firebase/client'
import ChatInbox from 'components/ChatInbox'
import { useRouter } from 'next/router'

const Inbox = () => {

    const user = useUser()
    const [chats, setChats] = useState([])
    const router = useRouter()
    const [sorted, setSorted] = useState(false)

    useEffect(async () =>{
        if(user){
            let res = []
            let arrayNames
            for await (let userChat of user.chats){
                arrayNames = [userChat, user.userID]
                arrayNames.sort()
                let chat = await getLastMsgOfChat(`chat_${arrayNames[0]}_${arrayNames[1]}`)
                if(chat)
                    res.push(chat)
            }

            setChats(res)
        }
    },[user])

    useEffect(() =>{

        if(chats.length){
            chats.sort((a,b) => b.createdAt - a.createdAt)
            setSorted(true)
        }
    },[chats])

        return (
            <Fragment>
                <Head>
                    <title>Bandeja de entrada</title>
                    <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                    <meta name="robots" content="noimageindex, noarchive"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                    <meta name="mobile-web-app-capable" content="yes"/>
                </Head>
                <div className="container" style={{"padding":"0"}}>
                    <div className="row" style={{"borderBottom":"1px solid gainsboro","paddingBottom":"5px"}}>
                        <div className="col-1" style={{"paddingLeft": "20px","paddingTop":"5px"}} >
                            <a onClick={() => router.back()} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a>
                        </div>
                        <div className="col-9" style={{"textAlign":"center","marginTop":"7px","paddingRight":"0px !important","marginLeft":"15px"}}>
                            <h6 style={{"marginLeft":"15px","paddingTop":"2px"}}>Chats</h6>
                        </div>
                    </div>
                    {
                            sorted && chats.length?
                                chats.map(chat => <ChatInbox key={chat.id} chat={chat} />):''
                    }
                </div>
            </Fragment>
        );
}

export default Inbox;
