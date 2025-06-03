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

  // Gera todos os pares possíveis (sem repetição)
  useEffect(() => {
    const newMatches: Match[] = [];
    for (let i = 0; i < images.length; i++) {
      for (let j = i + 1; j < images.length; j++) {
        newMatches.push([images[i].id, images[j].id]);
      }
    }
    setMatches(shuffleArray(newMatches));
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

  if (current >= matches.length) {
    const ranked = images
      .map((img) => ({
        ...img,
        score: scores[img.id] || 0,
        dono: img.dono.toLocaleLowerCase(),
      }))
      .sort((a, b) => b.score - a.score);
    if (audio) audio.play();
    return (
      <div className="p-8">
        <div className="flex w-80 flex-col text-white bg-gradient-to-br from-zinc-800 to-black p-6 rounded-xl shadow-2xl border-4 border-yellow-500 fixed top-20 right-20">
  <h2 className="text-2xl font-extrabold tracking-wide text-yellow-400 mb-4 text-center flex items-center justify-center gap-2">
    🛡️ Placar Final 🛡️
  </h2>
  <div className="flex justify-between items-center mb-2">
    <span className="font-semibold text-lg">🔥 Antonio</span>
    <span className="text-xl font-bold text-yellow-300">{pontucao1 || 0} pts</span>
  </div>
  <div className="flex justify-between items-center mb-2">
    <span className="font-semibold text-lg">⚔️ Bianca</span>
    <span className="text-xl font-bold text-yellow-300">{pontucao2 || 0} pts</span>
  </div>
  <div className="mt-4 text-center text-sm text-zinc-400 italic">
    Que vença o(a) mais poderoso(a)!
  </div>
</div>

        <h1 className="text-2xl font-bold mb-4 ml-4">Ranking Final</h1>
        <ul className=" ml-8">
          {ranked.map((img, idx) => (
            <li key={img.id} >
              #{idx + 1} - {img.url.slice(0, 20)}... {img.dono.toUpperCase()}{" "}
              (Pontos: {img.score})
              <Image className="ml-8" src={img.url} alt="img" width={100} height={100} priority />
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
    <div className="flex flex-col items-center justify-center p-8">
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
