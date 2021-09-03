import { useState, useEffect } from 'react'
import { useRouter } from "next/router"
import { getUserConnected } from 'firebase/client.js'

export const USER_STATES = {
  NOT_LOGGED: null,
  NOT_KNOWN: undefined,
}

const useUser = () => {

    const [user, setUser] = useState(USER_STATES.NOT_KNOWN)
    const router = useRouter()

    const conectarUsuario = async () => {
        await getUserConnected(setUser);
    }

    useEffect(() => {
        conectarUsuario()
    }, [])

    useEffect(() => {
        if(router.pathname !== '/privacy')
            user === USER_STATES.NOT_LOGGED && router.push("/")
    }, [user])

    return user
}

export default useUser;
