import { useEffect, useState } from "react";
import {
	getNotifComments,
	getNotifCommentsOfComments,
	getNotifLikesComments,
	getRequestbyUserNotif,
} from "firebase/client";
import useUser from "./useUser";
import { useRouter } from "next/router";

const useActivityNotif = () => {

    const user = useUser();
    const router = useRouter();
    const [likeNotif, setLikeNotif] = useState("");
    const [commentNotif, setCommentNotif] = useState("");
    const [commentOfCommentNotif, setCommentOfCommentNotif] = useState("");
    const [showNotif, setShowNotif] = useState(false);
    const [requestNotif, setRequestNotif] = useState("");

    useEffect(() => {
        if (router.pathname == "/actividad") {
                setShowNotif(false);
        }
	}, []);

    useEffect(() => {
			let unsubscribe;
			let unsubscribeComment;
			let unsubscribeCommentOfComment;
			let unsubscribeRequestsNotif;
			if (user) {
				unsubscribe = getNotifLikesComments(user.userID, setLikeNotif);
				unsubscribeComment = getNotifComments(user.userID, setCommentNotif);
				unsubscribeCommentOfComment = getNotifCommentsOfComments(
					user.userID,
					setCommentOfCommentNotif
				);
				unsubscribeRequestsNotif = getRequestbyUserNotif(
					user.userID,
					setRequestNotif
				);
			}
			return () =>
				unsubscribe &&
				unsubscribe() &&
				unsubscribeComment &&
				unsubscribeComment() &&
				unsubscribeCommentOfComment &&
				unsubscribeCommentOfComment() &&
				unsubscribeRequestsNotif &&
				unsubscribeRequestsNotif();
		}, [user]);

		useEffect(() => {
			if (router.pathname != "/actividad")
				if (
					likeNotif.length ||
					commentNotif.length ||
					commentOfCommentNotif.length ||
					requestNotif.length
				) {
					setTimeout(() => {
						setShowNotif(true);
					}, 2000);
					setTimeout(() => {
						setShowNotif(false);
					}, 12000);
				}
		}, [likeNotif, commentNotif, commentOfCommentNotif, requestNotif]);

    return {
			likeNotif,
			commentNotif,
			commentOfCommentNotif,
			showNotif,
			requestNotif,
		};
}

export default useActivityNotif
