import { useEffect, useState, Fragment, Suspense, lazy, useCallback } from 'react'
import { getLatestPostsFollows, getCommentsbyPostArray, getLikesUser, getPostsSaved, getLatestPostsFollowsPagination, updateSubscriptionNotifications } from 'firebase/client'
import Head from 'next/head'
import Header from 'components/Header'
import useUser from 'hooks/useUser'
import useNearScreen from 'hooks/useNearScreen'
import debounce from "just-debounce-it";
import { subscribeNotifications } from 'services/notifications'

const Card = lazy(() => import('components/Card'))

export const Home = ({registration}) => {

    const user = useUser()
    const [posts, setPosts] = useState('')
    const [likesUser, setLikesUser] = useState([])
    const [idPostsComments, setidPostsComments] = useState([]);
    const [commentsPosts, setcommentsPosts] = useState();
    const [savesUser, setSavesUser] = useState('')
    const [isPage, setIsPage] = useState(0)
    const [lastVisible, setLastVisible] = useState('')
    const [loadingPage, setLoadingPage] = useState(false)
    const [once, setOnce] = useState(false)
    const {isNearScreen, elementRef} = useNearScreen({distance: '100px', once})
    //USO DEBOUNCE CON USECALLBACK PARA LLAMAR UNA VEZ A LA REFERENCIA DEL SETISPAGE PARA LLAMARLO SOLO UNA CANTIDAD LIMITADA DE VECES
    const debounceSetIsPage = useCallback(debounce(() => setIsPage(prevState=> prevState+1),200));
    const [subscriptionNotifications, setSubscriptionNotifications] = useState(null)

    useEffect(() => {
        if(isNearScreen){
            //SI NO TENGO MAS ID DE DOCUMENTOS PARA LISTAR, DEJO DE LISTAR Y DESCONECTO EL INTERSECTION OBSERVER
            if(typeof lastVisible != 'undefined')
                debounceSetIsPage()
            else
                setOnce(true)
        }
    },[isNearScreen])

    useEffect(() =>{
        localStorage.removeItem("imgUpload");
        let unsubscribe
        let unsubscribeLikes
        let unsubscribeSaves

        if(user){
            unsubscribe = getLatestPostsFollows(user.followsCount, user.userID, setPosts, setLastVisible, isPage, posts.length);
            unsubscribeLikes = getLikesUser(user.userID, setLikesUser)
            unsubscribeSaves = getPostsSaved(user.userID, setSavesUser)
        }
        return () => {
            unsubscribe && unsubscribe()
            unsubscribeLikes && unsubscribeLikes()
            unsubscribeSaves && unsubscribeSaves()
        }
    },[user])

    useEffect(() =>{
        if(user)
            getLatestPostsFollowsPagination(user.followsCount, user.userID, setPosts, typeof lastVisible != 'undefined' ? lastVisible:'', setLastVisible, setLoadingPage)
    },[isPage])

    useEffect(() =>{
        let postComments = []
        if(posts){
            postComments = posts.map(post => post.id)
        }
        if(postComments.length){
            setidPostsComments(postComments)
        }
    },[posts])

    useEffect(() =>{
         if(idPostsComments.length){
            getCommentsbyPostArray(idPostsComments, setcommentsPosts)
        }
    },[idPostsComments])

    useEffect(async () =>{
        await subscribeNotifications(setSubscriptionNotifications)
    },[])

    useEffect(() =>{
        if(user && user.subscriptionNotifications.endpoint != subscriptionNotifications.endpoint)
            updateSubscriptionNotifications(user.userID, subscriptionNotifications)
    },[subscriptionNotifications])

    return (
        <Fragment>
            <Head>
                <title>Home / Minstagram</title>
                <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
                <meta name="robots" content="noimageindex, noarchive"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="mobile-web-app-capable" content="yes"/>
            </Head>
            <Header />
            <div className="container" style={{"padding":"0","minHeight":"100vh","marginBottom":"60px"}}>
            {
                posts.length?
                    posts.map(
                        ({createdAt,userName, id, img, likeCount, commentCount, content, avatar, userID, place, filter }) => (
                            <Suspense key={id} fallback={<div className="col-12" style={{"textAlign":"center","marginTop":"250px"}}><img width="42" height="42" src='/loading.gif'></img></div>}>
                                <Card
                                createdAt={createdAt}
                                userName={userName}
                                img={img}
                                likeCount={likeCount}
                                content={content}
                                id={id}
                                avatar={avatar}
                                userID={userID}
                                likesUser={likesUser}
                                commentCount={commentCount}
                                comments={commentsPosts? commentsPosts.filter(post => post.idPost == id):[]}
                                place={place}
                                savesUser={savesUser}
                                actualUserID={user.userID}
                                filter={filter}
                                />
                            </Suspense>
                        )
                ):!posts?
                (
                    <div className="col-12" style={{"textAlign":"center","marginTop":"250px"}}>
                        <img width="42" height="42" src='/loading.gif'></img>
                    </div>
                ):!posts.length?
                (
                    <div className="col-12" style={{"textAlign":"center","marginTop":"250px"}}>
                        No hay Publicaciones recientes para mostrar
                    </div>
                ):''
            }

                <div className="col-12 text-muted" style={{"textAlign":"center","paddingTop":"0px","paddingBottom":"40px","fontSize":"13px"}}>
                    {posts.length && lastVisible && loadingPage?
                        <img width="42" height="42" src='/loading.gif'></img>:
                        posts.length && !lastVisible && !loadingPage?
                        <Fragment>
                            <hr></hr>
                            'No hay mas publicaciones para mostrar'
                        </Fragment>:''
                    }
                </div>

            </div>
            <div id="observer" ref={elementRef}></div>
        </Fragment>
    )


}

export default Home