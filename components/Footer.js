import React, { useRef, useState, useEffect, Fragment } from 'react'
import { IMAGEUPLOADSTATES } from 'firebase/client'
import Link from 'next/link'
import useUser from 'hooks/useUser'
import styles from 'styles/Footer.module.css'
import { Home_icon, Search_icon, Plus_icon, Fav_icon, FavFill_icon, SearchFill_icon, ChatFill_icon, UserPlusIcon } from 'components/icons'
import {useRouter} from 'next/router'
import Loadingbar from 'react-multicolor-loading-bar'
import useHandleImage from 'hooks/useHandleImage'
import useActivityNotif from 'hooks/useActivityNotif'

const Footer = () => {

    const user = useUser()
	const { likeNotif, commentNotif, commentOfCommentNotif, showNotif, requestNotif } = useActivityNotif();
	const { handleImage } = useHandleImage();
    const inputFile = useRef(null)
    const [imageUpdaloadState, setimageUploadState] = useState(null)
    const [url, setUrl] = useState('')
    const router = useRouter()
    const [show, setShow] = useState(true)

    const handleClickFile = e => {
        e.preventDefault();
        inputFile.current.click();
    }

    useEffect(() =>{
        setUrl(router.pathname)

        if(url == "/login" || url == "/preview" || url == "/accounts/edit" || url == "/chat/[id]" || url == "/" || url == "privacy")
            setShow(false)
        else
            setShow(true)
    },[router.pathname, url])

    if(user?.avatar && show)
    return (
			<Fragment>
				{imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS ? (
					<Loadingbar
						colors={["#dc3545", "#25C5EC", "#E3F10C", "#21F10C"]}
						height={5}
						cycleDurationInMs={200}
						positionAtTop={true}
					></Loadingbar>
				) : (
					""
				)}

				<nav
					className={`nav nav-pills nav-justified bg-light ${styles.footer} `}
					style={{
						position: "fixed",
						left: "0",
						bottom: "0",
						width: "100%",
					}}
				>
					{likeNotif?.length &&
					(commentNotif?.length || commentOfCommentNotif?.length) &&
					showNotif ? (
						<div
							onClick={() => router.push("/actividad")}
							className={styles.notifTwo}
						>
							<div className={styles.notifItem}>
								<FavFill_icon width="16" height="16" />
								&nbsp;{likeNotif.length}
							</div>
							<div className={styles.notifItem}>
								<ChatFill_icon width="16" height="16" />
								&nbsp;{commentNotif.length + commentOfCommentNotif.length}
							</div>
						</div>
					) : likeNotif?.length && showNotif ? (
						<div
							onClick={() => router.push("/actividad")}
							className={styles.notif}
						>
							<div className={styles.notifItem}>
								<FavFill_icon width="16" height="16" />
								&nbsp;{likeNotif.length}
							</div>
						</div>
					) : (commentNotif?.length || commentOfCommentNotif?.length) && showNotif ? (
						<div
							onClick={() => router.push("/actividad")}
							className={styles.notif}
						>
							<div className={styles.notifItem}>
								<ChatFill_icon width="16" height="16" />
								&nbsp;{commentNotif.length + commentOfCommentNotif.length}
							</div>
						</div>
					) : requestNotif?.length && showNotif ? (
						<div
							onClick={() => router.push("/actividad")}
							className={styles.notif}
						>
							<div className={styles.notifItem}>
								<UserPlusIcon width="16" height="16" />
								&nbsp;{requestNotif?.length}
							</div>
						</div>
					) : (
						""
					)}

					{imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS ? (
						<a className={`nav-item nav-link ${styles.flexAlign}`}>&nbsp;</a>
					) : (
						<Link href="/home">
							<a className={`nav-item nav-link ${styles.flexAlign}`} style={{ color: "black" }}>
								<Home_icon
									width="25"
									height="25"
									fill={url && url == "/home" ? true : false}
								/>
							</a>
						</Link>
					)}
					{imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS ? (
						<a className={`nav-item nav-link ${styles.flexAlign}`}>&nbsp;</a>
					) : (
						<Link href="/search">
							<a className={`nav-item nav-link ${styles.flexAlign}`} style={{ color: "black" }}>
								{url && url == "/search" ? (
									<SearchFill_icon />
								) : (
									<Search_icon />
								)}
							</a>
						</Link>
					)}
					{imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS ? (
						<img width="42" height="42" src="/loading.gif"></img>
					) : (
						<a
							className={`nav-item nav-link ${styles.flexAlign}`}
							href="#"
							onClick={handleClickFile}
							style={{ color: "black" }}
						>
							<Plus_icon />
						</a>
					)}
					{imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS ? (
						<a className={`nav-item nav-link ${styles.flexAlign}`}>&nbsp;</a>
					) : (
						<a
							onClick={(e) => {
								e.preventDefault();
								router.push("/actividad");
							}}
							className={`nav-item nav-link ${
								likeNotif.length || commentNotif.length || requestNotif.length
									? styles.notifCircle
									: ""
							} ${styles.flexAlign}`}
							style={{ color: "black" }}
						>
							{url && url == "/actividad" ? <FavFill_icon /> : <Fav_icon />}
						</a>
					)}
					{imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS ? (
						<a className={`nav-item nav-link ${styles.flexAlign}`}>&nbsp;</a>
					) : (
						<a
							onClick={() =>
								router.push("/user/[id]", `/user/${user?.userID}`, {
									shallow: true,
								})
							}
							className={`nav-item nav-link ${styles.flexAlign}`}
						>
							<img
								className={`${
									url && url == "/user/[id]" && router.query.id == user?.userID
										? styles.avatarSelected
										: styles.avatar
								} filter-${user.filter}`}
								alt={user ? user.avatar : ""}
								src={user ? user.avatar : ""}
							></img>
						</a>
					)}
					{/*<input type='file' multiple id='file' accept="image/png, image/jpeg, video/mp4" ref={inputFile} style={{display: 'none'}} onChange={(e) => {handleInputFile(e,setimageUploadState,"/preview",inputFile)}}/> */}
					<input
						type="file"
						multiple
						id="file"
						accept="image/png, image/jpeg, video/mp4"
						ref={inputFile}
						style={{ display: "none" }}
						onChange={(e) => {
							handleImage(e);
						}}
					/>
				</nav>
			</Fragment>
		);
    else
            return ''
}

export default Footer;
