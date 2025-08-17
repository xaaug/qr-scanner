import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
   <div className="flex flex-col min-h-screen">
  {/* Header */}
  <header className="w-full border-b bg-white">
    <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
      <Link href="/" className="text-xl font-bold">
        QR<span className="text-primary">Toolkit</span>
      </Link>
    </div>
  </header>

  {/* Main */}
  <main className="flex flex-col flex-grow">
    <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20 bg-gradient-to-b from-white to-gray-50">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Scan. Save. Generate.
      </h1>
      <p className="mt-4 max-w-xl text-gray-600">
        A simple, installable QR Toolkit built as a PWA. Scan codes, keep
        your history, and generate new ones — all in one place.
      </p>
      <div className="mt-6 flex gap-4">
        <Link href="/scanner">
          <Button size="lg">Scan</Button>
        </Link>
        <Link href="/generate">
          <Button size="lg" variant="outline">Generate</Button>
        </Link>
      </div>
    </section>
  </main>

  {/* Footer */}
  <footer className="py-4 text-center text-sm text-gray-500 border-t">
    QR Toolkit. Built with ❤️ by{" "}
    <a
      href="https://github.com/xaaug/qr-scanner"
      target="_blank"
      className="text-primary underline hover:text-primary/80 transition"
    >
      xaaug
    </a>.
  </footer>
</div>
  );
}
