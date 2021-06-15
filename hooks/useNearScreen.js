import React, { useEffect, useState, useRef } from 'react';

//HOOK QUE RECIBE UNA REFERENCIA DE UN ELEMENTO DEL DOM, Y DEVUELVE UN BOOLEAN DETERMINANDO SI PASÓ O NO POR EL ELEMENTO PARA HACER UNA ACCION
const useNearScreen = ({distance='100px', once=true}) => {

    const [isNearScreen, setIsNearScreen] = useState(false)
    const elementRef = useRef()

    useEffect(() =>{

        let observer

        const handleChange = (entries, observer) => {
            const el = entries[0]
            if(el.isIntersecting){
                setIsNearScreen(true)
                once && observer.disconnect()
            }else{
                !once && setIsNearScreen(false)
            }
        }

        if(elementRef.current){
            observer = new IntersectionObserver(handleChange,{rootMargin: distance})
            observer.observe(elementRef.current)
        }
        return () => observer && observer.disconnect()
    })


    return {isNearScreen, elementRef}

}

export default useNearScreen;
