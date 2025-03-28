"use client"

import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {signOut} from "@/lib/actions/auth.action";

const Navbar = () => {

    const router=useRouter();


    const handleSignOut=async ()=>{
        await signOut();
        router.push("/sign-in")
    }
    return (
        <nav className="flex flex-row justify-between">
            <Link href="/" className="flex items-center gap-2">
                <Image src="logo.svg" alt="logo" width={38} height={32}/>
                <h2 className="text-primary-100">PrepWise</h2>
            </Link>
            {/*TODO: Logout functionality and profile button */}
            <div>
                <button onClick={handleSignOut}>
                    SignOut
                </button>
            </div>
        </nav>
    )
}
export default Navbar
