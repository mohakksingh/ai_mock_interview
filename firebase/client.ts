// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_MEASUREMENTID
};
const app =!getApps().length ? initializeApp(firebaseConfig) :getApp();

export const provider=new GoogleAuthProvider();
export const auth=getAuth(app);
export const db=getFirestore(app);