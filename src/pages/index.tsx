import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useDebounce } from "../utils/hooks";

import { trpc } from "../utils/trpc";
import type { WebsiteType } from "../utils/website_meta";
import { types as websiteTypes } from "../utils/website_meta";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>OpenAI Test</title>
        {/* <meta name="description" content="UPDATE ME" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="text-900 flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-800 to-gray-900 text-white">
        <AuthShowcase />

        {sessionData?.user === undefined ? (
          <UnauthorizedView />
        ) : (
          <>
            {websiteTypes.map((type) => (
              <TypeShowcase key={type} type={type} />
            ))}
          </>
        )}
      </main>
    </>
  );
};

export default Home;

const TypeShowcase: React.FC<{ type: WebsiteType }> = ({ type }) => {
  return <div>{type}</div>;
};

/** @deprecated */
const TemporaryOpenAiView: React.FC = () => {
  const [__prompt, setPrompt] = useState("");
  const prompt = useDebounce(__prompt, 1000);

  const { data: imageSrc, isFetching } = trpc.openai.generateImage.useQuery(
    {
      prompt: prompt || "",
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: 1 * 60 * 60,
      trpc: { abortOnUnmount: true },
      enabled: prompt !== "",
    }
  );

  return (
    <>
      <input
        className="text-gray-900"
        onChange={(e) => setPrompt(e.target.value)}
      />
      {prompt}
      {isFetching && <p>Fetching...</p>}
      {imageSrc?.url && (
        <Image
          src={imageSrc.url}
          alt="Randomly generated image"
          width={512}
          height={512}
        />
      )}
    </>
  );
};

const UnauthorizedView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        You are not authorized to view this page
      </p>
    </div>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
