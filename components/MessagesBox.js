import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
	addMessageToChat,
	userIsTyping,
	addChattoUser,
	updateMesageViewAt,
	getChatListen,
} from "firebase/client";
import { ImageIcon, Fav_icon } from "components/icons";
import debounce from 'lodash.debounce'
import useUser from 'hooks/useUser';
import Message from "components/Message";
import { sendNotification } from "services/notifications";
import styles from 'styles/MessagesBox.module.css'

const MessagesBox = ({userChat}) => {

    const user = useUser();
    const [contador, setContador] = useState([])
    const [message, setMessage] = useState('')
    const [chat, setChat] = useState([])
    const [nameChat, setNameChat] = useState('')
    const [vistoHace, setVistoHace] = useState('')
    const scroll = useRef(null)
    const references = useRef(new Array())
    const [countMessagesSended, setCountMessagesSended] = useState(1)
    const [timeOut, setTimeOut] = useState()

    const debounceGetChatNew = useCallback(debounce(() => getChatListen(nameChat, setChat),200));

    useEffect(() =>{
        if(userChat?.userID && user?.userID){
            let arrayNames = [userChat.userID, user.userID]
            arrayNames.sort()
            setNameChat(`chat_${arrayNames[0]}_${arrayNames[1]}`)
        }
    },[userChat, user])

    useEffect(() =>{
        let unsubscribe
        if(user && userChat)
        {
            unsubscribe = debounceGetChatNew()
        }
        return () => unsubscribe && unsubscribe();
    },[nameChat])

    useEffect(() =>{
        if(user){
            if(message.length == 1 && !user?.isTyping)
                userIsTyping(user.userID,true)

            if(message.length == 0 && user.isTyping)
                userIsTyping(user.userID,false)
        }
    }, [message])

    const handleSendMessage = (e) => {
        e.preventDefault();
        setMessage('')
        setVistoHace('')
        addMessageToChat(message, user, userChat, nameChat).then(() => {

            setCountMessagesSended(prevState => prevState + 1)
            let tiempo = 10000

            clearTimeout(timeOut)

            //MANEJO DE NOTIFICACIONES
            setTimeOut(setTimeout(async () => {
                let title = ''
                if(countMessagesSended > 1 ) title = `Tienes ${countMessagesSended} nuevos mensajes de ${user.userName}`
                else title = `Tienes ${countMessagesSended} nuevo mensaje de ${user.userName}`
                await sendNotification(
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

            if(!user.chats.includes(userChat.userID))
                addChattoUser(user.userID, userChat.userID)

            if(!userChat.chats.includes(user.userID))
                addChattoUser(userChat.userID, user.userID)
        })
    }

    useEffect(() => {
        if(scroll.current){
            scroll.current.scrollIntoView()
        }
    },[chat, userChat])

    return (
			<>
				<div className="row">
					<div
						className="col-12"
						style={{
							height: "490px",
							paddingLeft: "20px",
							paddingRight: "30px",
							paddingTop: "10px",
							overflowY: `scroll`,
						}}
					>
						{chat.length
							? chat.map((message, index) => (
									<div
										id={index}
										className={message.id}
										key={message.id}
										ref={(element) =>
											(references.current[message.id] = element)
										}
									>
										<Message
											updateMesageViewAt={updateMesageViewAt}
											setVistoHace={setVistoHace}
											index={index}
											countMessages={chat.length}
											message={message}
											contador={contador}
											setContador={setContador}
											nameChat={nameChat}
											user={user}
										/>
									</div>
							  ))
							: !chat.length
							? ""
							: ""}
						<span ref={scroll}></span>
					</div>

					<div
						style={{
							marginRight: "20px",
							marginLeft: "20px",
							paddingLeft: "15px",
							paddingRight: "40px",
							fontSize: "12px",
							position: "static",
							height: "50px",
						}}
						className="col-12"
					>
						{userChat ? (
							<>
								<p
									style={{ textAlign: "right", marginBottom: "1px" }}
									className="text-muted"
								>
									{vistoHace ? `Visto hace ${vistoHace}` : ""}
								</p>
								<p className="text-muted" style={{ marginBottom: "0px" }}>
									{userChat.isTyping ? (
										<span>
											<img
												className={`${styles.avatar}`}
												alt={userChat.avatar}
												src={userChat.avatar}
											></img>
											&nbsp;&nbsp;Escribiendo...
										</span>
									) : (
										""
									)}
								</p>
							</>
						) : (
							""
						)}
					</div>
				</div>
                {
                    userChat ? 
                
                    <div
                        className="row"
                        style={{
                            position: "sticky",
                            bottom: "0",
                            marginRight: "20px",
                            marginLeft: "20px",
                            border: "1px solid gainsboro",
                            borderRadius: "22px",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            height: "45px",
                        }}
                    >
                        <div className="input-group col-12">
                            <textarea
                                className={`form-control ${styles.textMensaje}`}
                                resizable={"false"}
                                rows="1"
                                style={{ border: "none", fontSize: "14px", paddingTop: "10px" }}
                                onKeyPress={(e) => e.key === 'Enter' && message.trim() ?  handleSendMessage(e) : ''}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enviar mensaje..."
                                value={message}
                            ></textarea>
                            {message ? (
                                <span
                                    className="input-group-text"
                                    style={{
                                        backgroundColor: "white",
                                        padding: "1px !important",
                                        border: "none",
                                        width: "70px",
                                    }}
                                >
                                    <button
                                        style={{
                                            textDecoration: "none",
                                            fontWeight: "600",
                                            fontSize: "13px",
                                        }}
                                        onClick={handleSendMessage}
                                        className="btn btn-sm btn-link"
                                    >
                                        Enviar
                                    </button>
                                </span>
                            ) : (
                                <span
                                    className="input-group-text"
                                    style={{
                                        backgroundColor: "white",
                                        padding: "1px !important",
                                        border: "none",
                                        width: "70px",
                                    }}
                                >
                                    <span style={{ marginRight: "12px" }}>
                                        <ImageIcon />
                                    </span>
                                    <span>
                                        <Fav_icon width="21" height="21" />
                                    </span>
                                </span>
                            )}
                        </div>
                    </div> : ''
                }
			</>
		);
}

export default MessagesBox
