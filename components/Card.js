import React, { useState,  useEffect } from 'react'
import { addPostToFav, removePostToFav, addPostToSaves, removePostSaves, deletePost, getCommentsLikesbyPost, RemovefollowUser,deleteImage, getLikesByPost, getCommentsByPost, getPostbyID } from 'firebase/client'
import useTimeAgo from 'hooks/useTimeAgo'
import Link from 'next/link'
import styles from 'styles/Card.module.css'
import { Fav_icon, Chat_icon, Share_icon, Bookmark_icon, FavFill_icon, Bookmark_icon_saved } from 'components/icons'
import { useDoubleTap } from 'use-double-tap';
import ModalWindow from 'components/ModalWindow'
import Comment from 'components/Comment'
import router from 'next/router'
import useUser from 'hooks/useUser'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'
import useComments from 'hooks/useComments'
import useDevice from "hooks/useDevice";

const Card = ({createdAt, userName, img, content, id, avatar, userID, likesUser, comments, place, savesUser, actualUserID, filter }) => {

    const user = useUser();
    const timeAgo = useTimeAgo(createdAt)
    const isMobile = useDevice();
    const {comentario, setComentario, stateComment, addComments} = useComments();
    const [IDfav, setIDfav] = useState('')
    const [stateFav, setStateFav] = useState('')
    const [viewDesc, setViewDesc] = useState(false)
    const [IDSave, setIDSave] = useState('')
    const [modalShow, setModalShow] = useState(false)
    const [postLikesComments, setPostLikesComments] = useState('')
    const [likeCount, setLikeCount] = useState([])
    const [commentCount, setCommentCount] = useState([])
    const [postAct, setPostAct] = useState('')

    useEffect(() => {

        let unsubscribepostLikesComments
        let unsubscribeLikes
        let unsubscribeComments

        unsubscribeLikes = getLikesByPost(id, setLikeCount)
        unsubscribeComments = getCommentsByPost(id, setCommentCount)
        unsubscribepostLikesComments = getCommentsLikesbyPost(id, setPostLikesComments)

        likesUser.map(like => {
            if(like.idPost == id){
                setIDfav(like.id)
            }
        })

        savesUser && savesUser.map(save => {
            if(save.idPost == id){
                setIDSave(save.id)
            }
        })

        return () => {
            unsubscribepostLikesComments && unsubscribepostLikesComments()
            unsubscribeLikes && unsubscribeLikes()
            unsubscribeComments && unsubscribeComments()
        }

    },[likesUser, stateFav, savesUser])

    useEffect(() => {
        let unsubscribePost
        if(user){
            unsubscribePost = getPostbyID(id,setPostAct);
        }
        return () => unsubscribePost && unsubscribePost()
    }, [user]);

    const favDoubleTap = useDoubleTap(() => {

        setStateFav(1)
        setTimeout(() => {
            setStateFav('')
        }, 1500);

        if(!IDfav){
            if(user)
                addPostToFav(id, userName, avatar, userID, user.userID, user.avatar, img, user.filter)
        }
    });

    const handleCancelFollow = (userFollowed) => {
        RemovefollowUser(user.userID, userFollowed);
        setModalShow(false)
        router.reload()
    }

    const handleLikeCount = (e,type) =>{

        if(type=="Add"){
            if(e.type =="dblclick")
                setStateFav(1)

            if(user)
                addPostToFav(id, userName, avatar, userID, user.userID, user.avatar, img, user.filter )
        }

        if(type=="Remove"){
            setIDfav('')
            removePostToFav(IDfav).then(() => {
                //console.log("Doc Eliminado")
            }).catch((error) => {
                console.error("Error al borrar el documento: ", error);
            });
        }

        setTimeout(() => {
            setStateFav('')
        }, 1500);

    }

    const handleDelPost = (e, idPost) => {

        img.forEach(img => {
            deleteImage(img.name)
        })

        deletePost(idPost)
        if(IDSave)
            removePostSaves(IDSave)
        setModalShow(false)

        if(router.pathname == "/status/[id]")
            router.push("/home")
    }

    const handleBookmark = (idPost, type, img,filter) => {
        if(type == "add"){
            addPostToSaves(idPost, userID, img, filter)
            setIDSave(idPost)
        }
        if(type=="remove"){
            removePostSaves(IDSave)
            setIDSave('')
        }
    }

    return (
        <div className="row justify-content-center">
           <div className={styles.flexCol} style={{"paddingRight":"0px"}}>
                <div className={`${styles.card}`} style={{"paddingLeft":'0px',"paddingRight":'0px'}}>
                    <div className="card-header" >
                        <div className={`${styles.rowContainer}`}>
                            <div className='col col-1' style={{"paddingLeft":"5px"}}>
                            <Link href={'/user/[id]'} as={`/user/${userID}`} >
                                <a>
                                    <img width="100%" height="auto" className={`${styles.avatar} filter-${user?.filter}`} alt={avatar} src={avatar}></img>
                                </a>
                            </Link>
                            </div>
                            <div className="col col-lg-8" style={{'paddingLeft':'22px','paddingTop':`${place?'0px':'5px'}`}}>
                            <Link href={'/user/[id]'} as={`/user/${userID}`} >
                                <a style={{"textDecoration":"none","color":"inherit"}}>{userName}</a>
                            </Link>
                            {
                                place && <p className="text-muted" style={{"fontSize":"11px"}}>{place?place:''}</p>
                            }
                            </div>
                            <div className="col-1" style={{"marginTop":"-10px","textAlign":"right"}}>
                                <a style={{"color":"black", "textDecoration":"none", "fontSize":"25px"}} onClick={(e)=>{e.preventDefault();setModalShow(true)}} href="#">...</a>
                                <ModalWindow show={modalShow}>
                                        <div className="row">
                                            <div className="col-12">
                                                <ul className="list-group lista_modal" style={{"padding":"0px","margin":"0px","borderRadius":"1rem !important"}}>
                                                    {userID == actualUserID && <li onClick={(e)=>handleDelPost(e, id)} style={{"color":"red", "fontWeight":"bold"}} className="list-group-item">Eliminar</li>}
                                                    {userID != actualUserID && user?.followsCount?.includes(userID) && <li onClick={()=>handleCancelFollow(userID)} style={{"color":"red", "fontWeight":"bold"}} className="list-group-item">Dejar de seguir</li>}
                                                    <li className="list-group-item"><Link href='/status/[id]' as={`/status/${id}`}><a style={{"textDecoration":"none","cursor":"pointer","color":"black"}}>Ir a publicaci&oacute;n</a></Link></li>
                                                    <li onClick={()=>setModalShow(false)} className="list-group-item">Cancelar</li>
                                                </ul>
                                            </div>
                                        </div>
                                </ModalWindow>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.containerImg}`}>
                        {img.length > 1?
                            <Carousel emulateTouch={true} infiniteLoop={true} dynamicHeight={true} showThumbs={false} showIndicators={true} showStatus={true} >
                                {img.map(img =>
                                    <div className={`filter-${img.filterApplied.toLowerCase()}`} key={img.img} >
                                        <img  src={img.img} />
                                    </div>
                                )}
                            </Carousel>:
                        img && img.length == 1?
                        <figure style={{"marginBottom":"0px"}}  {...favDoubleTap} className={`filter-${img[0].filterApplied.toLowerCase()}`}>
                            <img width="100%" height="auto"  src={img[0].img} className="card-img-top img-fluid" alt="507405.jpg"  />
                        </figure>: 'Loading img..'
                        }
                        <a style={{"textDecoration":"none", "color":"white"}}><div className={`container ${stateFav?styles.alertShown:styles.alertHidden}`}><FavFill_icon width="50" height="50" /></div></a>
                    </div>
                    <div className="card-body" style={{"fontSize":"13px","paddingRight":"1.5rem !important"}}>
                        <div className="row">
                            <div className="col-10">
                                {
                                    IDfav?<a onClick={(e)=>handleLikeCount(e,'Remove')} style={{"textDecoration":"none", "color":"#dc3545","cursor":"pointer"}}><FavFill_icon/>&nbsp;&nbsp;&nbsp;</a>:
                                    <a onClick={(e)=>handleLikeCount(e,'Add')} style={{"textDecoration":"none", "color":"black","cursor":"pointer","paddingRight": "12px"}}><Fav_icon/></a>
                                }

                                {
                                    isMobile ?
                                    <Link href={`/comments/[id]`} as={`/comments/${id}`}>
                                        <a style={{"textDecoration":"none", "color":"black"}}><Chat_icon/>&nbsp;&nbsp;</a>
                                    </Link> :
                                    <Link href='/status/[id]' as={`/status/${id}`}>
                                        <a style={{"textDecoration":"none", "color":"black"}}><Chat_icon/>&nbsp;&nbsp;</a>
                                    </Link>
                                }

                                <Share_icon/>
                            </div>
                            {
                                IDSave?<div onClick={() => handleBookmark('','remove','')} className="col-2" style={{"textAlign":"right"}}>
                                            <Bookmark_icon_saved />
                                        </div>:
                                        <div onClick={() => handleBookmark(id,'add',img,filter)} className="col-2" style={{"textAlign":"right"}}>
                                            <Bookmark_icon />
                                        </div>
                            }
                        </div>
                        <p style={{"marginBottom":"2px","fontSize":"14px"}} className="card-text">{likeCount.length} Me gusta</p>
                        <p style={{"marginBottom":"10px"}} className="card-text" ><span style={{"fontWeight":"bold", "marginRight":"5px"}}>{userName}</span>
                            <span>{content.length > 90 && !viewDesc? (<>{content.substring(1,90)} <a onClick={()=>setViewDesc(true)}>...Ver Mas</a></>):content}</span>
                        </p>
                        {
                            commentCount.length > 2?
                            <Link href="/comments/[id]" as={`/comments/${id}`} >
                                <p className="card-text text-muted" style={{"color":"gray", "marginBottom":"2px"}}>
                                    Ver los {commentCount.length} comentarios
                                </p>
                            </Link>:''
                        }
                        {
                            comments && comments.map((comment, index) => {
                                if(index < 2){
                                    return (
                                        <Comment
                                            key={comment.id}
                                            createdAt={comment.createdAt}
                                            avatar={comment.avatar}
                                            userName={comment.userName}
                                            comment={comment.comment}
                                            post={null}
                                            likeCount={comment.likeCount}
                                            id={comment.id}
                                            idPost={id}
                                            userID={userID}
                                            view="min"
                                            likeComment={postLikesComments? postLikesComments.filter(like => like.idComment == comment.id):''}
                                        />
                                    )
                                }
                                        //likeComment={postLikesComments? postLikesComments.filter(like => like.idComment == id):''}

                                    /*
                                        return <div key={index}><span style={{"marginRight":"8px"}} >{comment.userName}</span><span style={{"color":"dimgray"}}>{comment.comment}</span><span style={{"float":"right"}} ><Fav_icon width="12" height="12" /></span><br></br></div>
                                    */
                            })

                        }
                        <Link href='/status/[id]' as={`/status/${id}`}>
                            <a style={{"textDecoration":"none"}} className="card-text"><small className="text-muted">{timeAgo}</small></a>
                        </Link>
                    </div>

                <div className={`row ${styles.flexComment}`} style={{height: '50px'}}>
                    <div className="col-10">
                        <textarea style={{height: '50px', 'borderRight': 'none', 'borderLeft': 'none', 'borderBottom': 'none', "resize" : "none", paddingTop: '10px'}} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Agrega un comentario..." className="form-control"></textarea>
                    </div>
                    <div className="col-2">
                        <div  style={{"borderTop":"1px solid lightgrey","height":"50px","textAlign": 'center', 'justifyContent':'center', 'display':'flex'}} className="input-group-append">
                            <button style={{"fontSize":"13px", 'alignSelf':'center', "textDecoration":"none"}} onClick={() => addComments(user, postAct, comentario, postAct)} disabled={!comentario || stateComment == 1?'disabled':''} className="btn btn-link" type="button">Publicar</button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
