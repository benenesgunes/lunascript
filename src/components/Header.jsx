import { Link } from "react-router";
import { SiDreamstime } from "react-icons/si";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { CiLight, CiDark } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { useStore } from "../store";
import { useState } from "react";

export default function Header() {
    const { isDarkMode, setIsDarkMode } = useStore();
    const [ isNavbarOpen, setIsNavbarOpen ] = useState(false);

    return(
        <>
            <header className="relative flex justify-between items-center 
                               text-light-text dark:text-dark-text font-text
                               p-4 md:px-6 lg:px-8 md:py-4 lg:py-6">
                <div className="hidden lg:flex gap-x-6">
                    <Link to="/dreamjournal" className="headerLink">
                        write a dream
                    </Link>
                    <Link to="/dreamarchive" className="headerLink">
                        your dream archive
                    </Link>
                </div>
                <h1 className="text-3xl md:text-[2.5rem] lg:text-[2.75rem] font-logo 
                            absolute left-1/2 transform -translate-x-1/2">
                    <Link to="/">lunascript</Link>
                </h1>
                <Link to="/profile">
                    <SiDreamstime className="text-xl md:text-2xl lg:text-3xl" />
                </Link>
                <RxHamburgerMenu onClick={() => {document.getElementById("navbar").classList.toggle("navbarOpen"); setIsNavbarOpen((m) => !m)}} className="text-2xl md:text-3xl lg:hidden cursor-pointer" />
            </header>

            {/* invisible div to close navbar when touching anywhere else */}
            {isNavbarOpen && <div onClick={() => {document.getElementById("navbar").classList.toggle("navbarOpen"); setIsNavbarOpen((m) => !m)}} className="fixed inset-0 z-[998]"></div>}

            {/* mobile navbar */}
            <div id="navbar" className="fixed top-0 right-[-100%] z-[1000] transition-all
                                        w-2/3 md:w-1/2 h-lvh
                                        bg-light-third-background dark:bg-dark-third-background shadow-2xl
                                        text-light-text dark:text-dark-text
                                        p-4 md:p-6 lg:p-8
                                        flex flex-col gap-y-4 overflow-y-auto">
                <div className="flex flex-row-reverse justify-between w-full">
                    <TfiClose onClick={() => {document.getElementById("navbar").classList.toggle("navbarOpen"); setIsNavbarOpen((m) => !m)}} className="text-2xl md:text-3xl lg:hidden cursor-pointer" />
                    {isDarkMode ? 
                        <CiLight onClick={() => {
                            setIsDarkMode();
                            document.getElementById("html").classList.toggle("dark");
                        }} className="text-3xl md:text-4xl cursor-pointer" />
                        :
                        <CiDark onClick={() => {
                            setIsDarkMode();
                            document.getElementById("html").classList.toggle("dark");
                        }} className="text-3xl md:text-4xl cursor-pointer" />
                    }
                </div>
                <Link to="/" className="md:text-xl font-text border-b-2 p-3 md:p-4">
                    home
                </Link>
                <Link to="/dreamjournal" className="md:text-xl font-text border-b-2 p-3 md:p-4">
                    write a dream
                </Link>
                <Link to="/dreamarchive" className="md:text-xl font-text border-b-2 p-2 md:p-4">
                    your dream archive
                </Link>
                <Link to="/about" className="md:text-xl font-text border-b-2 p-2 md:p-4">
                    about
                </Link>
                <h1 className="text-2xl md:text-3xl font-logo text-center">
                    <Link to="/">lunascript</Link>
                </h1>
                <div className="flex items-center justify-center gap-x-3 md:gap-x-4">
                    <a href="#">
                        <FaInstagram className="text-2xl md:text-3xl cursor-pointer"/>
                    </a>
                    <a href="#">
                        <FaXTwitter className="text-2xl md:text-3xl cursor-pointer" />
                    </a>
                    <a href="#">
                        <FaYoutube className="text-2xl md:text-3xl cursor-pointer" />
                    </a>
                </div>
            </div>
        </>
    )
}