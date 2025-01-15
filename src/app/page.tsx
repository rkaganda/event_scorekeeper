import ScoreKeeperList from "@/app/components/ScoreKeeperList";

export default function Home() {
  return (
    <div>
    <main>
        <div className="min-h-screen sm:p-2 font-[family-name:var(--font-geist-sans)]">
            <ScoreKeeperList 
            />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
