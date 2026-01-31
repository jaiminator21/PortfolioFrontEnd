import Minesweeper from '@/components/Minesweeper/Minesweeper';

export default function GamePage() {
  return (
    <main className="min-h-screen py-20 flex flex-col items-center bg-background">
      <h1 className="text-4xl font-bold mb-10">Buscaminas.exe</h1>
      <Minesweeper rows={10} cols={10} mines={15} />
    </main>
  );
}