import AnimatedText from "@/components/AnimatedText";
import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 | Yoel Ginting</title>
      </Head>
      <main className="h-[100vh] w-full bg-dark ">
        <Layout className="relative !bg-transparent !pt-16 flex flex-col items-center justify-center">
          <AnimatedText text="404" className=" " />
          <AnimatedText text="Page Not Found." className=" !text-7xl " />
          <Link
            href="/"
            className="self-center !mt-4 inline-block rounded-lg border-2 border-solid bg-dark px-4 py-2
        font-semibold text-light hover:border-light hover:bg-light hover:text-dark 
        "
          >
            Go To Home
          </Link>
        </Layout>
      </main>
    </>
  );
};

export default NotFound;
