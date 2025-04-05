export default function About() {
    return(
        <div className="bg-light-third-background dark:bg-dark-third-background rounded-2xl 
                        text-light-text dark:text-dark-text font-text
                        text-lg md:text-xl lg:text-2xl
                        p-6 md:p-8 lg:p-12
                        w-4/5 lg:w-1/2
                        absolute top-1/2 left-1/2 transform -translate-1/2">
            <p>
                this website was built for self-improvement.
            </p>
            <br />
            <p>
                it uses gemini api to interpret the dreams and firebase for user-authentication and database.
                i used react and tailwindcss for the front-end.
            </p>
            <br />
            <p>
                linkedin: <a href="https://www.linkedin.com/in/enes-güneş-88a571286" className="hover:border-b-2 font-semibold">Enes Güneş</a>
            </p>
            <br />
            <p>
                github: <a href="https://github.com/benenesgunes" className="hover:border-b-2 font-semibold">benenesgunes</a>
            </p>
        </div>
    )
}