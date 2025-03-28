// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDcvSyP7h-_iZtnkzL6d-uJzHpTAxyYHEc",
    authDomain: process.env.FIREBASE_PROJECT_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECT_PROJECTID,
    storageBucket: process.env.FIREBASE_PROJECT_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_PROJECT_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_PROJECT_APPID,
    measurementId: process.env.FIREBASE_PROJECT_MEASUREMENTID
};
const app =!getApps().length ? initializeApp(firebaseConfig) :getApp();

export const auth=getAuth(app);
export const db=getFirestore(app);