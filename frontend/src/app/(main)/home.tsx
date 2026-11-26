"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const imageData = [
  { id: 1, src: "/evasue.png", alt: "AUWC Campus" },
  { id: 2, src: "/AUWC.jpeg", alt: "AUWC Community Events" },
  { id: 3, src: "/niphgfx.jpeg", alt: "AUWC Donation Activities" },
  { id: 4, src: "/gps.jpeg", alt: "AUWC Community" },
  { id: 5, src: "/AUWC.jpeg", alt: "AUWC Community" },
  { id: 6, src: "/hotk.jpg", alt: "Hope of the Kingdom" },
  { id: 7, src: "/logos.jpg", alt: "AUWC Community" },
];

export default function Homes() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-1 py-25 md:py-18">
        <h1 className="max-w-[650px] py-10 text-center text-3xl leading-tight font-black md:text-5xl text-white">
          AUWC Evasue Community Events, Donations & Fundraising
        </h1>
        <p className="mb-8 max-w-[500px] text-center text-gray-500">
          Bringing our community together to support meaningful causes,
          celebrate special moments, and create lasting impact.
        </p>
        <div className="my-5 flex items-center justify-center gap-12.5 pb-10 md:pb-1">
          <Link
            href="/donate"
            className="cursor-pointer rounded-lg border border-amber-900 bg-amber-900 px-8 py-3 font-semibold text-white transition hover:bg-amber-800"
          >
            Donate Now
          </Link>

          <button
            type="button"
            className="cursor-pointer rounded-lg border border-amber-900 px-8 py-3 font-semibold text-amber-900 transition hover:bg-amber-50"
          >
            Get Tickets
          </button>
        </div>

        <div
          id="events"
          className="relative mx-auto w-full max-w-2xl overflow-hidden px-4 py-1 sm:px-6 md:py-0 lg:px-8"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-35 bg-gradient-to-r from-zinc-50 via-zinc-50/70 to-transparent dark:from-black dark:via-black/70" />
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
              {[...imageData, ...imageData].map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="flex shrink-0 items-center gap-9 pr-9"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border-2 border-gray-900 object-cover"
                  />
                </div>
              ))}
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
              {[...imageData, ...imageData].map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="flex shrink-0 items-center gap-9 pr-9"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border-2 border-gray-900 object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
