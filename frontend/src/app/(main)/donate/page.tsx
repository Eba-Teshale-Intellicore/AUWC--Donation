"use client";

import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import api from "@/lib/axios";
import { motion } from "framer-motion";

const donationSchema = z.object({
  amount: z
    .number()
    .finite("Please enter a valid amount")
    .positive("Donation amount must be greater than zero"),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters"),

  email: z.email("Please enter a valid email address").trim(),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
});

type DonationData = z.infer<typeof donationSchema>;
type DonationPayload = DonationData & {
  currency: "ETB";
};
export default function Donate() {
  const [selectedAmount, setSelectAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof DonationData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amounts = [50, 100, 500, 1000, 5000];

  const handlePresentAmount = (amount: number) => {
    setSelectAmount(amount);
    setCustomAmount("");

    setErrors((prev) => ({
      ...prev,
      amount: undefined,
    }));
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectAmount(null);

    setErrors((prev) => ({
      ...prev,
      amount: undefined,
    }));
  };
  const finalAmount =
    customAmount.trim() !== "" ? Number(customAmount) : selectedAmount;

  // const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!finalAmount || !Number.isFinite(finalAmount) || finalAmount <= 0) {
  //     setError("Please select or enter a valid donation amount.");
  //     return;
  //   }
  //   if (!firstName.trim() || !lastName.trim()) {
  //     setError("Please enter your first and last name.");
  //   }
  //   if (!email.trim()) {
  //     setError("Please enter your email. ");
  //   }
  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     alert("Please enter a valid email address.");
  //     return;
  //   }
  //   if (!phoneNumber.trim()) {
  //     alert("Please enter your phone number.");
  //     return;
  //   }
  //   const donationData = {
  //     amount: finalAmount,
  //     currency: "ETB",
  //     firstName: firstName.trim(),
  //     lastName: lastName.trim(),
  //     email: email.trim(),
  //     phoneNumber: phoneNumber.trim(),
  //   };
  //   setError("");

  //   console.log("Donation Details:", donationData);

  //   // Next: Send donationData to your Django API.
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = donationSchema.safeParse({
      amount: finalAmount,
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DonationData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof DonationData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      toast.error("Please correct the form errors.");
      return;
    }

    setErrors({});

    const donationData: DonationPayload = {
      ...result.data,
      currency: "ETB",
    };

    console.log("Donation Details:", donationData);

    // Next: Send donationData to your Django API.
    setIsSubmitting(true);
    try {
      const res = await api.post("/donations/", donationData);

      console.log("API Response:", res.data);
      // Example: Django returns Chapa's checkout URL.
      const checkoutUrl = res.data.checkout_url;

      if (!checkoutUrl) {
        toast.error("Checkout URL was not provided.");
        return;
      }

      toast.success("Donation initialized successfully!");

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("Donation error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Unable to initialize your donation.",
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-black">
      <main className="w-full">
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

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white mt-55 md:mt-55 lg:mt-55"
          >
            <h1 className="text-4xl font-black md:text-6xl">
              Make a Difference Today
            </h1>
            <p className="mt-4 max-w-xl text-lg">
              Together, we can support our community and create a better future.
            </p>
          </motion.div>
        </section>

        <section className="mx-auto mt-4 flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:px-10">
          {/* Left Column: Amount Selection */}
          <div className="w-full flex-1 text-zinc-900 dark:text-white">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">
                Support Our Fellow Mission
              </h2>
              <p className="mt-4 max-w-xl text-left text-gray-500">
                Give your offering or special donation online and help us
                continue serving our Fellow community.
              </p>
            </div>

            <div className="mt-8">
              <p className="font-black md:text-2xl">
                Select an Amount to Donate
              </p>
              <div className="my-5 flex flex-wrap items-center gap-5">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePresentAmount(amount)}
                    aria-pressed={selectedAmount === amount}
                    className={`rounded-lg border px-6 py-3 font-semibold transition ${
                      selectedAmount === amount
                        ? "border-amber-900 bg-amber-900 text-white"
                        : "border-amber-900 text-amber-600 hover:bg-amber-900 hover:text-white dark:text-amber-500"
                    }`}
                  >
                    {amount.toLocaleString()} Birr
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 max-w-md">
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
                  className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 outline-none focus:border-amber-500"
                />
                {errors.amount && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Your donation amount:
                </p>
                <p className="mt-2 text-3xl font-black text-amber-600 dark:text-amber-500">
                  {finalAmount && finalAmount > 0
                    ? `${finalAmount.toLocaleString()} Birr`
                    : "Select an amount"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Donor Details */}
          <div className="w-full flex-1 text-zinc-900 dark:text-white md:pt-2">
            <form onSubmit={handleSubmit} noValidate className="max-w-lg">
              <div>
                <p className="font-black md:text-2xl">Your Name</p>
                <div className="mt-4 flex flex-row gap-5">
                  <div className="w-full">
                    <label htmlFor="firstName" className="sr-only">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      required
                      aria-invalid={!!errors.firstName}
                      aria-describedby={
                        errors.firstName ? "firstName-error" : undefined
                      }
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          firstName: undefined,
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.firstName && (
                      <p
                        id="firstName-error"
                        className="mt-2 text-sm font-medium text-red-600"
                      >
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label htmlFor="lastName" className="sr-only">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      required
                      aria-invalid={!!errors.lastName}
                      aria-describedby={
                        errors.lastName ? "lastName-error" : undefined
                      }
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          lastName: undefined,
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 outline-none focus:border-amber-500"
                    />
                    {errors.lastName && (
                      <p
                        id="lastName-error"
                        className="mt-2 text-sm font-medium text-red-600"
                      >
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="font-black md:text-2xl">Email</p>
                <div className="mt-4 flex flex-row gap-5">
                  <div className="w-full">
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={email}
                      required
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }}
                      className="mt-4 w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 outline-none focus:border-amber-500"
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-2 text-sm font-medium text-red-600"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="font-black md:text-2xl">Phone</p>
                <div className="mt-4 flex flex-row gap-5">
                  <div className="w-full">
                    <label htmlFor="phone" className="sr-only">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      value={phoneNumber}
                      required
                      aria-invalid={!!errors.phoneNumber}
                      aria-describedby={
                        errors.phoneNumber ? "phone-error" : undefined
                      }
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          phoneNumber: undefined,
                        }));
                      }}
                      className="mt-4 w-full rounded-lg border border-gray-500 bg-transparent px-4 py-3 outline-none focus:border-amber-500"
                    />
                    {errors.phoneNumber && (
                      <p
                        id="phone-error"
                        className="mt-2 text-sm font-medium text-red-600"
                      >
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full rounded-lg bg-amber-900 px-6 py-4 font-bold text-white transition hover:bg-amber-800"
                >
                  {isSubmitting ? "Processing..." : "Next Step"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

// sonner(toast) using
// toast.success("Success!");
// toast.error("Something went wrong!");
// toast.info("New information!");
// toast.warning("Please check your input!");

// 2. TanStack Query (React Query)

// TanStack Query

// Server-state management library

// Fetching, caching and synchronizing data

// Here is an important distinction:

// Axios sends the request. TanStack Query manages the data returned from that request.

// For example, imagine a product listing page.

// Without TanStack Query, you would manually manage:
// - Loading states.
// - Error states.
// - API requests.
// - Cached responses.
// - Refetching data.
// - Synchronizing server data.
// TanStack Query helps manage these responsibilities.

// Example:
// "use client";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// export default function Products() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["products"],

//     queryFn: async () => {
//       const response = await axios.get(
//         "http://localhost:8000/api/v1/products/"
//       );

//       return response.data;
//     },
//   });

//   if (isLoading) return <p>Loading...</p>;

//   if (isError) return <p>Something went wrong.</p>;

//   return (
//     <div>
//       {data.map((product: any) => (
//         <p key={product.id}>{product.name}</p>
//       ))}
//     </div>
//   );
// }

// Notice:
// - queryKey: Identifies the cached data.
// - queryFn: Defines how to fetch the data.
// - isLoading: Indicates that data is loading.
// - isError: Indicates that an error occurred.
// - data: Contains the returned data.
// Real-world example: When users visit the Sira service marketplace, TanStack Query can manage the fetching and caching of available services.
