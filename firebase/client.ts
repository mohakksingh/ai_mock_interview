// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDcvSyP7h-_iZtnkzL6d-uJzHpTAxyYHEc",
    authDomain: "prepwise-219e1.firebaseapp.com",
    projectId: "prepwise-219e1",
    storageBucket: "prepwise-219e1.firebasestorage.app",
    messagingSenderId: "753520541030",
    appId: "1:753520541030:web:1d31e885dd64de41599ca7",
    measurementId: "G-JFWGWTZ9JE"
};

const app =!getApps().length ? initializeApp(firebaseConfig) :getApp();

export const auth=getAuth(app);
export const db=getFirestore(app);