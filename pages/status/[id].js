import React, { useState, useEffect } from 'react'
import { getLikesUser, getPostbyID, getCommentsbyPost } from 'firebase/client'
import Head from 'next/head'
import router from 'next/router'
import useUser from 'hooks/useUser'
import Card from 'components/Card'
import CardDesktop from "components/CardDesktop";
import { Arrow_icon } from 'components/icons'
import Header from "components/Header";

const Status = ({postID}) => {

    const user = useUser()
    const [likesUser, setLikesUser] = useState([])
    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [resolutionWidth, setResolutionWidth] = useState(null);

    const resize = ({target}) => {
         setResolutionWidth(target.innerWidth);
    }

    useEffect(() =>{
        let unsubscribe
        let unsubscribeLikes
        let unsubscribeComments
        if(user){
            unsubscribe = getPostbyID(postID,setPost);
            unsubscribeLikes = getLikesUser(user.userID, setLikesUser)
            unsubscribeComments = getCommentsbyPost(postID, setComments)
        }
        return () => {
            unsubscribe && unsubscribe()
            unsubscribeLikes && unsubscribeLikes()
            unsubscribeComments && unsubscribeComments()
        }
    },[user])

    useEffect(() => {
        setResolutionWidth(window.innerWidth)
        window.addEventListener("resize", resize);
        return () => removeEventListener("resize", resize);
	}, []);

    return (
        <>
        <Head>
            <title>Foto de {post.userName} </title>
            <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"/>
            <meta name="robots" content="noimageindex, noarchive"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
            <meta name="mobile-web-app-capable" content="yes"/>
        </Head>
        <Header />
        <div className="container" style={{"padding":"0"}}>
            <div className="row" style={{paddingTop: '-30px'}}>
                <div className="col-1" style={{"paddingLeft": "20px", "cursor":"pointer"}} >
                    <a onClick={() => router.back()} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a>
                </div>
                <div className="col-9" style={{"textAlign":"center","marginTop":"7px"}}><h5>Foto</h5></div>
            </div>
                    {
                        user && post.id ?
                            resolutionWidth <= 875 ?
                                <Card
                                    key={post.id}
                                    createdAt={post.createdAt}
                                    userName={post.userName}
                                    img={post.img}
                                    likeCount={post.likeCount}
                                    content={post.content}
                                    id={post.id}
                                    avatar={post.avatar}
                                    userID={post.userID}
                                    likesUser={likesUser}
                                    commentCount={post.commentCount}
                                    comments={comments}
                                    place={post.place}
                                    actualUserID={user?.userID}
                                /> :
                                <CardDesktop
                                    key={post.id}
                                    createdAt={post.createdAt}
                                    userName={post.userName}
                                    img={post.img}
                                    likeCount={post.likeCount}
                                    content={post.content}
                                    id={post.id}
                                    avatar={post.avatar}
                                    userID={post.userID}
                                    likesUser={likesUser}
                                    commentCount={post.commentCount}
                                    comments={comments}
                                    place={post.place}
                                    actualUserID={user?.userID}
                                /> : ''
                    }
                    <br></br>
                </div>
        </>
    );
}


//SERVER SIDE RENDERING
export const getServerSideProps = async ({params}) => {

    //const res = await fetch(`http://localhost:3000/api/posts/${params.id}`)
    //const post = await res.json()

    return {
        props: {
            postID: params.id
        }
    }
}

export default Status;
