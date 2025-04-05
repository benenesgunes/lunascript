import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { Link } from "react-router";
import { useStore } from "../store";

export default function Footer() {
    const { isDarkMode, setIsDarkMode } = useStore();

    return(
        <footer className="text-light-text dark:text-dark-text font-text 
                           border-t-2 border-light-third-background dark:border-dark-third-background
                           p-4 md:p-6
                           w-9/10 mx-auto my-2 md:my-0
                           flex flex-col justify-center items-center gap-y-4 md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl md:text-[2.5rem] lg:text-[2.75rem] font-logo ">
                <Link to="/">lunascript</Link>
            </h1>
            <div className="flex items-center gap-x-4">
                <Link className="headerLink" to="/">
                    home
                </Link>
                <Link className="headerLink" to="/about">
                    about
                </Link>
                {isDarkMode ? 
                    <CiLight onClick={() => {
                        setIsDarkMode();
                        document.getElementById("html").classList.toggle("dark");
                    }} className="text-2xl md:text-3xl lg:text-4xl cursor-pointer" />
                    :
                    <CiDark onClick={() => {
                        setIsDarkMode();
                        document.getElementById("html").classList.toggle("dark");
                    }} className="text-2xl md:text-3xl lg:text-4xl cursor-pointer" />
                }
            </div>
        </footer>
    )
}