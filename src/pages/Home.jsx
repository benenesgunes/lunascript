import DreamDark from "../assets/home-dark.png";
import DreamLight from "../assets/home-light.png";
import DreamImage from "../assets/home-2.jpg";
import InceptionImage from "../assets/inception.jpg";
import { useStore } from "../store";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router";

export default function Home() {
    const isDarkMode = useStore((state) => state.isDarkMode);
    const { user, loading } = useAuth();

    const darkBackground = `url(${DreamDark}), linear-gradient(rgba(30, 27, 75, 0.5), rgba(30, 27, 75, 0.5))`;
    const lightBackground = `url(${DreamLight})`;

    if(loading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>

    return(
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <div style={{backgroundImage: isDarkMode ? darkBackground : lightBackground}}
                className="mx-auto w-3/4 h-[50vh] xl:h-[75vh]
                           bg-blend-overlay bg-left-bottom xl:bg-center bg-cover
                           text-light-text dark:text-dark-text font-text
                           rounded-3xl lg:rounded-4xl
                           flex justify-center items-start md:items-end
                           p-4">
                <div className="flex flex-col justify-center items-center md:flex-row md:justify-between md:items-center gap-y-4  
                                md:w-4/5 lg:w-9/10 md:bg-light-secondary-background/30 md:dark:bg-dark-secondary-background/30 p-4 md:p-6 lg:p-8 rounded-2xl">
                    <p className="text-xl md:text-2xl lg:text-3xl md:w-1/2 text-center md:text-start">
                        where dreams unfold and stories take flight
                    </p>
                    <Link to="/dreamjournal">
                        <button className="homeBtn">
                            {user ? "write a dream" : "sign up"}
                        </button>
                    </Link>
                </div>
            </div>
            <div className="homeDivs flex-col">
                <p className="w-4/5 md:w-1/3 lg:w-1/4 text-xl md:text-2xl lg:text-3xl">
                    from dreams to meaning, one entry at a time
                </p>
                <img src={DreamImage} alt="" className="rounded-2xl w-full md:w-2/5" />
            </div>
            <div className="homeDivs flex-col-reverse">
                <img src={InceptionImage} alt="" className="rounded-2xl w-full md:w-2/5" />
                <p className="w-4/5 md:w-1/3 lg:w-1/4 text-xl md:text-2xl lg:text-3xl">
                    unravel the mysteries of your dreams
                </p>
            </div>
            <div className="text-light-text dark:text-dark-text w-2/3 md:w-1/2 mx-auto text-center space-y-4 md:space-y-6 lg:space-y-8">
                <h1 className="font-logo text-3xl md:text-4xl lg:text-5xl">
                    lunascript
                </h1>
                <p className="font-logo text-2xl md:text-3xl lg:text-4xl">
                    your gateway to your subconscious
                </p>
                <Link to="/dreamjournal">
                    <button className="homeBtn">
                        {user ? "write a dream now" : "sign up now"}
                    </button>
                </Link>
            </div>
        </div>
    )
}