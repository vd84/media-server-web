"use client";
import { Movie } from "@/types/movie";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import AppPage from "@/app/components/appPage";

const Stream = () => {
  const params = useParams();

  const movie = params.movie;
  const API_URL = "http://localhost:8080/";

  const router = useRouter();

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

  async function onDeleteMovie(movie?: string) {
    if (!movie) {
      alert("Invalid movie id");
      return;
    }
    const assuranceRes = confirm("Are you sure you want to delete " + movie);
    if (!assuranceRes) {
      return;
    }
    const response = await fetch(API_URL + "delete/" + movie, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.status === 200) {
      alert("Movie deleted");
      window.location.href = "/";
    } else {
      alert("Error deleting movie " + movie);
    }
  }

  return (
    <AppPage title={"Streaming: " + data?.omdbMovie.Title}>
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

      <div className="w-full flex flex-col justify-center items-center space-y-2">
        <button
          onClick={() => onDeleteMovie(data?.id)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full transition"
        >
          Delete Movie
        </button>
      </div>
    </AppPage>
  );
};

export default Stream;
