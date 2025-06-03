"use client";
import Image from "next/image";
import { images } from "./data/images";
import { useEffect, useState } from "react";
type Match = [number, number];

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [pontucao1, setPontuacao1] = useState(0);
  const [pontucao2, setPontuacao2] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioButton, setAudioButton] = useState<HTMLAudioElement | null>(null);
  const [votedImageId, setVotedImageId] = useState<number | null>(null);
  const [minId, setMinId] = useState<number>(0);
  const [maxId, setMaxId] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedImages, setSelectedImages] = useState<typeof images>([]);

  const startGame = () => {
    const filteredImages = images.filter(
      (img) => img.id >= minId && img.id <= maxId
    );
    setSelectedImages(filteredImages);
    const newMatches: Match[] = [];

    for (let i = 0; i < filteredImages.length; i++) {
      for (let j = i + 1; j < filteredImages.length; j++) {
        newMatches.push([filteredImages[i].id, filteredImages[j].id]);
      }
    }

    setMatches(shuffleArray(newMatches));
    setGameStarted(true);

    const audioInstance = new Audio("/applause-01.mp3");
    const audioButtonInstance = new Audio("/button-30.mp3");
    setAudio(audioInstance);
    setAudioButton(audioButtonInstance);
  };

  // Gera todos os pares possíveis (sem repetição)
  useEffect(() => {
    const audioInstance = new Audio("/applause-01.mp3");
    const audioButtonInstance = new Audio("/button-30.mp3");
    setAudio(audioInstance);
    setAudioButton(audioButtonInstance);
  }, []);

  function shuffleArray<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
  }

  const handleVote = (
    winner: number,
    loser: number,
    nome: string,
    nomePerdedor: string
  ) => {
    if (audioButton) {
      audioButton.play();
    }
    setVotedImageId(winner); // define imagem clicada
    setTimeout(() => {
      setScores((prev) => ({
        ...prev,
        [winner]: (prev[winner] || 0) + 1,
        [loser]: prev[loser] || 0,
      }));
      setCurrent((prev) => prev + 1);

      if (nomePerdedor !== nome) {
        if (nome.toLowerCase() === "antonio") {
          setPontuacao1((prev) => prev + 1);
        }
        if (nome.toLowerCase() === "bianca") {
          setPontuacao2((prev) => prev + 1);
        }
      }

      setVotedImageId(null); // reseta após o avanço
    }, 300); // tempo da animação (ms)
  };
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-900 flex items-center justify-center p-4">
       
        <Image
          src="/the-office-the.gif"
          alt="Logo"
          width={200}
          height={200}
          className="absolute top-5 left-1/2 transform -translate-x-1/2"
          priority
        />
 

        <div className="absolute top-40 right-7 w-72 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-4">
  <ul className="text-sm text-white space-y-2 max-h-96 overflow-y-auto ">
    {images.map((img) => (
      <li key={img.id} className=" bg-white/10 rounded-md text-black hover:bg-white/20 transition duration-200">
        <div className="font-semibold">ID: <span className="font-normal">{img.id}</span></div>
        <div className="truncate">URL: <span className="font-normal">{img.url}</span></div>
        <div className="uppercase text-xs">Dono: {img.dono}</div>
        <hr/>
      </li>
    ))}
  </ul>
</div>

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            Escolha o intervalo de IDs
          </h1>

          <div className="space-y-4">
            <label className="flex flex-col text-sm text-gray-700 font-medium">
              ID Mínimo
              <input
                type="number"
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={minId}
                onChange={(e) => setMinId(Number(e.target.value))}
              />
            </label>

            <label className="flex flex-col text-sm text-gray-700 font-medium">
              ID Máximo
              <input
                type="number"
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={maxId}
                onChange={(e) => setMaxId(Number(e.target.value))}
              />
            </label>
          </div>

          <button
            onClick={startGame}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Começar
          </button>
        </div>
      </div>
    );
  }

  if (current >= matches.length) {
    const ranked = selectedImages
      .map((img) => ({
        ...img,
        score: scores[img.id] || 0,
        dono: img.dono.toLocaleLowerCase(),
      }))
      .sort((a, b) => b.score - a.score);
    if (audio) audio.play();
    return (
      <div className="p-8 bg-gradient-to-br from-gray-700 to-gray-950 min-h-screen">
        <div className="flex w-80 flex-col text-white bg-gradient-to-br from-gray-400 to-gray-900 p-6 rounded-xl shadow-2xl border-4 border-yellow-500 fixed top-20 right-20">
          <h2 className="text-2xl font-extrabold tracking-wide text-yellow-400 mb-4 text-center flex items-center justify-center gap-2">
            🛡️ Placar Final 🛡️
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg">🔥 Antonio</span>
            <span className="text-xl font-bold text-yellow-300">
              {pontucao1 || 0} pts
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg">⚔️ Bianca</span>
            <span className="text-xl font-bold text-yellow-300">
              {pontucao2 || 0} pts
            </span>
          </div>
          <div className="mt-4 text-center text-sm text-zinc-400 italic">
            Que vença o(a) mais poderoso(a)!
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 ml-4">Ranking Final</h1>
        <ul className=" ml-8">
          {ranked.map((img, idx) => (
            <li key={img.id}>
              #{idx + 1} - {img.url.slice(0, 20)}... {img.dono.toUpperCase()}{" "}
              (Pontos: {img.score})
              <Image
                className="ml-8"
                src={img.url}
                alt="img"
                width={100}
                height={100}
                priority
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const nome1 =
    images.find((img) => img.id === matches[current][0])?.dono ||
    "Desconhecido";
  const nome2 =
    images.find((img) => img.id === matches[current][1])?.dono ||
    "Desconhecido";

  const [id1, id2] = matches[current];
  const img1 = images.find((img) => img.id === id1)!;
  const img2 = images.find((img) => img.id === id2)!;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-400 to-gray-900 h-screen">
      <div className="flex w-64  flex-col text-black bg-white p-4 rounded shadow-md absolute top-10 left-10 ">
        <h2 className="text-lg font-bold">Placar</h2>
        <p>Antonio: {pontucao1 || 0} pontos</p>
        <p>Bianca: {pontucao2 || 0} pontos</p>
      </div>
      <h1 className="text-xl mb-4">Escolha o melhor titulo</h1>
      <div className="flex gap-8">
        <div
          onClick={() => handleVote(img1.id, img2.id, nome1, nome2)}
          className={`cursor-pointer transition-transform duration-300 ${
            votedImageId === img1.id
              ? "scale-110"
              : votedImageId
              ? "opacity-50 scale-75"
              : ""
          }`}
        >
          <Image
            src={img1.url}
            alt="Imagem 1"
            width={300}
            height={300}
            priority
          />
          <p className="text-center mt-2">{nome1}</p>
        </div>
        <div
          onClick={() => handleVote(img2.id, img1.id, nome2, nome1)}
          className={`cursor-pointer transition-transform duration-300 ${
            votedImageId === img2.id
              ? "scale-110"
              : votedImageId
              ? "opacity-50 scale-75"
              : ""
          }`}
        >
          <Image
            src={img2.url}
            alt="Imagem 2"
            width={300}
            height={300}
            priority
          />
          <p className="text-center mt-2">{nome2}</p>
        </div>
      </div>
      <p className="mt-4">
        Comparação {current + 1} de {matches.length}
      </p>
    </div>
  );
}
