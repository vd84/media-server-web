import MovieList from "@/app/components/videoPlayer";

export default function Home() {
  return (
    <div className=" items-center justify-items-center sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <MovieList/>
      </main>
    </div>
  );
}
