import Script from "next/script";

export default function Page() {
  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" />
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <section className="w-full max-w-3xl">
          <iframe
            data-tally-src="https://tally.so/embed/wM205A?alignLeft=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="auto"
            title="Contact form"
          />
        </section>
      </main>
    </>
  );
}
