import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useRouter } from "next/router";

import { Provider } from "../context";
const Layout = ({ children }) => {
    const router = useRouter();

    return (
        <>
            <Provider>
                <ToastContainer autoClose={2000} />
                <Head>
                    <title>proLearning</title>
                    <meta
                        name="description"
                        content="proLearning is an online learning Web Application that can be used by students and teachers from around the globe"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {router.pathname === "/user/course/[slug]" ? (
                    <main>{children}</main>
                ) : (
                    <>
                        <Navbar currentPath={router.pathname} />
                        <main className="min-h-fullView">{children}</main>
                        <Footer />
                    </>
                )}
            </Provider>
        </>
    );
};

export default Layout;
