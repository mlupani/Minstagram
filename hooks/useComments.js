
import {
	addComment,
	UpdateCommentCountPost,
	addCommentOfComment,
} from "firebase/client.js";
import { useState } from "react";

const useComments = () => {

    const [comentario, setComentario] = useState('')
    const [stateComment, setStateComment] = useState(0);
    const [responseMode, setResponseMode] = useState(null)

    const addComments = (user, post, comentario, postAct) => {
			if (!responseMode) {
				setStateComment(1);
                setComentario("");
				addComment({
					idPost: post.id,
					comment: comentario,
					avatar: user.avatar,
					userID: user.userID,
					userName: user.userName,
					toUserID: postAct.userID,
					img: postAct.img,
					filter: postAct.filter,
				})
					.then(() => {
						UpdateCommentCountPost(post.id, 1);
						setStateComment(null);
					})
					.catch((err) => {
						console.log("error en el addComent " + err);
					});
			} else {
				setStateComment(1);
                setComentario("");
				addCommentOfComment({
					idComment: responseMode.id,
					comment: comentario,
					avatar: user.avatar,
					userID: user.userID,
					userName: user.userName,
					toUserName: responseMode.userName,
					toUserID: responseMode.userID,
					img: postAct.img,
					filter: postAct.filter,
				})
					.then(() => {
						UpdateCommentCountPost(post.id, 1);
						setStateComment(null);
						setResponseMode("");
					})
					.catch((err) => {
						console.log("error en el addComent " + err);
					});
			}
		};


    return {
			addComments,
			stateComment,
			comentario,
			setComentario,
		};
}

export default useComments
