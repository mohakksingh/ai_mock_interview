import React, {ReactNode} from 'react'
import Link from "next/link";
import Image from "next/image";
import {isAuthenticated} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";
import Navbar from "@/components/Navbar";

const RootLayout = async ({children}:{children:ReactNode}) => {
    const isUserAuthenticated=await isAuthenticated()



    if (!isUserAuthenticated) redirect("/sign-in");
    return (
        <div className="root-layout">
            <Navbar/>
            {children}
        </div>
    )
}
export default RootLayout
