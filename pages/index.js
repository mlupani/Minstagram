import React, { useEffect } from 'react'
import Login from 'components/Login'
import Mobiles from 'components/Mobiles'
import styles from "styles/Mobiles.module.css";
import useUser from 'hooks/useUser';
import router from "next/router";

const index = () => {

  const user = useUser()

  useEffect(() => {
		if (user) {
			router.push("/home");
		}
	}, [user]);


  if(user === null)
    return (
      <>
        <div className={styles.flexContainer}>
            <div className={styles.flexCol}>
              <Mobiles/>
            </div>
            <div className={styles.flexCol}>
              <Login/>
            </div>
          </div>
      </>
    )

  if(user === undefined) return <div style={{display:'flex', justifyContent: 'center', width: '100%', height: '100vh', alignItems: 'center'}}><img width="42" height="42" src="/loading.gif"></img></div>

  return '';

}

export default index
