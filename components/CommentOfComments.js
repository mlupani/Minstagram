import React, { Fragment } from 'react'
import useTimeAgo from 'hooks/useTimeAgo'
import Link from 'next/link'
import { Fav_icon, FavFill_icon } from 'components/icons'

const CommentOfComments = ({commentario, showCommentsOfComments, userID, styles, setResponseMode, comentarioID, likeComment, handleLikeComment, idPost, filterAvatar}) => {

    const timeAgo = useTimeAgo(commentario.createdAt,'short')

    //if(likeComment) console.log(likeComment.map(likeCom=> {if(likeCom.userIDLike == userID && likeCom.idComment == commentario.id) return likeCom.id}))

    return (
        <Fragment key={commentario.id}>
            <div  style={{"marginBottom":"8px","marginTop":"10px"}} className={`row ${!showCommentsOfComments?'d-none':'' } `}>
                <div className="col-2">
                    <img className={commentario.userID == userID?`${styles.avatar_selected} filter-${filterAvatar}`:`${styles.avatar} filter-${filterAvatar}`} alt={commentario.avatar} src={commentario.avatar}></img>
                </div>
                <div className="col-9">
                <small style={{"fontWeight":"600","fontSize":"13px", "paddingRight":"5px"}}>{commentario.userName}</small> 
                <small style={{"color":"dimgray","fontSize":"13px"}}><Link href={'/user/[id]'} as={`/user/${commentario.toUserID}`} ><a style={{"textDecoration":"none"}}>{commentario.comment.substring(commentario.comment.search("@"+commentario.toUserName),commentario.toUserName.length+1)}</a></Link>{commentario.comment.replace('@'+commentario.toUserName,'')}</small>
                </div>
                <div className="col-1" style={{"float":"right"}} >
                    {likeComment.length && likeComment.filter(likeCom=> likeCom.userIDLike == userID && likeCom.idComment == commentario.id).length?
                        likeComment.map(likeCom => {
                            if(likeCom.userIDLike == userID && likeCom.idComment == commentario.id){
                                return <span key={likeCom.id} style={{"color":"#dc3545","float":"right"}} onClick={() => handleLikeComment(idPost,'remove',likeCom.id,likeCom.idComment,"commentofcomments")}><FavFill_icon width="12" height="12" /></span>
                            }
                        })
                        :
                        <span style={{"float":"right"}} onClick={() => handleLikeComment(idPost,'add','', commentario.id,"commentofcomments")}><Fav_icon width="12" height="12" /></span>
                    }
                </div>
                <div className="col-10" style={{"fontSize":"14px", "color":"darkgray","marginLeft":"44px"}}>
                    <small>{timeAgo.replace("hace",'')}</small>
                    {commentario.likeCount?<small style={{"paddingLeft":"15px", "fontWeight":"500", "fontSize":"12px"}}>{commentario.likeCount} Me gusta</small>:''}
                    <small onClick={()=>setResponseMode({userName:commentario.userName, id:comentarioID, userID:commentario.userID})} style={{"paddingLeft":"15px", "fontWeight":"500", "fontSize":"12px"}}>Responder</small>
                </div>
            </div>
        </Fragment>
    );
}

export default CommentOfComments;
