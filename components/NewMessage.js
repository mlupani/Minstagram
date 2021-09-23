import React, { useEffect, useState } from 'react'
import { getUserByKeyword, getUsersSuggestions } from 'firebase/client';
import styles from '../styles/NewMessage.module.css'
import {useRouter} from 'next/router';

const NewMessage = ({setModalMsg, user}) => {

    const [sugerencias, setSugerencias] = useState(null);
    const router = useRouter()
    const [text, setText] = useState('')
    const [results, setResults] = useState(null)

    useEffect(() => {
        if(user?.userID)
            getUsersSuggestions(user?.userID_firebase).then(setSugerencias)
    }, [user]);

    const handleChange = e => {
        setText(e.target.value)
    }

    useEffect(() =>{
        if(text){
            getUserByKeyword(text, setResults)
        }
        else
            setResults([])
    },[text])

    return (
        <div className="container">
            <div className="row">
                <div className="col-1" style={{"paddingLeft": "10px"}} ><a onClick={(e) => {e.preventDefault(); setModalMsg(false);}} style={{"textDecoration":"none", "color":"black"}}><button style={{"paddingTop":"20px"}} type="button" className="btn-close" aria-label="Close"></button></a></div>
                <div className="col-10" style={{"textAlign":"center","marginTop":"10px"}}><h6>Nuevo mensaje</h6></div>
            </div>
            <div className="row">
                <div className="col-12">
                <div
                    className="col-12"
                    style={{
                        textAlign: "center",
                        paddingRight: "0px !important",
                    }}
                >
                    <textarea
                        onChange={(e) => handleChange(e)}
                        value={text}
                        style={{ fontSize: "13px", marginBottom: '20px' }}
                        rows="1"
                        placeholder="&#x1f50d; Buscar personas"
                        className={`form-control ${styles.textareaclass}`}
                    ></textarea>
                </div>
                </div>
            </div>
            {
                !text ?
                <>
                    <div className="row" style={{textAlign: 'left', marginTop: '10px', marginBottom: '30px'}}>
                        <div className="col-12">
                            Sugerencias
                        </div>
                    </div>
                    {
                        sugerencias?.map((usuario) => {
                            return (<div onClick={() => router.push(`/chat/${usuario.userID}`)}  className="row" key={usuario.userID}>
                            <div className="col-2">
                                <a
                                    style={{ paddingLeft: "0px" }}
                                    className="nav-item nav-link"
                                >
                                    <img
                                        className={`${styles.avatarSug} filter-${usuario?.filter}`}
                                        style={{ cursor: "pointer" }}
                                        alt={usuario ? usuario.avatar : ""}
                                        src={usuario ? usuario.avatar : ""}
                                    ></img>
                                </a>
                            </div>
                            <div
                                className="col-5"
                                style={{
                                    paddingTop: "10px",
                                    fontSize: "12",
                                    cursor: "pointer",
                                }}
                            >
                                <span style={{ fontWeight: "500" }}>
                                    {usuario?.userName}
                                </span>
                                <p className="text-muted">{usuario?.displayName}</p>
                            </div>
                        </div>)
                        })
                    }
                </> :
                    results.length ?
                     results?.filter(us => us.userID !== user.userID).map((usuario) => {
                        return (<div onClick={() => router.push(`/chat/${usuario.userID}`)}  className="row" key={usuario.userID}>
                        <div className="col-2">
                            <a
                                style={{ paddingLeft: "0px" }}
                                className="nav-item nav-link"
                            >
                                <img
                                    className={`${styles.avatarSug} filter-${usuario?.filter}`}
                                    style={{ cursor: "pointer" }}
                                    alt={usuario ? usuario.avatar : ""}
                                    src={usuario ? usuario.avatar : ""}
                                ></img>
                            </a>
                        </div>
                        <div
                            className="col-5"
                            style={{
                                paddingTop: "10px",
                                fontSize: "12",
                                cursor: "pointer",
                            }}
                        >
                            <span style={{ fontWeight: "500" }}>
                                {usuario?.userName}
                            </span>
                            <p className="text-muted">{usuario?.displayName}</p>
                        </div>
                    </div>)
                    }) : ''
            }
        </div>
    )
}

export default NewMessage
