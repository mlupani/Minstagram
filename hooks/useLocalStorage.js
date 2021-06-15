import React, { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
    
    const [storedValue, setText] = useState(() => {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
    })


    const setStorageValue = value => {
        setText(value)
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    return [storedValue, setStorageValue]
}

export default useLocalStorage;
