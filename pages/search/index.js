import React, { useState, useEffect, useRef, Fragment } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getLatestPosts, getUserByKeyword } from 'firebase/client'
import Wallphoto from 'components/Wallphoto'
import { Del_icon } from 'components/icons'
import Header from "components/Header";
import styles from 'styles/Search.module.css'

const Search = () => {

    const [posts, setPosts] = useState('')
    const [postsGroup, setPostsGroup] = useState([])
    const [searchState, setSearchState] = useState(false)
    const refTextArea = useRef()
    const [text, setText] = useState('')
    const [results, setResults] = useState([])
    const [loadingRes, setLoadingRes] = useState(false)
    let users = []

    useEffect(() =>{
        let unsubscribe = getLatestPosts(setPosts)
        return () => unsubscribe && unsubscribe()
    },[])

    useEffect(() =>{
        if(posts.length){
            posts.map(post => {
                if(!users.includes(post.userID))
                {
                    users.push(post.userID)
                    post.url = "/user/"+post.userID
                    setPostsGroup([post])
                }
            })
        }
    },[posts])

    useEffect(() =>{
        if(refTextArea && refTextArea.current){
            refTextArea.current.addEventListener('focus', ()=> setSearchState(true), false)
        }
    },[])

    useEffect(() =>{
        if(text){
            setLoadingRes(true)
            getUserByKeyword(text, setResults).then(()=>{
                setLoadingRes(false)
            })
        }
        else
            setResults([])
    },[text])

    const handleChange = e => {
        setText(e.target.value)
    }

    return (
			<>
				<Head>
					<title>Buscar</title>
				</Head>
				<Header />
				<div className="container" style={{ padding: "0" }}>
					<div
						className="row"
						style={{
							borderBottom: "1px solid gainsboro",
							paddingBottom: "10px",
							marginBottom: "10px",
							paddingLeft: "15px",
							paddingRight: "10px",
						}}
					>
						{!searchState ? (
							<div
								className="col-12"
								style={{
									textAlign: "center",
									marginTop: "7px",
									paddingRight: "0px !important",
								}}
							>
								<textarea
									ref={refTextArea}
									onChange={(e) => handleChange(e)}
									value={text}
									style={{ fontSize: "13px" }}
									rows="1"
									placeholder="&#x1f50d; Buscar"
									className={`form-control ${styles.textareaclass}`}
								></textarea>
							</div>
						) : (
							<Fragment>
								<div
									className="col-9"
									style={{
										textAlign: "center",
										marginTop: "7px",
										paddingRight: "0px !important",
									}}
								>
									<textarea
										ref={refTextArea}
										onChange={(e) => handleChange(e)}
										value={text}
										style={{ fontSize: "13px" }}
										rows="1"
										placeholder="&#x1f50d; Buscar"
										className={`form-control ${styles.textareaclass}`}
									></textarea>
								</div>
								<div
									className="col-3"
									style={{
										textAlign: "center",
										marginTop: "7px",
										paddingRight: "0px !important",
									}}
								>
									{loadingRes ? (
										<img
											style={{
												position: "relative",
												right: "30px",
												visibility: `${loadingRes ? "visible" : "hidden"}`,
											}}
											src="loading_search.gif"
											width="20"
											height="20"
										></img>
									) : (
										<span
											onClick={() => {
												setText("");
												refTextArea.current.focus();
											}}
											style={{
												position: "relative",
												right: "30px",
												visibility: `${
													!loadingRes && text ? "visible" : "hidden"
												}`,
												color: "darkgray",
											}}
										>
											<Del_icon width="13" height="13" />
										</span>
									)}
									<button
										onClick={() => setSearchState(false)}
										style={{ paddingRight: "0px", paddingLeft: "0px" }}
										className="btn btn-sm btn-light"
									>
										Cancelar
									</button>
								</div>
							</Fragment>
						)}
					</div>
					{postsGroup?.length && !searchState ? (
						<div className={`row ${styles.rowWallPhoto}`} >
							<div className={`col-8 ${styles.containerWallPhoto}`}>
								<Wallphoto
									dataPhotos={postsGroup}
									isClickeable={true}
									columnas="3"
								/>
							</div>
						</div>
					) : (
						""
					)}

					{results.length ? (
						results.map((usuario) => (
							<Link
								key={usuario.userID}
								href="/user/[id]"
								as={`/user/${usuario.userID}`}
							>
								<div className="row">
									<div
										className="col-2"
										style={{ paddingLeft: "20px", paddingTop: "5px" }}
									>
										<img
											className={`${styles.avatar} filter-${usuario.filter}`}
											alt={usuario.avatar}
											src={usuario.avatar}
										></img>
									</div>
									<div
										className="col-9"
										style={{
											marginLeft: "10px",
											fontSize: "13px",
											fontWeight: "600",
										}}
									>
										{usuario.userName}{" "}
										<p
											style={{
												color: "darkgray",
												fontSize: "13px",
												fontWeight: "100",
											}}
										>
											{usuario.displayName}
										</p>
									</div>
								</div>
							</Link>
						))
					) : !results.length && text && searchState && !loadingRes ? (
						<div
							className="col-12"
							style={{ textAlign: "center", marginTop: "250px" }}
						>
							No hay Resultados para su b&uacute;squeda
						</div>
					) : (
						""
					)}

					{!posts ? (
						<div
							className="col-12"
							style={{ textAlign: "center", marginTop: "250px" }}
						>
							<img width="42" height="42" src="/loading.gif"></img>
						</div>
					) : !postsGroup.length && !posts.length && !text ? (
						<div
							className="col-12"
							style={{ textAlign: "center", marginTop: "250px" }}
						>
							No hay Publicaciones recientes para mostrar
						</div>
					) : (
						""
					)}
				</div>
			</>
		);
}

export default Search;
