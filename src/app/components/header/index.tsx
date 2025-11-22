"use client"
import Link from "next/link";
import React from "react";
import {API_URL} from "@/shared";
import {usePathname, useRouter} from 'next/navigation';

const Header: React.FC = () => {
    const router = useRouter();
    const isSignInPage = usePathname().includes("/sign-in");

    const signOut = async () => {
        const res = await fetch(API_URL + "account/logout", {method: "POST", credentials: "include"});
        if (res.status === 200) {
            router.push("/sign-in");
        } else {
            alert(`Failed to log out, please try again`);
        }
    }
    return (<header className="bg-gray-900 text-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between p-4">
            <div className="text-2xl font-bold">
                <Link href="/">
                    MediaServer
                </Link>
            </div>
            {!isSignInPage &&
                <button className='hover:text-blue-400 transition' onClick={signOut}>
                    Sign out
                </button>
            }
        </nav>
    </header>)
        ;
};

export default Header;
