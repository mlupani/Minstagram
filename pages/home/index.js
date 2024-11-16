import React, { useEffect, useState, Fragment, Suspense, lazy, useCallback } from 'react'
import { getLatestPostsFollows, getCommentsbyPostArray, getLikesUser, getPostsSaved, getLatestPostsFollowsPagination, updateSubscriptionNotifications, getUsersSuggestions } from 'firebase/client'
import { Instagram } from 'react-content-loader'
import debounce from "just-debounce-it";
import Head from 'next/head'
import { useRouter } from "next/router";
import useUser from 'hooks/useUser'
import useNearScreen from 'hooks/useNearScreen'
import Header from 'components/Header'
import { subscribeNotifications } from 'services/notifications'
import styles from 'styles/Home.module.css'
import useFollows from 'hooks/useFollows';

const Card = lazy(() => import('components/Card'))

export const Home = () => {

	const user = useUser()
	const { handleFollow } = useFollows();
    const [posts, setPosts] = useState('')
    const [likesUser, setLikesUser] = useState([])
    const [idPostsComments, setidPostsComments] = useState([]);
    const [commentsPosts, setcommentsPosts] = useState();
    const [savesUser, setSavesUser] = useState('')
    const [isPage, setIsPage] = useState(0)
    const router = useRouter();
    const [sugerencias, setSugerencias] = useState(null);
    const [lastVisible, setLastVisible] = useState('')
    const [loadingPage, setLoadingPage] = useState(false)
    const [once, setOnce] = useState(false)
    const [isLoadedPage, setIsLoadedPage] = useState(false)
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
        if(user && isPage)
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

    useEffect(() => {
        if(user?.userID)
            getUsersSuggestions(user?.userID_firebase).then(setSugerencias)
    }, [user]);

    useEffect(() =>{
        if(user && user.subscriptionNotifications?.endpoint != subscriptionNotifications?.endpoint)
            updateSubscriptionNotifications(user.userID, subscriptionNotifications)
    },[subscriptionNotifications])

    useEffect(() => {
        if(posts.length)
            setTimeout(() => {
                setIsLoadedPage(true)
            }, 2000);
    }, [posts])

    return (
			<Fragment>
				<Head>
					<title>Home / Minstagram</title>
					<meta
						id="viewport"
						name="viewport"
						content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"
					/>
					<meta name="robots" content="noimageindex, noarchive" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="mobile-web-app-capable" content="yes" />
				</Head>
				<Header />
				<div className={`${styles.flexContainer}`}>
					<div className={styles.flexColCards}>
						{posts.length ? (
							posts.map(
								({
									createdAt,
									userName,
									id,
									img,
									likeCount,
									commentCount,
									content,
									avatar,
									userID,
									place,
									filter,
								}) => (
									<Suspense
										key={id}
										fallback={<Instagram uniqueKey={id} />}
									>
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
											comments={
												commentsPosts
													? commentsPosts.filter((post) => post.idPost == id)
													: []
											}
											place={place}
											savesUser={savesUser}
											actualUserID={user?.userID}
											filter={filter}
										/>
									</Suspense>
								)
							)
						) : !posts ? (
							<div
								className="col-12"
								style={{ textAlign: "center", marginTop: "250px" }}
							>
								<img width="42" height="42" src='/loading.gif'></img>
							</div>
						) : !posts.length ? (
							<div
								className="col-12"
								style={{ textAlign: "center", marginTop: "250px" }}
							>
								No hay Publicaciones recientes para mostrar
							</div>
						) : (
							""
						)}

						<div
							className="col-12 text-muted"
							style={{
								textAlign: "center",
								paddingTop: "0px",
								paddingBottom: "40px",
								fontSize: "13px",
							}}
						>
							{posts.length && lastVisible && loadingPage ? (
								<img width="42" height="42" src="/loading.gif"></img>
							) : posts.length && !lastVisible && !loadingPage ? (
								<Fragment>
									<hr></hr>
									No hay mas publicaciones para mostrar
								</Fragment>
							) : (
								""
							)}
						</div>
					</div>
					{user?.avatar ? (
						<div className={styles.flexColSugerencias}>
							<div className="row">
								<div className="col-4">
									<a
										onClick={() =>
											router.push("/user/[id]", `/user/${user?.userID}`, {
												shallow: true,
											})
										}
										className="nav-item nav-link"
									>
										<img
											className={`${styles.avatar} filter-${user?.filter}`}
											style={{ cursor: "pointer" }}
											alt={user ? user.avatar : ""}
											src={user ? user.avatar : ""}
										></img>
									</a>
								</div>
								<div
									className="col"
									style={{
										paddingTop: "10px",
										fontSize: "12",
										cursor: "pointer",
									}}
								>
									<span style={{ fontWeight: "500" }}>{user?.userName}</span>
									<p className="text-muted">{user?.displayName}</p>
								</div>
							</div>
							<div
								className="row"
								style={{
									marginTop: "20px",
									fontWeight: "500",
									fontSize: "15px",
									marginLeft: "20px",
								}}
							>
								<span style={{ marginBottom: "5px" }} className="text-muted">
									Sugerencias para ti
								</span>
								{
									!sugerencias?.length ? <p>No hay sugerencias para mostrar</p> : ''
								}
								{sugerencias?.filter(us => !user.followsCount.includes(us.userID)).map((usuario) => {
									return (
										<div className="row" key={usuario.userID}>
											<div className="col-2">
												<a
													style={{ paddingLeft: "0px" }}
													onClick={() =>
														router.push(
															"/user/[id]",
															`/user/${usuario?.userID}`,
															{
																shallow: true,
															}
														)
													}
													className="nav-item nav-link"
												>
													{
														usuario.avatar ? 
															<img
																className={`${styles.avatarSug} filter-${usuario?.filter}`}
																style={{ cursor: "pointer" }}
																alt={usuario ? usuario.avatar : ""}
																src={usuario ? usuario.avatar : ""}
																onError={(e) => {
																	e.target.onerror = null;
																	e.target.src = "/default-user.png";
																}}
															></img> : null
													}
												</a>
											</div>
											<div
												onClick={() =>
													router.push(
														"/user/[id]",
														`/user/${usuario?.userID}`,
														{
															shallow: true,
														}
													)
												}
												className="col-5"
												style={{
													paddingTop: "10px",
													fontSize: "12",
													cursor: "pointer",
												}}
											>
												<span style={{ fontWeight: "500" }}>
													{usuario?.userName}
												</span>
												<p className="text-muted">{usuario?.displayName}</p>
											</div>
											<div
												className="col-4"
												style={{
													paddingTop: "10px",
													fontSize: "12",
													cursor: "pointer",
												}}
											>
												<button
													style={{ textDecoration: "none", fontSize: "13px" }}
													className="btn btn-link"
													onClick={e => handleFollow(e, usuario?.userID, usuario?.private)}
												>
													Seguir
												</button>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						""
					)}
				</div>
				{isLoadedPage ? <div id="observer" ref={elementRef}></div> : ""}
			</Fragment>
		);


}

export default Home