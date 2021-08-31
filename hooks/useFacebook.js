import { useState } from "react";
import { desvinculateFacebook, updateProvidersUser, vinculateFacebook } from "firebase/client";

const useFacebook = () => {

    const [loadingFacebookLink, setLoadingFacebookLink] = useState("");

    const handleFacebook = (e, type, user) => {
        e.preventDefault();

        if (type == "vincular") {
            setLoadingFacebookLink("Vinculando...");
            vinculateFacebook(user.userID).then(() => {
                updateProvidersUser(user.userID, "facebook.com", "vincular");
                setLoadingFacebookLink("Vinculado");
            });
        }

        if (type == "desvincular") {
            setLoadingFacebookLink("Desvinculando...");
            desvinculateFacebook(setLoadingFacebookLink, user.userID).then(() => {
                updateProvidersUser(user.userID, "facebook.com", "desvincular");
                setLoadingFacebookLink("Desvinculado");
            });
        }
    };


    return {
        handleFacebook,
        loadingFacebookLink
    }
}

export default useFacebook
