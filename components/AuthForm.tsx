'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React from 'react'
import {z} from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,

} from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import {auth, provider} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";


const authFormSchema=(type:FormType)=>{
    return z.object({
        name:type==='sign-up' ? z.string().min(3): z.string().optional(),
        email:z.string().email(),
        password:z.string().min(3)
    })
}

const AuthForm = ({type}:{type:FormType}) => {

    const router=useRouter();
    const formSchema=authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type==='sign-up'){

                const {name,email,password}=values;

                if (!name || !email || !password) {
                    toast.error("Please fill all the fields");
                    return;
                }

                const userCredentials=await createUserWithEmailAndPassword(auth,email,password);



                const result=await signUp({
                    uid:userCredentials.user.uid,
                    name:name!,
                    email,
                    password
                })
                if (!result?.success){
                    toast.error(result?.message);
                    return;
                }

                await sendEmailVerification(userCredentials.user);

                toast.success("Account created successfully.Please check Your email to verify your account");
                router.push('/sign-in')
            }else{
                const {email,password}=values;

                const userCredential=await signInWithEmailAndPassword(auth,email,password);

                const idToken=await userCredential.user.getIdToken();

                if (!idToken){
                    toast.error("Sign in failed");
                    return;
                }

                if(!userCredential.user.emailVerified){
                    toast.error("Please verify your email before signing in");
                    await sendEmailVerification(userCredential.user)
                    toast.info("A new verification email has been sent");
                    return;
                }

                await signIn({
                    email,
                    idToken
                })

                toast.success("Signed in successfully");
                router.push('/')

            }
        }catch (error){
            console.error("Auth error:", error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error("This email is already in use");
                    break;
                case 'auth/invalid-email':
                    toast.error("Invalid email format");
                    break;
                case 'auth/weak-password':
                    toast.error("Password is too weak");
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    toast.error("Invalid email or password");
                    break;
                default:
                    toast.error(`There was an error: ${error.message || error}`);
            }
        }
    }

    async function handleGoogleSignIn (){
        try{
            if(type==='sign-up'){
                const userCredentials=await signInWithPopup(auth,provider);
                const idToken=await userCredentials.user.getIdToken();

                if(!idToken){
                    toast.error("Google sign-in failed");
                    return;
                }

                const email=userCredentials.user.email;
                if (!email){
                    toast.error('No email found in google account');
                    return;
                }

                const result=await signUp({
                    uid:userCredentials.user.uid,
                    name:userCredentials.user.displayName!,
                    email,

                })
                if (!result?.success){
                    toast.error(result?.message);
                    return;
                }
                toast.success("Signed up successfully, Please signIn");
                router.push('/sign-in')
            }else{
                const userCredentials=await signInWithPopup(auth,provider);

                const idToken=await userCredentials.user.getIdToken();

                if(!idToken){
                    toast.error("Google sign-in failed");
                    return;
                }

                const email=userCredentials.user.email;
                if (!email){
                    toast.error('No email found in google account');
                    return;
                }

                await signIn({ email, idToken });
                toast.success("Signed in with Google successfully");
                router.push('/');
            }
        }catch (e){
            console.error("Google sign-in error:", e);
            toast.error("Google sign-in failed");
        }
    }

    const isSignIn= type==='sign-in';
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38}/>
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>

                <h3>Practice job Interview with AI</h3>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!isSignIn && (
                        <FormField control={form.control} name="name" label="Name" placeholder="Your Name" />
                    )}
                    <FormField control={form.control} name="email" label="Email" placeholder="Your Email Address" type="email" />
                    <FormField control={form.control} name="password" label="Password" placeholder="Enter Your Password" type="password"/>
                    <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
                </form>
            </Form>

                {isSignIn?  (
                    <Button className="btn rounded-lg" onClick={handleGoogleSignIn}>
                <Image src="/google-icon.svg" alt="google" height={24} width={24} />
                Sign In With Google
            </Button>
                    ):(
                    <Button className="btn rounded-lg" onClick={handleGoogleSignIn}>
                <Image src="/google-icon.svg" alt="google" height={24} width={24} />
                Sign Up With Google
            </Button>
                    )}
                <p className="text-center"
                   >
                    {isSignIn? 'No account yet?' : 'Have an account already?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                        {!isSignIn ? 'Sign in' : 'Sign up'}
                    </Link>
                </p>
            </div>

        </div>
    )
}
export default AuthForm
