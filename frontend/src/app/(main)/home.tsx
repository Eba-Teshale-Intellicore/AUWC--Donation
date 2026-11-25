"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Homes() {
  const imageData = {
    images: [
      {
        id: 1,
        src: "/evasue.png",
        alt: "AUWC Campus",
        width: 50,
        height: 50,
      },
      {
        id: 2,
        src: "/AUWC.jpeg",
        alt: "AUWC Community Events",
        width: 50,
        height: 50,
      },
      {
        id: 3,
        src: "/niphgfx.jpeg",
        alt: "AUWC Donation Activities",
        width: 100,
        height: 50,
      },
      {
        id: 4,
        src: "/gps.jpeg",
        alt: "AUWC Community",
        width: 100,
        height: 50,
      },
      {
        id: 5,
        src: "/AUWC.jpeg",
        alt: "AUWC Community",
        width: 100,
        height: 50,
      },
      {
        id: 6,
        src: "/hotk.jpg",
        alt: "Hope of the Kingdom",
        width: 100,
        height: 50,
      },
      {
        id: 6,
        src: "/logos.jpg",
        alt: "AUWC Community",
        width: 100,
        height: 50,
      },
    ],
  };
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <header className="flex w-full items-center justify-center border-b border-gray-700 ">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-around px-4 py- sm:px-6 lg:px-8">
          <Image
            className=""
            src="/logos.jpg"
            alt="AUWC logo"
            width={80}
            height={100}
            priority
          />
          <Image
            className=""
            src="/hotk.jpg"
            alt="AUWC logo"
            width={80}
            height={100}
            priority
          />
        </div>
      </header>

      <main
        className="flex w-full flex-1 flex-col items-center justify-center
      md:py-18 py-25 px-1 dark:invert"
      >
        <h1 className="text-3xl md:text-5xl font-black max-w-[650px] text-center py-10 leading-tight">
          AUWC Evasue Community Events, Donations & Fundraising
        </h1>
        <p className="text-gray-500 text-center max-w-[500px] mb-8">
          Bringing our community together to support meaningful causes,
          celebrate special moments, and create lasting impact.
        </p>
        <div className="flex items-center justify-center gap-12.5 my-5 pb-10 md:pb-1">
          <button className="rounded-lg border border-amber-900 bg-amber-900 px-8 py-3 font-semibold text-white transition hover:bg-amber-800 cursor-pointer">
            Donate Now
          </button>

          <button className="rounded-lg border border-amber-900 px-8 py-3 font-semibold text-amber-900 transition hover:bg-amber-50 cursor-pointer">
            Get Tickets
          </button>
        </div>
        <div
          id="events"
          className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 py-1 sm:px-6 md:py-0 lg:px-8 dark:invert"
        >
          {/* Left gradient */}

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-35 bg-gradient-to-r from-zinc-50 via-zinc-50/70 to-transparent dark:from-black dark:via-black/70" />

          {/* Right gradient */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-35 bg-gradient-to-l from-zinc-50 via-zinc-50/70 to-transparent dark:from-black dark:via-black/70" />

          <div className="w-full overflow-hidden py-4">
            <motion.div
              className="flex w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {[...imageData.images, ...imageData.images].map(
                (image, index) => (
                  <div
                    key={`${image.id}-${index}`}
                    className="flex shrink-0 items-center gap-9 pr-9"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="h-14 w-14 rounded-full border-2 border-gray-900 object-cover"
                    />
                  </div>
                ),
              )}
            </motion.div>
          </div>
          <div className="w-full overflow-hidden py-4">
            <motion.div
              className="flex w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {[...imageData.images, ...imageData.images].map(
                (image, index) => (
                  <div
                    key={`${image.id}-${index}`}
                    className="flex shrink-0 items-center gap-9 pr-9"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="h-14 w-14 rounded-full border-2 border-gray-900 object-cover"
                    />
                  </div>
                ),
              )}
            </motion.div>
          </div>
        </div>
      </main>
      {/* Fooeter  */}
      <footer className="flex w-full items-center justify-center border-t border-gray-700 gap-10 px-8 py-4">
        <span className="text-gray-500">© 2026 AUWC</span>
        <div className="flex gap-2">
          <span className="text-gray-500 underline">Privacy</span>
          <span className="text-gray-500 underline">Terms</span>
        </div>
      </footer>
    </div>
  );
}
