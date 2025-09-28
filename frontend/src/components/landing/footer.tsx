import { APP_NAME, footerLinks } from "@/lib/constants";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router";
import NewsLetterForm from "../news-letter-form";
import Logo from "../shared/logo";

export default function Footer() {
    return (
        <footer className="dark:bg-slate-900 bg-slate-50 ">
            <div className="max-w-[1400px] pt-16 pb-8 mx-auto px-7 sm:px-6 lg:px-8">
                <section className="flex flex-col xl:flex-row gap-10 pb-10 lg:gap-20 lg:justify-between">
                    <section>
                        <Logo />
                        <p className="mb-6 max-w-xs">
                            Your gateway to dorm life. Discover, explore, and share your campus living experience.
                        </p>
                        <div className="flex items-center gap-4">
                            <a target="_blank" className="flex items-center justify-center hover:text-blue-600" href={'https://www.facebook.com/share/12K662nTcjn/?mibextid=wwXIfr'}><FaFacebookF className="size-5" /></a>
                            <a target="_blank" className="flex items-center justify-center hover:text-pink-500" href={'https://www.instagram.com/fisheeeshhh/'}><FaInstagram className="size-5" /></a>
                            <a target="_blank" className="flex items-center justify-center hover:text-blue-500" href={'https://www.linkedin.com/in/syp-dev'}><FaLinkedin className="size-5" /></a>
                            <a target="_blank" className="flex items-center justify-center hover:text-black" href={'https://github.com/fisheeesh'}><FaXTwitter className="size-5" /></a>
                        </div>
                    </section>
                    <section className="grid grid-cols-2 gap-10">
                        {footerLinks.map(({ title, items }, categoryIndex) => (
                            <div key={categoryIndex}>
                                <h3 className="mb-4 text-base md:text-lg font-bold uppercase">{title}</h3>
                                <ul className="space-y-3">
                                    {items.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                to={link.href}
                                                className={`text-muted-foreground hover:text-black dark:hover:text-white text-sm md:text-base transition-colors duration-300 cursor-pointer`}>{link.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                    <section className="space-y-4">
                        <h4 className="font-medium">Subscribe to our newsletter</h4>
                        <NewsLetterForm />
                    </section>
                </section>
                <div className='border-t'>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <h3 className="mt-8 text-sm text-center ">Copyright © {new Date().getFullYear()} {APP_NAME}. All rights reserved.</h3>
                    </div>
                </div>
            </div>
        </footer>
    )
}
