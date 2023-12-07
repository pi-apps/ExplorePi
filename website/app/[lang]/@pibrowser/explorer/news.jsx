"use client";
import { Rowdies, Teko } from "next/font/google";
import Image from "next/image";
import appicon from "public/appicon.png";
import { useState } from "react";

const rowdies = Rowdies({ subsets: ["latin"], weight: "700" });
const teko = Teko({ subsets: ["latin"] });
export default function NewsPage({firstlogin='visible'}) {
    const [vis,setvis] = useState(firstlogin)
const closemodal = () =>{
    setvis('hidden')
}

  return (
    <>
      <section className={vis + " fixed w-screen h-screen z-50"}>
        <div className=" absolute bg-black h-full w-full opacity-30"></div>
        <div className=" relative flex justify-center text-black items-center w-full h-full">
          <div className=" overflow-scroll w-80 h-3/4 bg-white rounded-lg flex justify-center px-5 py-5">
            <div className="text-center">
              <h1
                className={
                  rowdies.className +
                  " mb-5 text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
                }
              >
                News
              </h1>
              <div className={teko.className + " text-2xl mb-3"}>
                Download Our New App on google play
              </div>
              <div className="flex justify-center">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={appicon}
                    alt="Picture of the app icon"
                    sizes="100vw"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
              </div>

              <menu className=" font-mono text-lg">
                <li>New Feature</li>
                <li>New Style</li>
                <li>More Statistic</li>
              </menu>
              <div className="px-10">
                <a href="https://play.google.com/store/apps/details?id=net.explorepi.pi&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                  <img
                    alt="Get it on Google Play"
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  />
                </a>
              </div>
              <div className="font-mono">
                    IPhone Version will be released soon!
              </div>
              <div className="font-mono">
                    Stay tuned!
              </div>
              <button className=" bg-red-600 px-5 py-2 rounded text-black font-semibold " onClick={closemodal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
