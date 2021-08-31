import { useEffect, useState } from "react";
import {
	sendFollowRequest,
	UpdatefollowUser,
	removeFollowRequest,
	RemovefollowUser,
    getUserByDoc,
} from "firebase/client";
import useUser from "./useUser";
import { useRouter } from "next/router";
import { sendNotification } from "services/notifications";


const useFollows = () => {

    const Router = useRouter();
    const [user, setUser] = useState("");
    const userAct = useUser();
    const [params, setParams] = useState(null);
    const [FollowRequest, setFollowRequest] = useState(false);

    useEffect(() => {
        if(Router.query.id)
            setParams(Router.query.id)
    },[Router.query.id])

    useEffect(() =>{
        let unsubscribeUser

        if(params)
            unsubscribeUser = getUserByDoc(params, setUser)

        return () => unsubscribeUser && unsubscribeUser()
    },[userAct, params])

    const handleFollow = async (e, userFollowed, privacy) => {
			//COMPROBAR PRIVACIDAD DEL POSIBLE FOLLOW PARA VER SI AGREGO O NO A MIS FOLLOWS
			if (!privacy) {
				UpdatefollowUser(userAct.userID, userFollowed);
				sendFollowRequest(
					userFollowed,
					userAct.userID,
					userAct.userName,
					userAct.displayName,
					userAct.avatar,
					userAct.filter,
					true
				).then(async () => {
					await sendNotification(
						{
							title: "Tienes un nuevo seguidor",
							message: `${userAct.userName} te esta siguiendo.`,
							icon: userAct.avatar,
							data: { url: window.location.origin + "/actividad/" },
							actions: [
								{ action: "follow", title: "Notificacion de seguimiento" },
							],
						},
						JSON.parse(user.subscriptionNotifications)
					);
				});
			} else {
				setFollowRequest(true);
				sendFollowRequest(
					userFollowed,
					userAct.userID,
					userAct.userName,
					userAct.displayName,
					userAct.avatar,
					userAct.filter
				).then(async () => {
					setFollowRequest(false);
					await sendNotification(
						{
							title: "Nueva solicitud de amistad",
							message: `${userAct.userName} quiere seguirte.`,
							icon: userAct.avatar,
							data: { url: window.location.origin + "/actividad/" },
							actions: [
								{ action: "follow", title: "Notificacion de seguimiento" },
							],
						},
						JSON.parse(user.subscriptionNotifications)
					);
				});
			}
		};

		const handleCancelFollow = (userFollowed, requested, callback) => {
			if (requested) {
				removeFollowRequest(requested).then(() => {
					RemovefollowUser(userAct.userID, userFollowed);
					callback(false);
				});
			} else {
				RemovefollowUser(userAct.userID, userFollowed);
				callback(false);
			}
		};

    return {
			handleFollow,
			handleCancelFollow,
			userAct,
			user,
			FollowRequest,
		};
}

export default useFollows
