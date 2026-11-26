// Header.tsx
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-center border-b border-gray-700">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-around px-4 sm:px-6 lg:px-8">
        <Image
          src="/logos.jpg"
          alt="AUWC logo"
          width={80}
          height={80}
          priority
          className="h-auto w-20 object-contain"
        />
        <Image
          src="/hotk.jpg"
          alt="Hope of the Kingdom logo"
          width={100}
          height={80}
          priority
          className="h-auto w-20 object-contain"
        />
      </div>
    </header>
  );
}
