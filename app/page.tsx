import Link from "next/link";

export default function Home() {

  return (

    <main className="min-h-screen flex flex-col items-center justify-center gap-5">

      <h1 className="text-4xl font-bold">
        Quiz Demo
      </h1>

      <Link
        href="/admin"
        className="border px-6 py-3 rounded"
      >
        Admin Panel
      </Link>

      <Link
        href="/join"
        className="border px-6 py-3 rounded"
      >
        Join Quiz
      </Link>

    </main>

  );

}