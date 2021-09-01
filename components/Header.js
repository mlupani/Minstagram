import React, { useRef, useState, Fragment, useEffect } from 'react'
import { IMAGEUPLOADSTATES, countNewMessages, logout } from 'firebase/client'
import styles from 'styles/Header.module.css'
import {
	Msg_icon,
	Cam_icon,
	Home_icon,
	Search_icon,
	Fav_icon,
	FavFill_icon,
	SearchFill_icon,
	Logout_icon,
} from "components/icons";
import { useRouter } from "next/router";
import Loadingbar from 'react-multicolor-loading-bar'
import Link from 'next/link'
import useUser from 'hooks/useUser'
import useDevice from "hooks/useDevice";
import useHandleImage from "hooks/useHandleImage";
import useActivityNotif from 'hooks/useActivityNotif';


const header = () => {

    const user = useUser()
	const isMobile = useDevice()
    const inputFile = useRef(null)
	const { likeNotif, commentNotif, commentOfCommentNotif, showNotif, requestNotif } = useActivityNotif();
    const { handleImage } = useHandleImage();
    const [imageUpdaloadState, setimageUploadState] = useState(null)
    const [countMessages, setCountMessages] = useState(0)
    const [url, setUrl] = useState("");
    const router = useRouter();
    const [show, setShow] = useState(true);
    const [viewProfile, setViewProfile] = useState(false)

    const handleClickFile = e => {
        e.preventDefault();
        inputFile.current.click();
    }

    useEffect(() => {
        if(user){
            let unsubscribe
            unsubscribe = countNewMessages(user.chats, user.userID, setCountMessages)

            return () => unsubscribe && unsubscribe()
        }

    },[user])

    useEffect(() =>{
        setUrl(router.pathname)

        if(url == "/login" || url == "/preview" || url == "/accounts/edit" || url == "/chat/[id]" || url == "/")
            setShow(false)
        else
            setShow(true)
    },[])

    const handleLogout = async (e) => {
		e.preventDefault()
        const res = await logout(user.userID)
        if(res) {
            router.replace("/")
            return;
        }
    }

    return (
			<Fragment>
				<div
					className={`row ${
						imageUpdaloadState != IMAGEUPLOADSTATES.ONPROGRESS ? "d-none" : ""
					} `}
				>
					<Loadingbar
						style={{ position: "relative" }}
						colors={["#dc3545", "#25C5EC", "#E3F10C", "#21F10C"]}
						height={5}
						cycleDurationInMs={200}
					></Loadingbar>
				</div>
				<nav
					className={`navbar navbar-expand-lg navbar-light bg-light ${
						styles.navbar
					} ${
						imageUpdaloadState == IMAGEUPLOADSTATES.ONPROGRESS ? "d-none" : ""
					}`}
				>
					<div className={`container-fluid ${styles.container}`}>
						{isMobile && url === "/user/[id]" ? (
							<a
								className={`nav-link ${styles.flexItems}`}
								onClick={handleLogout}
								style={{ color: "black" }}
								href="#"
							>
								<Logout_icon />
							</a>
						) : (
							<a
								className={`nav-link ${styles.flexItems}`}
								onClick={handleClickFile}
								style={{ color: "black" }}
								href="#"
							>
								<Cam_icon />
							</a>
						)}
						<Link href="/home">
							<a className="navbar-brand" href="#">
								<img
									className={styles.logo}
									src="/img/logo.png"
									alt="Minstagram"
								/>
							</a>
						</Link>
						<div className={`${styles.flexMenu}`}>
							<Link href="/home">
								<a
									className={`nav-link ${styles.flexItems}`}
									style={{ color: "black" }}
								>
									<Home_icon
										width="25"
										height="25"
										fill={url && url == "/home" ? true : false}
									/>
								</a>
							</Link>
							<Link href={"/inbox/"}>
								<a
									className={`nav-link ${styles.flexItems}`}
									style={{ color: "black" }}
									href="#"
								>
									<Msg_icon fill={url && url == "/inbox" ? true : false} />
									{
										<span
											style={{
												display: `${countMessages ? "inline" : "none"}`,
											}}
											className={`${styles.alertMessage}`}
										>
											{countMessages}
										</span>
									}
								</a>
							</Link>

							<Link href="/search">
								<a
									className={`nav-link ${styles.flexItems}`}
									style={{ color: "black", cursor: "pointer" }}
								>
									{url && url == "/search" ? (
										<SearchFill_icon />
									) : (
										<Search_icon />
									)}
								</a>
							</Link>
							<Link href="/actividad">
								<a
									className={`nav-item nav-link ${
										likeNotif.length ||
										commentNotif.length ||
										requestNotif.length
											? styles.notifCircle
											: ""
									} ${styles.flexItems} `}
									style={{ color: "black", cursor: "pointer" }}
								>
									{url && url == "/actividad" ? <FavFill_icon /> : <Fav_icon />}
								</a>
							</Link>
							<div
								onClick={() => setViewProfile(!viewProfile)}
								/* onClick={() =>
								router.push("/user/[id]", `/user/${user?.userID}`, {
									shallow: true,
								})
							} */
								className="nav-item nav-link dropdown-toggle"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								style={{ cursor: "pointer" }}
								id="dropdownMenuButton1"
							>
								<img
									className={`${
										url &&
										url == "/user/[id]" &&
										router.query.id == user?.userID
											? styles.avatarSelected
											: styles.avatar
									} filter-${user?.filter}`}
									alt={user ? user.avatar : ""}
									src={user ? user.avatar : ""}
								></img>
								<ul
									className={`dropdown-menu ${
										viewProfile ? "d-block" : "d-none"
									} `}
									aria-labelledby="dropdownMenuButton1"
								>
									<li>
										<a
											className="dropdown-item"
											onClick={(e) => {
												e.preventDefault();
												router.push("/user/[id]", `/user/${user?.userID}`, {
													shallow: true,
												});
											}}
										>
											Ver Perfil
										</a>
									</li>
									<li>
										<a
											onClick={handleLogout}
											className="dropdown-item"
											href="#"
										>
											Salir
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div className={styles.inboxHide}>
							<Link href={"/inbox/"}>
								<a
									className={`nav-link ${styles.flexItems}`}
									style={{ color: "black" }}
									href="#"
								>
									<Msg_icon fill={url && url == "/inbox" ? true : false} />
									{
										<span
											style={{
												display: `${countMessages ? "inline" : "none"}`,
											}}
											className={`${styles.alertMessage}`}
										>
											{countMessages}
										</span>
									}
								</a>
							</Link>
						</div>
					</div>
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
}

export default header;
