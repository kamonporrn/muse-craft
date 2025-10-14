// app/page.tsx  (หรือ app/product/page.tsx)
import Image from "next/image";


export default function Page() {
  return (
    <main className="min-h-screen bg-purple-100 text-gray-900">
      {/* Topbar */}
      <div className="bg-purple-700 text-white shadow-[0_2px_0_#6b21a8]">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Muse Craft" width={42} height={42} />
            <span className="text-xl font-semibold">MuseCraft</span>
          </div>


          <div className="relative mx-4 flex-1">
            <input
              placeholder="Search"
              className="w-full rounded-full bg-white/95 py-3 pl-12 pr-4 text-gray-900 focus:outline-none"
            />
            <span className="pointer-events-none absolute left-4 top-3.5 text-purple-600 text-xl">🔎</span>
          </div>


          <div className="flex items-center gap-3">
            <button className="relative grid h-10 w-10 place-items-center rounded-full">
              🛒
              <span className="absolute -top-1 -right-1 rounded-full bg-white text-purple-700 text-[10px] px-1.5 font-bold shadow">
                10+
              </span>
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-purple-700 font-bold">👤</div>
          </div>
        </div>
      </div>


      {/* Title */}
      <h1 className="mx-auto max-w-6xl px-6 py-6 text-center text-4xl font-extrabold">
        Siam Weave
      </h1>


      {/* Content */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-16 md:grid-cols-[520px_1fr]">
        {/* Product image */}
        <div className="flex justify-center">
          <Image
            src="/images/image.jpg"
            alt="Siam Weave"
            width={520}
            height={520}
            priority
            className="rounded-lg shadow object-cover"
          />
        </div>


        {/* Right info */}
        <div className="text-lg">
          <dl className="grid grid-cols-[120px_1fr] gap-y-3">
            <dt className="font-semibold text-gray-700">Designer</dt>
            <dd className="text-purple-700 font-semibold">Arwang</dd>


            <dt className="font-semibold text-gray-700">Topic</dt>
            <dd className="text-purple-700 font-semibold">Crafting</dd>


            <dt className="font-semibold text-gray-700">Category</dt>
            <dd className="text-purple-700 font-semibold">Weaving</dd>


            <dt className="font-semibold mt-2">Ranking</dt>
            <dd className="mt-1 flex items-center gap-2">
              <span className="text-2xl text-purple-500">★☆☆☆☆</span>
              <span className="text-sm text-gray-700">(20)</span>
            </dd>


            <dt className="font-semibold mt-4 text-gray-700">Type</dt>
            <dd className="mt-4 text-gray-700">Weaving</dd>


            <dt className="font-semibold text-gray-700">On sale</dt>
            <dd className="text-gray-700">8/9/2024</dd>
          </dl>


          <div className="mt-6 flex items-center gap-3">
            <button className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 active:translate-y-[1px]">
              Add cart
            </button>
            <span className="rounded-md bg-green-200 px-4 py-2 font-bold text-green-800 shadow">
              1800 ฿
            </span>
          </div>
        </div>
      </section>


      {/* Description */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 h-3 w-full rounded-sm bg-gray-300/60" />
        <h2 className="mb-3 text-3xl font-bold">Description</h2>
        <p className="text-gray-800">
          Handcrafted Siam Weave fabric designed by Arwang using traditional techniques with a modern palette.
        </p>
      </section>
    </main>
  );
}



