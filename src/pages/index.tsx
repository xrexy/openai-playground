import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import type { WebsiteMetaKey, WebsiteRecord } from "../utils/website_meta";
import {
  colors as websiteColors,
  types as websiteTypes,
  themes as websiteThemes,
} from "../utils/website_meta";

interface ToggleableType {
  toggleType: typeof toggleType;
  setMeta: React.Dispatch<
    React.SetStateAction<{
      [key in WebsiteMetaKey]: WebsiteRecord[key][number][];
    }>
  >;
}

function toggleType<MetaKey extends WebsiteMetaKey>(
  key: MetaKey,
  data: WebsiteRecord[MetaKey][number],
  active: boolean,
  onActive: (data: WebsiteRecord[MetaKey][number], key: MetaKey) => void,
  onInactive: (data: WebsiteRecord[MetaKey][number], key: MetaKey) => void
) {
  active ? onActive(data, key) : onInactive(data, key);
}

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [meta, setMeta] = useState<{
    [key in WebsiteMetaKey]: WebsiteRecord[key][number][];
  }>({
    color: [],
    theme: [],
    type: [],
  });

  return (
    <>
      <Head>
        <title>OpenAI Test</title>
        {/* <meta name="description" content="UPDATE ME" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="text-900 flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-800 to-gray-900 px-6 font-sans text-white">
        <AuthShowcase />

        {sessionData?.user === undefined ? (
          <UnauthorizedView />
        ) : (
          <>
            {JSON.stringify(meta)}
            <TypeShowcaseComponent
              data={websiteColors}
              metaKey="color"
              title="Please choose a color"
              toggleType={{ setMeta, toggleType }}
            />
            <TypeShowcaseComponent
              data={websiteTypes}
              metaKey="type"
              title="Please choose a type"
              toggleType={{ setMeta, toggleType }}
            />
            <TypeShowcaseComponent
              data={websiteThemes}
              metaKey="theme"
              title="Please choose a theme"
              toggleType={{ setMeta, toggleType }}
            />
          </>
        )}
      </main>
    </>
  );
};

export default Home;

function TypeShowcaseComponent<MetaKey extends WebsiteMetaKey>({
  data,
  toggleType: { setMeta, toggleType },
  title,
  metaKey,
}: {
  data: WebsiteRecord[MetaKey];
  toggleType: ToggleableType;
  title: string;
  metaKey: MetaKey;
}) {
  return (
    <div>
      <h2 className="pb-2 text-2xl font-bold">{title}</h2>
      <div className="flex w-full flex-row flex-wrap gap-2">
        {data.map((metaData) => (
          <TypeShowcase
            key={metaData}
            metaData={metaData}
            metaKey={metaKey}
            toggleType={{ toggleType, setMeta }}
            title={title}
          />
        ))}
      </div>
    </div>
  );
}

// fix this
function TypeShowcase<MetaKey extends WebsiteMetaKey>({
  toggleType: { setMeta, toggleType },
  metaKey,
  metaData,
}: {
  metaKey: MetaKey;
  metaData: WebsiteRecord[MetaKey][number];
  toggleType: ToggleableType;
  title: string;
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      data-active={isActive}
      onClick={() => {
        setIsActive(!isActive);
        toggleType(
          metaKey,
          metaData,
          isActive,
          (data, key) => {
            console.log(data, key, "active");

            setMeta((prev) => {
              const newMeta = prev[key].filter((meta) => meta !== data);
              return { ...prev, [key]: newMeta };
            });
          },
          (data, key) => {
            console.log(data, key, "inactive");

            setMeta((prev) => {
              const newMeta = [...prev[key], data];
              return { ...prev, [key]: newMeta };
            });
          }
        );
      }}
      className="w-fit cursor-pointer rounded-full bg-slate-600/25 px-6 py-2 font-semibold capitalize text-white no-underline transition hover:bg-slate-500/25 data-[active=true]:bg-slate-600/50 data-[active=true]:hover:bg-slate-500/50"
    >
      {metaData.includes("_") ? metaData.split("_").join(" ") : metaData}
    </div>
  );
}

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
