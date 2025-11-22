"use client";
import { Movie } from "@/types/movie";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const Stream = () => {
  const params = useParams();

  const movie = params.movie;
  const API_URL = "http://localhost:8080/";

  const { data, isLoading } = useQuery<Movie>({
    queryKey: ["movie", movie],
    queryFn: () =>
      fetch(API_URL + "movies/" + movie, { credentials: "include" }).then(
        (r) => {
          if (!r.ok) {
            throw new Error("Network response was not ok");
          }
          return r.json();
        }
      ),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center break-all">
        Streaming: {data?.omdbMovie.Title}
      </h1>
      <h2>
        {data?.omdbMovie.Year} &#8226; {data?.omdbMovie.Genre} &#8226;{" "}
        {data?.omdbMovie.Runtime}
      </h2>
      <h3 className="mb-6 mt-6">{data?.omdbMovie.Plot}</h3>
      {isLoading && <p>Loading video...</p>}

      <video
        className="rounded-lg shadow-lg border-2 border-gray-700 hover:shadow-xl transition-all duration-300 max-w-4xl w-full"
        controls
        src={API_URL + "stream/" + data?.id}
        x-webkit-airplay="allow"
        playsInline
      />
    </div>
  );
};

export default Stream;
