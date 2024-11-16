import { useState } from "react";
import { desvinculateGoogle, updateProvidersUser, vinculateGoogle } from "firebase/client";

const useGoogle = () => {

    const [loadingGoogleLink, setLoadingGoogleLink] = useState("");

    const handleGoogle = (e, type, user) => {
        e.preventDefault();

        if (type == "vincular") {
            setLoadingGoogleLink("Vinculando...");
            vinculateGoogle(user.userID).then(() => {
                updateProvidersUser(user.userID, "Google.com", "vincular");
                setLoadingGoogleLink("Vinculado");
            });
        }

        if (type == "desvincular") {
            setLoadingGoogleLink("Desvinculando...");
            desvinculateGoogle(setLoadingGoogleLink, user.userID).then(() => {
                updateProvidersUser(user.userID, "Google.com", "desvincular");
                setLoadingGoogleLink("Desvinculado");
            });
        }
    };


    return {
        handleGoogle,
        loadingGoogleLink
    }
}

export default useGoogle
