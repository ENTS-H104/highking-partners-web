/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KPCmQ0q5cbP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Mitra</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6  md:mb-16 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <img
                  src="/iv_highking.svg"
                  height="600"
                  alt="Hero"
                  className="mx-auto overflow-hidden rounded-t-xl object-cover"
                />
              </div>
              <div className="flex flex-col items-start space-y-4">
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Lets Join Us, Partners!
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Mitra is your gateway to unforgettable hiking adventures.
                  Explore curated trips, connect with fellow adventurers, and
                  plan your next outdoor escapade.
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Featured Trips
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Explore Our Top Hiking Destinations
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  From rugged mountain trails to serene forest hikes, Mitra
                  offers a diverse range of curated trips to suit every
                  adventurer.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <img
                  src="/placeholder.svg"
                  width="300"
                  height="200"
                  alt="Trip"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
                <h3 className="text-lg font-bold">Machu Picchu Trek</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Explore the ancient Inca citadel and immerse yourself in the
                  stunning Andean landscape.
                </p>
              </div>
              <div className="grid gap-1">
                <img
                  src="/placeholder.svg"
                  width="300"
                  height="200"
                  alt="Trip"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
                <h3 className="text-lg font-bold">Patagonia Expedition</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Witness the breathtaking glaciers, lakes, and mountains of
                  Patagonia on this unforgettable journey.
                </p>
              </div>
              <div className="grid gap-1">
                <img
                  src="/placeholder.svg"
                  width="300"
                  height="200"
                  alt="Trip"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
                <h3 className="text-lg font-bold">Kilimanjaro Ascent</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Conquer the highest free-standing mountain in the world and
                  enjoy stunning views from the summit.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What Our Adventurers Say
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Hear from our satisfied customers about their unforgettable
                  experiences with Mitra.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <img
                  src="/placeholder.svg"
                  width="50"
                  height="50"
                  alt="Avatar"
                  className="mx-auto aspect-square overflow-hidden rounded-full object-cover"
                />
                <h3 className="text-lg font-bold">John Doe</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "Mitra made planning my hiking trip a breeze. The platform is
                  user-friendly and the community is incredibly supportive."
                </p>
              </div>
              <div className="grid gap-1">
                <img
                  src="/placeholder.svg"
                  width="50"
                  height="50"
                  alt="Avatar"
                  className="mx-auto aspect-square overflow-hidden rounded-full object-cover"
                />
                <h3 className="text-lg font-bold">Jane Smith</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "I've been using Mitra for years and it's my go-to platform
                  for discovering new hiking destinations and connecting with
                  like-minded adventurers."
                </p>
              </div>
              <div className="grid gap-1">
                <img
                  src="/placeholder.svg"
                  height="50"
                  alt="Avatar"
                  className="mx-auto object-contain"
                />
                <h3 className="text-lg font-bold">Michael Johnson</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "Mitra's curated trip selections and detailed itineraries have
                  made planning my hiking adventures a breeze. I highly
                  recommend this platform!"
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Start Planning Your Next Adventure
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join the Mitra community and discover a world of unforgettable
                hiking experiences.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Explore Trips
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200  bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50  dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Join the Community
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; 2024 Mitra. All rights reserved.
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
