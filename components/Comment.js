import { Fragment, useState } from 'react'
import styles from 'styles/Comment.module.css'
import useTimeAgo from 'hooks/useTimeAgo'
import { Fav_icon, FavFill_icon } from 'components/icons'
import { addLikesComment, removeLikesComments, UpdateLikeCountComment, UpdateLikeCountCommentOfComments } from 'firebase/client.js'
import CommentOfComments from 'components/CommentOfComments'

const Comment = ({id, createdAt, avatar, userName, comment,post=null, likeCount, idPost, userID, likeComment=null, view="full", setResponseMode, children, commentsOfComments, filterAvatar}) => {

    const timeAgo = useTimeAgo(createdAt,'short')
    const [showCommentsOfComments, setShowCommentsOfComments] = useState(false)

    const handleLikeComment = (postID,type, idDoc, idComment, commentofcomments='') => {

        if(type=="add"){
            addLikesComment(idComment, postID, userID)

            if(!commentofcomments)
                UpdateLikeCountComment(idComment,"+1")
            else
                UpdateLikeCountCommentOfComments(idComment,"+1")
        }

        if(type=="remove"){
            removeLikesComments(idDoc)

            if(!commentofcomments)
                UpdateLikeCountComment(idComment,"-1")
            else
                UpdateLikeCountCommentOfComments(idComment,"-1")
        }
    }

    if(view == "full")
        return (
            <div className="row" style={{"marginBottom":"20px"}}>
                <div className="col-1" style={{"marginRight":"15px"}} ><img className={!post?`${styles.avatar} filter-${filterAvatar}`:`${styles.avatar_selected}  filter-${filterAvatar}`} alt={avatar} src={avatar}></img></div>
                <div className="col-10" style={{"paddingLeft":"10px"}}>
                    {
                        <>
                        <div className="col-12"><small style={{"fontWeight":"600","fontSize":"13px"}}>{userName}</small> <small style={{"color":"dimgray","fontSize":"13px"}}>{comment}</small>
                        {!post?
                        <span style={{"float":"right"}} >
                            {likeComment.length && likeComment.filter(likeCom=> likeCom.userIDLike == userID && likeCom.idComment == id).length?
                                likeComment.map(likeCom => {
                                    if(likeCom.userIDLike == userID && likeCom.idComment == id){
                                        return <span key={likeCom.id} style={{"color":"#dc3545"}} onClick={() => handleLikeComment(idPost,'remove',likeCom.id,likeCom.idComment)}><FavFill_icon width="12" height="12" /></span>
                                    }
                                })
                                :
                                <span onClick={() => handleLikeComment(idPost,'add','', id)}><Fav_icon width="12" height="12" /></span>
                            }
                            </span>
                            :''}
                        </div>

                        <div className="col-12" style={{"color":"darkgray","marginBottom":"5px"}} ><small>{timeAgo.replace("hace","")}</small>
                        {!post?
                        <Fragment>
                        {likeCount?<small style={{"paddingLeft":"15px", "fontWeight":"500", "fontSize":"12px"}}>{likeCount} Me gusta</small>:''}
                        <small onClick={()=>setResponseMode({userName,id,userID})} style={{"paddingLeft":"15px", "fontWeight":"500", "fontSize":"12px"}}>Responder</small>
                        </Fragment>:''}
                        </div>
                        </>
                    }

                    {!showCommentsOfComments?
                        commentsOfComments && commentsOfComments.length?
                        <span style={{"color":"gray", "fontSize":"12px","marginTop":"5px", "fontWeight":"500","marginBottom":"10px"}} onClick={()=>setShowCommentsOfComments(true)}>
                            <span style={{"borderBottom":"1px solid gray","verticalAlign":"super", "marginRight":"15px"}} className={"col-1"}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                Ver Respuestas ({commentsOfComments.length}) 
                            </span>:'':''
                    }
                    {
                        showCommentsOfComments?
                            commentsOfComments && commentsOfComments.length?
                        <span style={{"color":"gray", "fontSize":"12px","marginTop":"5px", "fontWeight":"500","marginBottom":"10px"}} onClick={()=>setShowCommentsOfComments(false)}>
                            <span style={{"borderBottom":"1px solid gray","verticalAlign":"super", "marginRight":"15px"}} className={"col-1"}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                Ocultar Respuestas ({commentsOfComments.length}) 
                            </span>:'':''
                    }
                    {
                        commentsOfComments && commentsOfComments.length?
                            commentsOfComments.map(commentario => 
                                <CommentOfComments key={commentario.id} comentarioID={id} userID={userID} commentario={commentario} showCommentsOfComments={showCommentsOfComments} styles={styles} setResponseMode={setResponseMode} likeComment={likeComment} handleLikeComment={handleLikeComment} idPost={idPost} filterAvatar={filterAvatar}  />
                            ):''
                    }
                    {
                        children?'aca van los comentarios de comentarios':''
                    }
                </div>
            </div>
        );
    else
        return (
            <div>
                <span style={{"marginRight":"8px"}} >
                    {userName}
                </span>
                <span style={{"color":"dimgray"}}>{comment}</span>
                {!post?
                    <span style={{"float":"right"}} >
                    {likeComment[0] && idPost == likeComment[0].idPost?
                        <span style={{"color":"#dc3545"}} onClick={() => handleLikeComment(idPost,'remove',likeComment[0].id,likeComment[0].idComment)}><FavFill_icon width="12" height="12" /></span>:
                        <span onClick={() => handleLikeComment(idPost,'add','', id)}><Fav_icon width="12" height="12" /></span>
                    }
                    </span>
                :''}
                <br></br>
            </div>
        )
}

export default Comment;
