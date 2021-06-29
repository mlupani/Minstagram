import React, { useEffect, useState, Fragment, useRef, useCallback } from 'react';
import useUser from 'hooks/useUser'
import Head from 'next/head'
import { Arrow_icon, ImageIcon, Fav_icon } from 'components/icons'
import { useRouter } from 'next/router'
import { getUserByDoc, getChat, addMessageToChat, userIsTyping, addChattoUser, updateMesageViewAt,getChatListen } from 'firebase/client'
import styles from 'styles/Chat.module.css'
import useNearScreen from 'hooks/useNearScreen'
import Message from 'components/Message'
import debounce from "just-debounce-it";
import { sendNotification } from 'services/notifications'

const Chat = () => {

    const user = useUser()
    const Router = useRouter()
    const [params, setParams] = useState('')
    const [userChat, setChatUser] = useState('')
    const [message, setMessage] = useState('')
    const [chat, setChat] = useState([])
    const [nameChat, setNameChat] = useState('')
    const [contador, setContador] = useState([])
    const [vistoHace, setVistoHace] = useState('')
    const scroll = useRef(null)
    const [once, setOnce] = useState(false)
    const [docRef, setDocRef] = useState('')
    const [isPage, setIsPage] = useState(0)
    const [loadingPage, setLoadingPage] = useState(false)
    const {isNearScreen, elementRef} = useNearScreen({distance: '100px', once})
    const references = useRef(new Array())
    const [countResults, setCountResults] = useState(0)
    const [scrolling, setScrolling] = useState(false)
    const [countMessagesSended, setCountMessagesSended] = useState(1)
    const [timeOut, setTimeOut] = useState()

    const debounceSetIsPage = useCallback(debounce(() => setIsPage(prevState => prevState+1),200));
    const debounceGetChat = useCallback(debounce(() => getChat(nameChat, setChat, docRef, setDocRef, setLoadingPage, setCountResults,setScrolling),200));
    const debounceGetChatNew = useCallback(debounce(() => getChatListen(nameChat, setChat, docRef, setDocRef, setLoadingPage, setCountResults, countResults, user, setScrolling),200));

    useEffect(() => {
        if(isNearScreen){
            if(typeof docRef != 'undefined')
                debounceSetIsPage()
            else
                setOnce(true)
        }
    },[isNearScreen])

    useEffect(() => {
        if(Router.query.id)
            setParams(Router.query.id)
    },[Router.query.id])

    useEffect(() =>{
        if(params)
            getUserByDoc(params, setChatUser)
    },[params])

    useEffect(() =>{
        if(userChat?.userID && user?.userID){
            let arrayNames = [userChat.userID, user.userID]
            arrayNames.sort()
            setNameChat(`chat_${arrayNames[0]}_${arrayNames[1]}`)
        }
    },[userChat, user])

    useEffect(() =>{
        if(user && userChat)
        {
            //debounceGetChat()
            let unsubscribe
            unsubscribe = debounceGetChatNew()
            return () => unsubscribe && unsubscribe()
        }
    },[nameChat])

    useEffect(() =>{
        if(user && userChat)
        {
            //setScrolling(true)
            debounceGetChat()
        }
    },[isPage])

    useEffect(() =>{
        if(user && userChat){
            if(message.length == 1 && !user.isTyping)
                userIsTyping(user.userID,true)

            if(message.length == 0 && user.isTyping)
                userIsTyping(user.userID,false)
        }
    }, [message])

    const handleSendMessage = () => {
        setMessage('')
        setVistoHace('')
        setScrolling(false)
        addMessageToChat(message, user, userChat, nameChat).then(() => {

            setCountMessagesSended(prevState => prevState + 1)
            let tiempo = 10000

            clearTimeout(timeOut)

            //MANEJO DE NOTIFICACIONES
            setTimeOut(setTimeout(async () => {
                let title = ''
                if(countMessagesSended > 1 ) title = `Tienes ${countMessagesSended} nuevos mensajes de ${user.userName}`
                else title = `Tienes ${countMessagesSended} nuevo mensaje de ${user.userName}`
                await sendNotification
                (
                    {
                        title: title,
                        message: `${message}`,
                        icon: user.avatar,
                        data: { url: window.location.origin+'/chat/'+user.userID },
                        actions: [{action: "message", title: "Nuevos mensajes"}]
                    },
                    JSON.parse(userChat.subscriptionNotifications)
                )
                setCountMessagesSended(1)
            },tiempo))


            scroll.current.scrollIntoView()
            setScrolling(true)

            if(!user.chats.includes(userChat.userID))
                addChattoUser(user.userID, userChat.userID)

            if(!userChat.chats.includes(user.userID))
                addChattoUser(userChat.userID, user.userID)
        })
    }

    useEffect(() =>{
        if(scroll.current && chat.length && isPage == 1){
            scroll.current.scrollIntoView()
        }
    },[scroll.current, chat])

    useEffect(() =>{
        if(references.current && countResults && isPage > 1 && scrolling){
            references.current[docRef.id].scrollIntoView()
        }
    },[chat])

    return (
        <Fragment>
            <Head>
                <title>Chats</title>
                <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                <meta name="robots" content="noimageindex, noarchive"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            <div id="visor" ref={elementRef}></div>
            {user && userChat &&
                <div className="container" style={{"padding":"0"}}>
                    <div className="row" style={{"borderBottom":"1px solid gainsboro","paddingBottom":"5px"}}>
                        <div className="col-1" style={{"paddingLeft": "20px","paddingTop":"5px"}} >
                            <a onClick={() => Router.back()} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a>
                        </div>
                        <div onClick={() => Router.push(`/user/${userChat.userID}`)} className="col-10" style={{"textAlign":"left","marginTop":"7px","paddingRight":"0px !important","display":"flex","marginLeft":"15px"}}>
                            <img className={`${styles.avatar} filter-${userChat.filter}`} alt={userChat.avatar} src={userChat.avatar}></img>
                            <h6 style={{"marginLeft":"15px","paddingTop":"2px"}}>{userChat.userName}</h6>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-12"  style={{"height":"490px","paddingLeft":"20px", "paddingRight":"30px", "paddingLeft":"20px","paddingTop":"10px","overflowY":`scroll`}}>
                        <div id="observer" ref={elementRef}></div>

                            <div className="col-12" style={{"textAlign":"center"}}>
                                {loadingPage ? <img width="42" height="42" src='/loading.gif'></img>:once?<p style={{"textAlign":"center","fontSize":"13px"}} className="text-muted">No hay mas mensajes para mostrar</p>:''}
                            </div>
                            {
                                chat.length?
                                    chat.map((message, index) => <div id={index}  className={message.id} key={message.id} ref={(element) => references.current[message.id] = element}><Message updateMesageViewAt={updateMesageViewAt} setVistoHace={setVistoHace} index={index} countMessages={chat.length} message={message} contador={contador} setContador={setContador} nameChat={nameChat} user={user} /></div>)
                                    :
                                    !chat.length?'':''
                            }
                            <span ref={scroll}></span>
                        </div>

                        <div style={{"marginRight":"20px", "marginLeft":"20px","paddingLeft":"15px","paddingRight":"40px","fontSize":"12px","position":"static","height":"50px"}} className="col-12">
                            {
                                <Fragment>
                                    <p style={{"textAlign":"right","marginBottom":"1px"}} className="text-muted">{vistoHace?`Visto hace ${vistoHace}`:''}</p>
                                    <p className="text-muted" style={{"marginBottom":"0px"}} >{userChat.isTyping?<span><img className={`${styles.avatar}`} alt={userChat.avatar} src={userChat.avatar}></img>&nbsp;&nbsp;Escribiendo...</span>:''}</p>
                                </Fragment>
                            }
                        </div>
                    </div>
                    <div className="row" style={{"position":"sticky", "bottom":"0","marginRight":"20px", "marginLeft":"20px","border":"1px solid gainsboro","borderRadius":"22px","paddingLeft":"15px","paddingRight":"15px","height":"45px"}}>
                        <div className="input-group col-12">
                            <textarea className="form-control" resizable="false" rows="1" style={{"border":"none","fontSize":"14px","paddingTop":"10px"}} onChange={(e)=>setMessage(e.target.value)} placeholder="Enviar mensaje..." value={message} >
                            </textarea>
                            {
                                message?
                                    <span className="input-group-text" style={{"backgroundColor":"white","padding":"1px !important","border":"none","width":"70px"}}>
                                        <button style={{"textDecoration":"none","fontWeight":"600","fontSize":"13px"}} onClick={handleSendMessage} className="btn btn-sm btn-link">Enviar</button>
                                    </span>:
                                    <span className="input-group-text" style={{"backgroundColor":"white","padding":"1px !important","border":"none","width":"70px"}}>
                                        <span style={{"marginRight":"12px"}}><ImageIcon/></span>
                                        <span><Fav_icon width="21" height="21"/></span>
                                    </span>
                            }
                        </div>
                    </div>
                </div>
            }
        </Fragment>
    );
}

export default Chat;
