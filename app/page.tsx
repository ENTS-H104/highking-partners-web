/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KPCmQ0q5cbP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import Image from "next/image";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-center border-b bg-white z-10">
        <Image
          src="/logo_highking_fill.svg"
          alt="HighKing Logo"
          width={32}
          height={32}
          className="-mt-0.5"
        />
        <p className="mx-4 font-medium">HighKing Partners Dashboard</p>
      </header>
      <main className="flex-1">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <section className="w-full">
            <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
              <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6  md:mb-16 md:px-10 md:grid-cols-2 md:gap-16 items-center justify-center">
                <div>
                  <Image
                    src="/iv_highking.svg"
                    height={200}
                    width={500}
                    alt="Hero"
                    className="mx-auto overflow-hidden rounded-t-xl object-cover"
                  />
                </div>
                <div className="flex flex-col items-start space-y-4">
                  <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                    Lets Join Us, Partners!
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    HighKing is a platform for you to manage your business trips
                    easily. Join us and lets grow together.
                  </p>
                  <div className="space-x-4">
                    <Link
                      href="/auth/login"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                      prefetch={false}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800  dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                      prefetch={false}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="fixed hidden bottom-0 left-0 right-0 py-6 w-full md:flex flex-col gap-2 sm:flex-row items-center px-4 md:px-6 border-t bg-white z-10">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          2024 HighKing. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
