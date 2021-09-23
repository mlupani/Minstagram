import React, { useEffect, useState } from 'react';
import styles from 'styles/Mobiles.module.css';

const Mobiles = () => {

    const [itemActive, setItemActive ] = useState(1);
    const [opacity, setOpacity] = useState(1)

    useEffect(() => {
        const int = setInterval(() => {
            setOpacity(1)
            if(itemActive < 5)
                setItemActive(prev => prev + 1)
            else
                setItemActive(1)
        },5000)

        return () => {
            clearInterval(int)
        }
    }, [itemActive])

    useEffect(() => {
        const int2 = setInterval(() => {
            setOpacity(0)
        },3500)

        return () => {
            clearInterval(int2)
        }
    }, [opacity])


    return (
			<div className={`${styles.content}`}>
				<div>
					<img className={`${styles.mobileImage}`} src="img/mobiles.png" />
                    <img className={styles.screenImage} style={{transition: "opacity 1.5s", opacity: opacity}} src={`img/screen${itemActive}.jpg`} />
                </div>
			</div>
		);
}

export default Mobiles
