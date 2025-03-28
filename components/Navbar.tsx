"use client"

import React, {useEffect, useRef, useState} from 'react'
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {getCurrentUser, signOut} from "@/lib/actions/auth.action";
import {auth} from "@/firebase/client";
import {LogOut, Settings, User} from "lucide-react";

const Navbar = () => {

    const router=useRouter();
    const [profilePic,setProfilePic]=useState<string | null>(null);
    const [isLoading,setIsLoading]=useState<boolean>(true);
    const [dropDown,setDropDown]=useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const fetchUser=async ()=>{
            try{
                const user=await getCurrentUser();


                if(!user){
                    router.push("/sign-in")
                    return;
                }


                const firebaseUser=auth.currentUser;

                console.log(firebaseUser)

                const photoUrl = firebaseUser?.photoURL || "/profilepic.jpg";
                console.log(photoUrl)
                setProfilePic(photoUrl);

            }catch (e){
                console.error("Error fetching user",e);
            }finally {
                setIsLoading(false);
            }
        }

        fetchUser();


        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[router])




    const handleDropDown=()=>{
        setDropDown(!dropDown)
    }

    const handleSignOut=async ()=>{
        await signOut();
        router.push("/sign-in")
    }
    return (
        <nav className="flex flex-row justify-between">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width={38} height={32}/>
                <h2 className="text-primary-100">PrepWise</h2>
            </Link>
            {/*TODO: Logout functionality and profile button */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={handleDropDown}
                    className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full
                           hover:ring-2 hover:ring-primary-500 focus:outline-none
                           transition-all duration-200 ease-in-out"
                >
                    {profilePic ? (
                        <Image
                            src={profilePic}
                            alt="Profile Picture"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "/profilepic.png";
                            }}
                        />
                    ) : (
                        <span className="w-8 h-8 rounded-full bg-primary-100 text-white
                                     flex items-center justify-center font-bold">
                        ?
                    </span>
                    )}
                </button>

                {dropDown && (
                    <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg
                               ring-1 ring-black ring-opacity-5 divide-y divide-gray-100
                               animate-dropdown-fade z-50"
                    >
                        <div className="py-1">
                            <button
                                onClick={() => {/* Navigate to profile */}}
                                className="group flex items-center w-full px-4 py-2 text-sm
                                       text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                Profile
                            </button>
                            <button
                                onClick={() => {/* Navigate to settings */}}
                                className="group flex items-center w-full px-4 py-2 text-sm
                                       text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                Settings
                            </button>
                        </div>
                        <div className="py-1">
                            <button
                                onClick={handleSignOut}
                                className="group flex items-center w-full px-4 py-2 text-sm
                                       text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
export default Navbar
