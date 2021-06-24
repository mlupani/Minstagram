import firebase from 'firebase';
import router from 'next/router'
import Compressor from 'compressorjs';

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)

const errorsLogin = {
    'error': 'Hubo un Error',
    'auth/weak-password' : 'El password debe poseer al menos 6 caracteres',
    'auth/email-already-in-use': "El Mail ya esta registrado, elije otro",
    'auth/invalid-email': 'Email o usuario inválido',
    'auth/user-not-found': 'Email no encontrado',
    'auth/wrong-password': 'Contraseña Inválida',
    "There is no user record corresponding to this identifier. The user may have been deleted.": "El email no pertenece a ningun usuario registrado.",
    "auth/invalid-email": 'El email es invalido',
    "auth/requires-recent-login": 'Esta acción requiere cerrar sesión y volver a logearse.',
    "auth/invalid-verification-code": 'El codigo ingresado es incorrecto, ingrese el codigo que se le ha enviado al SMS'
}

export const IMAGEUPLOADSTATES = {
    ERROR: -1,
    ONPROGRESS: 1,
    UPLOADED: 2
}

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}else {
   firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore()


export const getUserConnected = setUser => {
    firebase.auth().onAuthStateChanged(user=> {
        if(user){
            let unsubscribe
            unsubscribe = getUserInCollection(user,setUser)
            return () => unsubscribe && unsubscribe()
        }
    });
}

export const sendVerificationToUser = (user) => {
    firebase.auth().languageCode = 'es';
    return user.sendEmailVerification()
}

export const phoneRecapchaVerifier = (divContainer) => {
    firebase.auth().languageCode = 'es';
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(divContainer);
    window.recaptchaVerifier = recaptchaVerifier
    recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
    });
}

export const sendPhoneCode = (phone, setModalShow, setSendingCode, recaptchaContainer) => {

    if(!window.appverifier)
        window.appverifier = new firebase.auth.RecaptchaVerifier(
            recaptchaContainer,
            {
                size: "invisible"
            }
        );

    firebase.auth().signInWithPhoneNumber(phone, window.appverifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setModalShow(true)
            setSendingCode(2)
        }).catch((error) => {
            console.log(error)
            grecaptcha.reset(window.recaptchaWidgetId);
        });
}

export const phoneSign = (code, seterrorSMS) => {
    return confirmationResult.confirm(code).then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user)
        return user
    }).catch(({code}) => {
        // User couldn't sign in (bad verification code?)
        seterrorSMS(errorsLogin[code])
    });
}

export const updatePhoneNumber = (phoneNumber, recaptchaContainer) => {

    var appVerifier = new firebase.auth.RecaptchaVerifier(
        recaptchaContainer,
        {
            size: "invisible"
        }
    );
    var provider = new firebase.auth.PhoneAuthProvider();

    provider.verifyPhoneNumber(phoneNumber, appVerifier)
        .then(function (verificationId) {
            var verificationCode = window.prompt('Please enter the verification ' +
                'code that was sent to your mobile device.');
            let phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode)
            var user = firebase.auth().currentUser;
            user.updatePhoneNumber(phoneCredential);
        })
        .then(() => {
        })
        .catch((error) => {
            // Error occurred.
            console.log(error);
        });

}

export const sendVerificationToSignUp = async (email,pass, username, callback, callbackError) => {

    var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: `http://localhost:3000/?emailSignUp=${email}&passSignUp=${pass}&usernameSignUp=${username}`,
        // This must be true.
        handleCodeInApp: true,
        /*
        iOS: {
            bundleId: 'com.example.ios'
        },
        android: {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion: '12'
        },
        */
        //dynamicLinkDomain: 'example.page.link'
    };

    const val = await getUserInCollectionByEmail(email)

    if(!val.length)
        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
            callbackError('')
            callback('Se ha enviado un correo de verificacion para confirmar el registro')
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error al enviar el mail de alta "+errorMessage)
        });
    else{
        callback('')
        callbackError('El mail que quiere registrar ya esta registrado')
    }

}

export const logout =  async id => {

    return firebase.auth().signOut().then(() => {
        localStorage.removeItem("userMistagram");
        if(id)
            updateConnect(id)
        return true
    }).catch((error) => {
        console.log("Hubo un error en el deslogeo: "+error)
    });

}

export const updateProfileUser = (displayName, email, phone, recaptchaRef, oldPhone) => {

    var user = firebase.auth().currentUser;

    return new Promise((resolve, reject) => {

        if(oldPhone != phone)
            updatePhoneNumber(phone, recaptchaRef.current);

        user.updateEmail(email).then(() => {
            user.updateProfile({
                displayName: displayName,
                email: email,
                phoneNumber: phone
            }).then(() => {
                resolve(true)
            }).catch(({code}) => {
                reject(errorsLogin[code]?errorsLogin[code]:errorsLogin["error"])
            });
        }).catch(({code}) => {
            reject(errorsLogin[code]?errorsLogin[code]:errorsLogin["error"])
        });
    })

}

export const signUpWithEmail = async (email, password, errorCallback) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(({user}) => {
            //errorCallback(null)
            const { uid, email } = user
            return { userID_firebase:uid, email }
    }).catch((error) => {
        const { code } = error
        errorCallback(errorsLogin[code]?errorsLogin[code]:errorsLogin["error"])
        return false
    })
}

export const sendResetPassword = email => {
    
    return firebase.auth().sendPasswordResetEmail(email).then(() => {
        return 1
    }).catch(({code}) => {
        console.log(code)
        return errorsLogin[code]?errorsLogin[code]:errorsLogin["error"]
    });
}

export const signInWithEmail = async (email, password, errorCallback) => {

    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(({user}) => {
        //errorCallback(null)
        return user.uid
    }).catch((error) => {
        const { code } = error
        errorCallback(errorsLogin[code]?errorsLogin[code]:errorsLogin["error"])
        return false
    })
}

export const vinculateFacebook = () => {
    const facebookProvider = new firebase.auth.FacebookAuthProvider()
    var user = firebase.auth().currentUser;
    return user.linkWithPopup(facebookProvider).then((result) => {
        // Accounts successfully linked.
        var credential = result.credential;
        var user = result.user;

    }).catch((error) => {
        console.log(error)
        // Handle Errors here.
        // ...
    });
}

export const desvinculateFacebook = () => {
    var user = firebase.auth().currentUser;
    return user.unlink('facebook.com').then(() => {
        // Auth provider unlinked from account
    }).catch((error) => {
        console.log(error)
    });
}

export const updateProvidersUser = (userID, provider, vinc) => {

    var user = db.collection('users').doc(userID);

    if(vinc == "desvincular")
        user.update({
            providers: firebase.firestore.FieldValue.arrayRemove(provider)
        });

    if(vinc == "vincular")
        user.update({
            providers: firebase.firestore.FieldValue.arrayUnion(provider)
        });

}

export const loginWithFacebook = async () => {
    const facebookProvider = new firebase.auth.FacebookAuthProvider()
    return firebase.auth().signInWithPopup
    (facebookProvider)
    .then(user => user)
}

export const uploadImage = file => {
    const ref =  firebase.storage().ref(`/images/${file.name}`)
    const task = ref.putString(file.img, 'data_url')
    return task
}

export const deleteImage = name => {
    const ref = firebase.storage().ref(`/images/${name}`)
    ref.delete().then(() => {
    }).catch(error => {
        console.log("no se ha podido borrar la imagen: "+error)
    });
}

export const addPost = ({avatar, content, img, userID, userName, place}) => {

    return db.collection("posts").add({
        avatar,
        content,
        img,
        userID,
        userName,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        place,
    })
}

export const addComment = ({idPost, comment, avatar, userID, userName, toUserID, img, filter}) => {

    return db.collection("comments").add({
        idPost,
        comment,
        avatar,
        userID,
        userName,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        likeCount: 0,
        toUserID,
        view: false,
        img
    })
}

export const addCommentOfComment = ({idComment, comment, avatar, userID, userName, toUserName, toUserID, img, filter}) => {

    return db.collection("commentsOfComments").add({
        idComment,
        comment,
        avatar,
        userID,
        userName,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        likeCount: 0,
        toUserName,
        toUserID,
        img
    })
}

export const addLikesComment = (idComment, idPost, userIDLike) => {

    return db.collection("likesComments").add({
        idComment,
        idPost,
        userIDLike
    })
}

const getMapPosts = doc => {

    const data = doc.data()
    const id = doc.id
    const createAt = data.createdAt

    if(data.viewAt) {
        const viewAt = data.viewAt
            return {
            ...data,
            id,
            viewAt: +viewAt.toDate(),
            createdAt: +createAt.toDate()
        }
    }

    return {
        ...data,
        id,
        createdAt: +createAt.toDate()
    }
}

export const putStorageItem = async (fileUploaded) => {

    return new Promise((resolve, reject) => {
        const task = uploadImage(fileUploaded)
        if(task){
            let onProgress = async () => {}
            let onError = async error => reject(error)
            let onComplete = async () => task.snapshot.ref.getDownloadURL().then(downloadURL => resolve(downloadURL))
            task.on('stated_changed', onProgress, onError, onComplete )
        }
    })

}

//FUNCION QUE MANEJA EL CHANGE DEL INPUT FILE PARA SUBIR LA IMAGEN.
export const handleInputFile = async (imgs) => {

    let files = []
    let links = []
    files = imgs.map(file => {URL.revokeObjectURL(file.baseurl); return {img: file.base64, type:file.type, name:file.name, filterApplied: file.filterApplied}})
    for await (let fileToUpload of files){links.push(await putStorageItem(fileToUpload)) }

    return files.map((file,index) => { return {img: links[index], name:file.name, type:file.type, filterApplied:file.filterApplied} })
}

export const compressingFiles = async (file) => {

    return new Promise((resolve) =>{
        new Compressor(file, {
            quality: 0.7, // 0.6 can also be used, but its not recommended to go below.
            success: compressedResult => {
                resolve(compressedResult)
            }
        });
    })

}

export const handleInputFileAvatar = (event,location,inputRef, user, callback, callBackProgress) => {
    const fileUploaded = event.target.files[0];

    //COMPRIME LA IMAGEN PARA QUE LA CARGA SEA MEJOR
     new Compressor(fileUploaded, {
      quality: 0.7, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {

            const task = uploadImage(compressedResult)
            if(task){
                let onProgress = () => {callBackProgress(1)}
                let onError = () => {alert("Error al subir la imagen, intentelo nuevamente")}
                let onComplete = () => {
                    task.snapshot.ref.getDownloadURL().then(downloadURL=> {
                        inputRef.current.value = null
                        //UPDATE
                        updateAvatarUser(downloadURL, user.userID).then(() => {
                            callback(false)
                            callBackProgress('')
                            router.push(location)
                        }).catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error al actualizar: ", error);
                        });
                    })
                }
                task.on('stated_changed', onProgress, onError, onComplete)
            }
        },
      });
}

export const getLatestPosts = callback => {
    return db
    .collection("posts")
    .orderBy("createdAt", "desc")
    .limit(20)
    .onSnapshot(({ docs }) => {
      const newPosts = docs.map(getMapPosts)
      callback(newPosts)
    })
}

export const getLatestPostsFollows = (follows, userID, callback, callbackLast, isNotFirstTime, limit) => {

    if(!follows.includes(userID))
        follows.push(userID)

    return db
        .collection("posts")
        .where('userID', 'in', follows)
        .orderBy("createdAt", "desc")
        .limit(limit ? limit : 5)
        .onSnapshot(({ docs }) => {
            const newPosts = docs.map(getMapPosts)

            if(!isNotFirstTime){
                var lastVisible = docs[docs.length-1];
                callbackLast(lastVisible)
            }

            callback(newPosts)
        })
}

export const getLatestPostsFollowsPagination = (follows, userID, callback, lastVisible, callbackLast, setLoadingPage) => {

    follows.push(userID)

    if(lastVisible){
        setLoadingPage(true)
    }

    return db
        .collection("posts")
        .where('userID', 'in', follows)
        .orderBy("createdAt", "desc")
        .startAfter(lastVisible)
        .limit(5)
        .get()
        .then(({ docs }) => {
            var lastVisible = docs[docs.length-1];
            callbackLast(lastVisible)
            const newPosts = docs.map(getMapPosts)
            callback(prevState => [...prevState, ...newPosts])
            setLoadingPage(false)
        })
}

export const getPostsLikesCommentsbyUser = (userID, callback) => {
    return db
    .collection("posts")
    .where("userID", "==", userID)
    .orderBy("createdAt", "desc")
    .onSnapshot(({ docs }) => {
      const newPosts = docs.map(getMapPosts)
      callback(newPosts)
    })
}

export const getChat = (chatName, callback, docRef, setDocRef, setLoadingPage, setCountResults) => {

    if(docRef != null)
        setLoadingPage(true)

    return db
    .collection(chatName)
    .orderBy("createdAt", "desc")
    .startAfter(docRef)
    .limit(10)
    .get()
    .then(({ docs }) => {

        const chat = docs.map(getMapPosts)
        chat.sort((a,b) => a.createdAt - b.createdAt)

        callback(prevState => { 
            let messages = []
            let newChat = []
            newChat = prevState.filter(val => !chat.includes(val));
            return [...chat, ...newChat]
        })

        setCountResults(docs.length)
        setDocRef(docs[docs.length-1])
        setLoadingPage(false)
    })
}

export const getChatListen = (chatName, callback, docRef, setDocRef, setLoadingPage, setCountResults, countResults, user, setScrolling) => {

    return db
    .collection(chatName)
    .orderBy("createdAt", "desc")
    .limit(10)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const doc = [change.doc.data()]
                doc[0].id = change.doc.id

                if(snapshot.docChanges().length == 10){
                    setDocRef(change.doc)
                    setCountResults(snapshot.docChanges().length)
                    callback(prevState => [...doc ,...prevState])
                }

                if(snapshot.docChanges().length == 2){
                    setCountResults(prevState => prevState+1)
                    setScrolling(false)
                    callback(prevState => [...prevState ,...doc])
                }
            }
        });
    })
}

export const countNewMessages = (chats, userID, callback) => {

    let arrayNames = []
    let chatName = ''
    chats.map(users=> {
        arrayNames.push(users)
        arrayNames.push(userID)
        arrayNames.sort()
        chatName = `chat_${arrayNames[0]}_${arrayNames[1]}`

        return db
        .collection(chatName)
        .orderBy("createdAt", "desc")
        .limit(1)
        .onSnapshot(({ docs }) => {
            docs.map(doc => {
                const data = doc.data()
                if(data.toUserID == userID && !data.view){
                    callback(prevCounter=> prevCounter+1)
                }
            })
        })
    })

}

export const getLastMsgOfChat = async (chatName, callback) => {
    return db
    .collection(chatName)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get()
    .then(({ docs }) => {
        const chat = docs.map(doc => {
            const data = doc.data()
            const id = doc.id
            const createdAt = data.createdAt

            return {
                ...data,
                id,
                createdAt: +createdAt.toDate()
            }
        })

        return chat[0]
    })
}

export const addMessageToChat = (message, fromUser, toUser, chatName) => {
    return db.collection(chatName).add({
        message,
        fromUserID: fromUser.userID,
        toUserID: toUser.userID,
        fromUsername: fromUser.userName,
        toUsername: toUser.userName,
        fromUserAvatar: fromUser.avatar,
        toUserAvatar: toUser.avatar,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        view: false,
        viewAt: firebase.firestore.Timestamp.fromDate(new Date())
    })
}

export const updateMesageViewAt = (nameChat, doc) => {
    var chat = db.collection(nameChat).doc(doc);
    chat.update({
        viewAt: firebase.firestore.Timestamp.fromDate(new Date())
    });
}

export const updateViewMessage = (nameChat, doc) => {
    var chat = db.collection(nameChat).doc(doc);
    chat.update({
        view: true
    });
}

export const updateSubscriptionNotifications = (doc, subscription) => {
    var user = db.collection('users').doc(doc);
    user.update({
        subscriptionNotifications: JSON.stringify(subscription)
    });
}

export const sendFollowRequest = (toUserID, fromUserID, fromUsername, fromDisplayName, fromAvatar, filterAvatar, view=false) => {
    return db.collection("followRequests").add({
        toUserID,
        fromUserID,
        fromUsername,
        fromDisplayName,
        fromAvatar,
        view: view,
        acceptedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        notif: false,
        fromAvatarFilter: filterAvatar
    })
}

export const updateFollowRequest = doc => {

    var req = db.collection('followRequests').doc(doc);
    req.update({
        view: true
    });
}

export const updateFollowRequestNotif = doc => {

    var req = db.collection('followRequests').doc(doc);
    req.update({
        notif: true
    });
}

export const getCommentsOfComment = (ids, callback) => {

    return db
    .collection("commentsOfComments")
    .where("idComment", "in", ids)
    .orderBy("createdAt", "desc")
    .onSnapshot(({ docs }) => {

        const comments = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id
            const createdAt = data.createdAt

            return {
                ...data,
                id,
                createdAt: +createdAt.toDate()
            }
        })

      if(comments.length)
        callback(comments)
    })
}

export const getCommentsLikesbyPost = (postID, callback) => {
    return db
    .collection("likesComments")
    .where("idPost", "==", postID)
    .onSnapshot(({ docs }) => {

        const likesComments = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id
            }
        })

      callback(likesComments)
    })
}

export const getLikesByPost = (postID, callback) => {
    return db
    .collection("likes")
    .where("idPost", "==", postID)
    .onSnapshot(({ docs }) => {

        const likes = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id
            }
        })

      callback(likes)
    })
}

export const getCommentsByPost = (postID, callback) => {
    return db
    .collection("comments")
    .where("idPost", "==", postID)
    .onSnapshot(({ docs }) => {

        const comments = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id
            }
        })

      callback(comments)
    })
}

export const getRequestbyUser = (fromUserID, toUserID, callback) => {

    return db
    .collection("followRequests")
    .where("fromUserID", "==", fromUserID)
    .where("toUserID", "==", toUserID)
    .onSnapshot(({ docs }) => {
        const res = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id
            }
        })
        if(res[0])
            callback(res[0])
        else
            callback([])
    })

}

export const getRequestbyUserToUser= (fromUserID, toUserID, callback) => {

    return db
    .collection("followRequests")
    .where("fromUserID", "==", fromUserID)
    .where("toUserID", "==", toUserID)
    .onSnapshot(({ docs }) => {
        const res = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id
            }
        })
        if(res[0])
            callback(res[0])
        else
            callback([])
    })

}

export const getRequestbyUserPendings = (toUserID, callback) => {
    return db
    .collection("followRequests")
    .where("toUserID", "==", toUserID)
    .where("view", "==", false)
    .onSnapshot(({ docs }) => {
        if(!docs.length) callback([])
        const req = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id
            return {...data,id}
        })
        callback(req)
    })
}

export const getRequestbyUserAccepted = (toUserID, callback) => {
    return db
    .collection("followRequests")
    .where("toUserID", "==", toUserID)
    .where("view", "==", true)
    .onSnapshot(({ docs }) => {
        if(!docs.length) callback([])
        const req = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id
            const createAt = data.acceptedAt
            return {...data, createdAt:+createAt.toDate(), id}
        })
        callback(req)
    })
}

export const getRequestbyUserNotif = (toUserID, callback) => {
    return db
    .collection("followRequests")
    .where("toUserID", "==", toUserID)
    //.where("view", "==", false)
    .where("notif", "==", false)
    .onSnapshot(({ docs }) => {
        if(!docs.length) callback([])
        const req = docs.map(doc =>{
            const data = doc.data()
            const id = doc.id
            return {...data,id}
        })
        callback(req)
    })
}

export const getPostsSaved = (userID, callback) => {

    return db
    .collection("saves")
    .where("userID", "==", userID)
    .orderBy("saveAt", "desc")
    .onSnapshot(({ docs }) => {

        const newPosts = docs.map(doc=>{

            const data = doc.data()
            const id = doc.id
            const saveAt = data.saveAt

            return {
                ...data,
                id,
                saveAt: +saveAt.toDate()
            }
        })

        callback(newPosts)
    })
}

export const deletePost = (doc) => {
    return db
    .collection("posts")
    .doc(doc)
    .delete()
}

export const getCommentsbyPost = (idPost, callback) => {
    return db
    .collection("comments")
    .orderBy("createdAt", "desc")
    .where("idPost", "==", idPost)
    .onSnapshot(({ docs }) => {
      const comments = docs.map(getMapPosts)
      callback(comments)
    })
}

export const getCommentsbyPostArray = (postArray, callback) => {
    return db
    .collection("comments")
    .where("idPost", "in", postArray)
    .orderBy("createdAt", "desc")
    .onSnapshot(({ docs }) => {
      const comments = docs.map(getMapPosts)
      callback(comments)
    })
}

export const getPostbyID = (id, callback) => {

    return db
    .collection("posts")
    .doc(id)
    .onSnapshot((doc) => {
        const data = doc.data()
        const id = doc.id
        const createAt = data.createdAt

        const post = {
            ...data,
            id,
            createdAt: +createAt.toDate()
        }

        callback(post)
    });
}

export const UpdateLikeCountPost = (idPost, type) => {

    var post = db.collection('posts').doc(idPost);
    post.update({
        likeCount: firebase.firestore.FieldValue.increment(type)
    });
}

export const UpdatefollowUser = (followID, FollowerID) => {

    var user = db.collection('users').doc(followID);
    var user2 = db.collection('users').doc(FollowerID);
    user.update({
        followsCount: firebase.firestore.FieldValue.arrayUnion(FollowerID)
    });

    user2.update({
        followersCount: firebase.firestore.FieldValue.arrayUnion(followID)
    });
}

export const RemovefollowUser = (followID, FollowerID) => {

    var user = db.collection('users').doc(followID);
    var user2 = db.collection('users').doc(FollowerID);
    user.update({
        followsCount: firebase.firestore.FieldValue.arrayRemove(FollowerID)
    });

    user2.update({
        followersCount: firebase.firestore.FieldValue.arrayRemove(followID)
    });
}


export const UpdateViewNotif = (id) => {

    var notif = db.collection('likes').doc(id);
    notif.update({
        view: true
    });
}

export const UpdateViewCommentsNotif = (id) => {

    var notif = db.collection('comments').doc(id);
    notif.update({
        view: true
    });
}

export const UpdateViewCommentsofCommentsNotif = (id) => {

    var notif = db.collection('commentsOfComments').doc(id);
    notif.update({
        view: true
    });
}


export const updateUser = ({id, userName, displayName, email, phone, keyword, privacy, showActivity, recaptchaRef, oldPhone}) => {


    return new Promise((resolve, reject) => {
        updateProfileUser(displayName, email, phone, recaptchaRef, oldPhone).then(()=> {

            var user = db.collection('users').doc(id);

            const res = user.update({
                userName: userName,
                displayName: displayName,
                email: email,
                phone: phone,
                keyword: keyword,
                private: privacy,
                showActivity: showActivity
            });

            if(res)
                resolve(res)

        }).catch(error => {
            reject(error)
        });
    })

}

export const updateConnect = (id, connect = false) => {

    var user = db.collection('users').doc(id);
    return user.update({
        connect: connect
    });
}

export const userIsTyping = (id, state) => {

    var user = db.collection('users').doc(id);
    return user.update({
        isTyping: state
    });
}

export const updateConnectFirebaseID = (id, connect = false) => {

    var ref = db.collection('users')
    return ref.where("userID_firebase", "==", id)
    .get()
    .then(({ docs }) => {
        return docs.map(doc => ref.doc(doc.id).update({connect: connect}))
    })
}

export const updateAvatarUser = async (img, id, filter='normal') => {

    return new Promise(async (resolve, reject) => {
        try {
            await db.collection('users').doc(id).update({avatar: img,filter});
            await updateAvatarInPosts(img,id,filter);
            await updateAvatarInComments(img,id,filter);
            await updateAvatarInCommentsInComments(img,id,filter);
            await updateAvatarInRequests(img,id,filter);
            await updateAvatarInLikes(img,id,filter);
            resolve(true)
        } catch (error) {
            reject(error)
        }
    });

}

export const updateAvatarInPosts = async (img, id, filter='normal') => {
    return db
      .collection("posts")
      .where("userID", "==", id)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("posts").doc(doc.id).update({
            avatar: img,
            filterAvatar: filter
          });
        });
      });
}

export const updateAvatarInComments = async (img, id, filter='normal') => {
    return db
      .collection("comments")
      .where("userID", "==", id)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("comments").doc(doc.id).update({
            avatar: img,
            filterAvatar: filter
          });
        });
      });
}

export const updateAvatarInCommentsInComments = async (img, id, filter='normal') => {
    return db
      .collection("commentsOfComments")
      .where("userID", "==", id)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("commentsOfComments").doc(doc.id).update({
            avatar: img,
            filterAvatar: filter
          });
        });
      });
}

export const updateAvatarInRequests = async (img, id, filter='normal') => {
    return db
      .collection("followRequests")
      .where("fromUserID", "==", id)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("followRequests").doc(doc.id).update({
            fromAvatar: img,
            fromAvatarFilter: filter
          });
        });
      });
}

export const updateAvatarInLikes = async (img, id, filter='normal') => {
    return db
      .collection("likes")
      .where("userID", "==", id)
      .get()
      .then(({docs}) => {
        return docs.map((doc) => {
          return db.collection("likes").doc(doc.id).update({
            avatarLike: img,
            avatarLikeFilter: filter
          });
        });
      });
}

export const UpdateCommentCountPost = (idPost, count) => {

    var post = db.collection('posts').doc(idPost);
    post.update({
        commentCount: firebase.firestore.FieldValue.increment(count)
    });
}

export const UpdateLikeCountComment = (id, type) => {

    var post = db.collection('comments').doc(id);
    post.update({
        likeCount: firebase.firestore.FieldValue.increment(type)
    });
}

export const UpdateLikeCountCommentOfComments = (id, type) => {

    var post = db.collection('commentsOfComments').doc(id);
    post.update({
        likeCount: firebase.firestore.FieldValue.increment(type)
    });
}

export const addPostToFav = (idPost, userName, avatar, userID, likeUserID, avatarLike, img, avatarLikeFilter='normal') => {
    return db.collection("likes").add({
        idPost,
        userName,
        avatar,
        userID,
        view:false,
        likeUserID,
        avatarLike,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        img,
        avatarLikeFilter
    })
}

export const addPostToSaves = (idPost, userID, img, filter) => {
    return db.collection("saves").add({
        idPost,
        userID,
        img,
        saveAt: firebase.firestore.Timestamp.fromDate(new Date()),
    })
}

export const addUserToCollection = (userID_firebase, displayName, userName, avatar, email, phone, keyword) => {

    if(!avatar) avatar = "https://www.seekpng.com/png/full/245-2454602_tanni-chand-default-user-image-png.png"
    if(typeof email == "undefined") email = ''

    return db.collection("users")
    .add({
        userID_firebase,
        displayName,
        userName,
        avatar,
        email,
        phone,
        connect: true,
        followsCount: [],
        followersCount : [],
        private: true,
        showActivity: false,
        keyword,
        filter: 'normal',
        isTyping: false,
        chats: []
    })
}

export const addChattoUser = (user, userToAdd) => {

    var user = db.collection('users').doc(user);
    user.update({
        chats: firebase.firestore.FieldValue.arrayUnion(userToAdd)
    });

}

export const getUserInCollection = (user,callback) => {

    let providers = user.providerData.map(prov => prov.providerId)

    return db
    .collection("users")
    .where("userID_firebase", "==", user.uid)
    .limit(1)
    .onSnapshot(({ docs }) => {
        const user = docs.map((doc) => {
            return { ...doc.data(), userID: doc.id, providers: providers}
        });

        if(user[0]){
            localStorage.setItem('userMistagram', user[0])
            callback(user[0])
        }

    })

}

export const getUserInCollectionFirebaseID = async (uid) => {

    return db
    .collection("users")
    .where("userID_firebase", "==", uid)
    .limit(1)
    .get()
    .then(({ docs }) => {
        return docs.map((doc) => doc.id);
    }).catch(err=> {
        console.log(err)
    })

}

export const getUserInCollectionByEmail = async email => {

    return await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get()
    .then(({ docs }) => {
        return docs.map(doc => doc.id)
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

export const getUserInCollectionByUsername = async username => {

    return await db
    .collection("users")
    .where("userName", "==", username)
    .limit(1)
    .get()
    .then(({ docs }) => {
        return docs.map(doc => doc.data().email)
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

export const getUserByKeyword = async (keyword, callback) => {

    let result = false

    const res = await db
    .collection("users")
    .where('keyword', 'array-contains', keyword.toLowerCase())
    .get()
    .then(({ docs }) => {
        if(!docs) callback('')
        const users = docs.map(doc => {
            result = true
            return {...doc.data(), userID: doc.id}
        })

        callback(users)
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    if(!result) callback('')
    return res

}

export const getUserByDoc = (doc,callback) => {

    return db
    .collection("users")
    .doc(doc)
    .onSnapshot((doc) => {
        const user = { ...doc.data(), userID: doc.id}
        callback(user)
    })

}

export const getUserByDoc_2 = async (doc,callback) => {

    return db
    .collection("users")
    .doc(doc)
    .get()
    .then((doc) => {
        return doc.data()
    })

}

export const removePostToFav = doc => {

    return db
    .collection("likes")
    .doc(doc)
    .delete()
}

export const removeFollowRequest = doc => {

    return db
    .collection("followRequests")
    .doc(doc)
    .delete()
}

export const removeLikesComments = doc => {

    return db
    .collection("likesComments")
    .doc(doc)
    .delete()
}

export const removePostSaves = idDoc => {

    return db
    .collection("saves")
    .doc(idDoc)
    .delete()

}

export const getLikesUser = (userID, callback) => {
    return db
    .collection("likes")
    .where("likeUserID", "==", userID)
    .onSnapshot(({ docs }) => {

        const likesUser = docs.map(doc=>{

            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id,
            }

        })

        callback(likesUser)
    })
}

export const getNotifLikesComments = (userID, callback) => {

    return db
    .collection("likes")
    .where("userID", "==", userID)
    .where("view", "==", false)
    .onSnapshot(({ docs }) => {

        const likesUser = docs.map(doc=>{

            const data = doc.data()
            const id = doc.id
            const createdAt = data.createdAt

            return {
                ...data,
                createdAt: +createdAt.toDate(),
                id,
            }

        })

        callback(likesUser)
    })
}

export const getNotifComments = (userID, callback) => {

    return db
    .collection("comments")
    .where("toUserID", "==", userID)
    .where("view", "==", false)
    .onSnapshot(({ docs }) => {

        const commentsUser = docs.map(doc=>{

            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id,
            }

        })

        callback(commentsUser)
    })
}

export const getNotifCommentsOfComments = (userID, callback) => {

    return db
    .collection("commentsOfComments")
    .where("toUserID", "==", userID)
    .where("view", "==", false)
    .onSnapshot(({ docs }) => {

        const commentsUser = docs.map(doc=>{

            const data = doc.data()
            const id = doc.id

            return {
                ...data,
                id,
            }

        })

        callback(commentsUser)
    })
}

export const getActivity = (userID, callback, callback2, callback3) => {

    db
    .collection("comments")
    .where("toUserID", "==", userID)
    .orderBy("createdAt", "desc")
    .onSnapshot(({ docs }) => {
        const res = docs.map(doc=>{
            const data = doc.data()
            const id = doc.id
            const createdAt = data.createdAt
            return {...data,createdAt: +createdAt.toDate(),id}
        })
        callback(res)
    })

    db
    .collection("likes")
    .where("userID", "==", userID)
    .orderBy("createdAt", "desc")
    .onSnapshot(({ docs }) => {
        const res = docs.map(doc=>{
            const data = doc.data()
            const id = doc.id
            const createdAt = data.createdAt
            return {...data, createdAt: +createdAt.toDate(), id}
        })
        callback2(res)
    })

    db
    .collection("commentsOfComments")
    .where("toUserID", "==", userID)
    .orderBy("createdAt", "desc")
    .onSnapshot(({ docs }) => {
        const res = docs.map(doc=>{
            const data = doc.data()
            const id = doc.id
            const createdAt = data.createdAt
            return {...data,createdAt: +createdAt.toDate(),id}
        })
        callback3(res)
    })

}

export const generateKeyWords = name => {
    let result = []
    let acum = ''
    name = name.replace(" ","").toLowerCase()
    for (let i = 0; i < name.length; i++){
        result.push(name.charAt(i))
        acum = name.charAt(i)
            for (let j = i+1; j < name.length; j++) {
                acum+=name.charAt(j);
                result.push(acum)
            }
    }
    return result
}
