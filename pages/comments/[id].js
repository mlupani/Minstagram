import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { addComment, getCommentsbyPost, UpdateCommentCountPost, getPostbyID, getCommentsLikesbyPost, addCommentOfComment, getCommentsOfComment } from 'firebase/client.js'
import useUser from 'hooks/useUser'
import Comment from 'components/Comment'
import styles from 'styles/Comments.module.css'
import { Arrow_icon } from 'components/icons'
import { useRouter } from 'next/router'

const Comments = ({post}) => {

    const user = useUser()
    const textAreaRef = useRef('');
    const [comentario, setComentario] = useState('');
    const [stateComnent, setStateComnent] = useState(null)
    const [comentarios, setComentarios] = useState([])
    const [postAct, setPostAct] = useState('')
    const [postLikesComments, setPostLikesComments] = useState('')
    const router = useRouter();
    const [responseMode, setResponseMode] = useState('')
    const [commentsOfComments, setCommentsOfComments] = useState('')
    const [infoPost, setInfoPost] = useState('')

    useEffect(() =>{
        let unsubscribe
        let unsubscribePost
        let unsubscribepostLikesComments
        if(user){
            unsubscribe = getCommentsbyPost(post.id,setComentarios);
            unsubscribePost = getPostbyID(post.id,setPostAct);
            unsubscribepostLikesComments = getCommentsLikesbyPost(post.id, setPostLikesComments)
        }
        return () => unsubscribe && unsubscribePost && unsubscribe() && unsubscribePost() && unsubscribepostLikesComments && unsubscribepostLikesComments()
    },[user])

     useEffect(()=>{
        let unsubscribegetCommentsOfComment
        let arrayIds
        if(comentarios.length){
            arrayIds = comentarios.map(comment=> comment.id)
        }

        if(arrayIds && arrayIds.length){
            unsubscribegetCommentsOfComment = getCommentsOfComment(arrayIds, setCommentsOfComments, commentsOfComments)
        }

        return () => unsubscribegetCommentsOfComment && unsubscribegetCommentsOfComment()
    },[comentarios])


    useEffect(() =>{
        
        if(responseMode.userName){
            setComentario("@"+responseMode.userName+" ")
            textAreaRef.current.focus()
        }

        if(!responseMode){
            setComentario('')
            textAreaRef.current.focus()
        }

    },[responseMode])

    const handleEvent = e => {

        if(!responseMode)
        {
            setStateComnent(1)
            addComment({
                idPost: post.id,
                comment: comentario,
                avatar: user.avatar,
                userID: user.userID,
                userName: user.userName,
                toUserID: postAct.userID,
                img: postAct.img,
                filter: postAct.filter
            })
            .then(() => {
                UpdateCommentCountPost(post.id, 1)
                setComentario('')
                setStateComnent(null)
            }).catch(err => {
                console.log("error en el addComent "+err)
            })
        }
        else{
            setStateComnent(1)
            addCommentOfComment({
                idComment: responseMode.id,
                comment: comentario,
                avatar: user.avatar,
                userID: user.userID,
                userName: user.userName,
                toUserName: responseMode.userName,
                toUserID: responseMode.userID,
                img: postAct.img,
                filter: postAct.filter
            })
            .then(() => {
                UpdateCommentCountPost(post.id, 1)
                setComentario('')
                setStateComnent(null)
                setResponseMode('')
            }).catch(err => {
                console.log("error en el addComent "+err)
            })
        }
    }

    return (
        <>
        <Head>
            <title>Comentarios de foto </title>
            <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
            <meta name="robots" content="noimageindex, noarchive"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
            <meta name="mobile-web-app-capable" content="yes"/>
        </Head>
        <div className="container" style={{"position": "sticky", "backgroundColor": "white", "top":"0px"}}>
            <div className="row" style={{"marginBottom":"10px", "border":"1px solid lightgrey"}}>
                <div className="col-1" style={{"paddingLeft": "20px", "cursor":"pointer"}} ><a onClick={() => router.back()} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a></div>
                <div className="col-9" style={{"textAlign":"center","marginTop":"7px"}}><h5>Comentarios</h5></div>
            </div>
            <div className="row" style={{"borderBottom":"1px solid lightgrey", "paddingBottom":"15px"}}>
                {user && <div className="col-1" style={{"marginRight":"15px"}} ><img className={`${styles.avatar} filter-${user.filter}`} alt={user?.avatar} src={user?.avatar}></img></div>}
                <div className="col-10" style={{"display":"flex"}}>
                    <textarea style={{"fontSize":"14px","resize":"none"}} ref={textAreaRef} value={comentario} onChange={e => setComentario(e.target.value)} className="form-control" rows="1" placeholder="Agrega un comentario..." aria-label="Comentario" aria-describedby="basic-addon2"></textarea>
                    <div style={{"border":"1px solid lightgrey","height":"38px"}} className="input-group-append">
                        <button style={{"fontSize":"13px"}} onClick={handleEvent} disabled={!comentario || stateComnent == 1?'disabled':''} className="btn btn-link" style={{"textDecoration":"none"}} type="button">Publicar</button>
                    </div>
                </div>
            </div>
            {responseMode &&
                <div className="row" style={{"borderBottom":"1px solid lightgrey"}}>
                    <div className="col-12">
                        <ul className="list-group" style={{"fontSize":"13px"}} >
                            <li className="list-group-item" style={{"border":"0", "color":"gray"}}>
                                Respondiendo a {responseMode.userName}
                                <button style={{"float":"right"}} onClick={()=>setResponseMode('')} type="button" className="btn-close" aria-label="Close"></button>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </div>
        <div className="container" style={{"marginTop":"10px"}}>
            {
                postAct &&
                    <Comment
                    key={postAct.id}
                    createdAt={postAct.createdAt}
                    avatar={postAct.avatar}
                    userName={postAct.userName}
                    comment={postAct.content}
                    filterAvatar={postAct.filterAvatar}
                    post="1"
                    />
            }

            {
                comentarios.map(({id, createdAt, avatar, userName, comment, likeCount, filterAvatar}) => (
                    <Comment
                    key={id}
                    createdAt={createdAt}
                    avatar={avatar}
                    userName={userName}
                    comment={comment}
                    post={null}
                    likeCount={likeCount}
                    id={id}
                    idPost={post.id}
                    userID={user.userID}
                    likeComment={postLikesComments? postLikesComments.filter(like => like.idPost == post.id):''}
                    setResponseMode={setResponseMode}
                    filterAvatar={filterAvatar}
                    commentsOfComments={commentsOfComments?commentsOfComments.filter(comment => comment.idComment == id):''}
                    />
                    )
                )
            }
        <br></br>
        </div>
        </>
    );
}

//SERVER SIDE RENDERING
export const getServerSideProps = ({params}) => {

    const post = {id: params.id}

    return {
        props: {
            post: post
        }
    }
}

export default Comments;
