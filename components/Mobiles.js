import React, { useEffect, useState } from 'react';
import styles from 'styles/Mobiles.module.css';

const Mobiles = () => {

    const [itemActive, setItemActive ] = useState(1);

    useEffect(() => {
        const int = setInterval(() => {
            if(itemActive < 5)
                setItemActive(prev => prev + 1)
            else
                setItemActive(1)
        },5000)
        return () => {
            clearInterval(int)
        }
    }, [itemActive])


    return (
			<div className={`${styles.content}`}>
				<div>
					<img className={`${styles.mobileImage}`} src="img/mobiles.png" />
                    <img className={styles.screenImage} src={`img/screen${itemActive}.jpg`} />
                </div>
			</div>
		);
}

export default Mobiles
