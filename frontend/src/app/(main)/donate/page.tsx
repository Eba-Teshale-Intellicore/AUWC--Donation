"use client";

import Image from "next/image";
import { useState } from "react";

export default function Donate() {
  const [selectedAmount, setSelectAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");

  const amounts = [10, 50, 100, 500, 1000];
  const handlePresentAmount = (amount: number) => {
    setSelectAmount(amount);
    setCustomAmount("");
  };
  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectAmount(null);
  };
  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-black">
      <main className="w-full min-h-7xl">
        <section className="relative w-full">
          <div className="relative h-[450px] w-full overflow-hidden bg-zinc-900">
            <Image
              src="/doantep.jpg"
              alt="Donation campaign"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-red-500/30" />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white mt-55 md:mt-55 lg:mt-55">
            <h1 className="text-4xl font-black md:text-6xl">
              Make a Difference Today
            </h1>
            <p className="mt-4 max-w-xl text-lg">
              Together, we can support our community and create a better future.
            </p>
          </div>
        </section>
        <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row md:px-10">
          <div>
            <div className="w-full flex-1 text-white">
              <h2 className="text-2xl font-black md:text-3xl">
                Support Our Fellow Mission
              </h2>
              <p className="mt-4 max-w-xl text-left text-gray-500 text-md">
                Give your offering or special donation online and help us
                continue serving our Fellow community.
              </p>
            </div>
            <div className="mt-8 text-white">
              <label
                htmlFor="Select an Amount for Donate"
                className="font-black md:text-2xl"
              >
                Select an Amount for Donate
              </label>
              <div className="my-5 flex flex-wrap items-center gap-5">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePresentAmount(amount)}
                    aria-pressed={selectedAmount === amount}
                    className={`rounded-lg border px-8 py-3 font-semibold transition ${
                      selectedAmount === amount
                        ? "border-amber-900 bg-amber-900 text-white"
                        : "border-amber-900 text-amber-500 hover:bg-amber-900 hover:text-white"
                    }`}
                  >
                    {amount.toLocaleString()} Birr
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 max-w-md px-10 text-white">
              <label htmlFor="customAmount" className="font-black md:text-2xl">
                Enter Custom Amount
              </label>
              <div className="mt-4">
                <input
                  id="customAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount in Birr"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 text-white outline-none focus:border-amber-500"
                />
              </div>
              {/* Selected Amount */}
              <div className="mt-8 text-white">
                <p className="text-lg text-gray-400">Your donation amount:</p>

                <h2 className="mt-2 text-3xl font-black text-amber-500">
                  {finalAmount && finalAmount > 0
                    ? `${finalAmount.toLocaleString()} Birr`
                    : "Select an amount"}
                </h2>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-8 max-w-lg px-10 text-white">
              <label htmlFor="customAmount" className="font-black md:text-2xl">
                Name
              </label>
              <div className="mt-4 flex flex-row gap-5">
                <input
                  id="customAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount in Birr"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 text-white outline-none focus:border-amber-500"
                />
                <input
                  id="customAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount in Birr"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
