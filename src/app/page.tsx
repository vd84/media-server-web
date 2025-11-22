"use client";
import React, { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/shared";
import { Movie } from "@/types/movie";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Page from "@/app/page";
import AppPage from "../app/components/appPage";

const Home = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalMovies, setTotalMovies] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadMovieImdbId, setUploadMovieImdbId] = useState<string>("");
  const [uploadMovieImdbIdValid, setUploadMovieImdbIdValid] =
    useState<boolean>(true);
  const pageSizes = [1, 5, 10, 15, 20, 30, 40, 50, 100];
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    fetchTotalCountMovies().catch((err) => console.error(err));
    fetchMovies().catch((err) => console.error(err));
    router.push(
      pathname + "?" + createQueryString("pageSize", pageSize.toString())
    );
  }, []);

  useEffect(() => {
    fetchMovies().catch((err) => console.error(err));
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  async function fetchTotalCountMovies() {
    try {
      const response = await fetch(API_URL + "movies/count", {
        credentials: "include",
      });
      const data = await response.json();
      setTotalMovies(data.count);
    } catch (error) {
      console.error("Error fetching movies count:", error);
    } finally {
    }
  }

  async function fetchMovies() {
    try {
      setLoading(true);
      const response = await fetch(API_URL + "movies?" + searchParams, {
        credentials: "include",
      });
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!uploadMovieImdbId) {
      setUploadMovieImdbIdValid(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(API_URL + "add", {
      method: "POST",
      body: formData,
      headers: {
        "X-Filename": file.name,
        "X-ImdbId": uploadMovieImdbId,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error uploading file:", response.json());

      if (response.status === 409) {
        alert("Upload failed, movie already exists!");
        return;
      }

      alert("Upload failed!");
      return;
    }

    alert("Upload successful!");
    await fetchMovies();
  }

  const onChangePageSize = async (event: any) => {
    setPageSize(event.target.value);
    router.push(
      pathname + "?" + createQueryString("pageSize", event.target.value)
    );
  };

  const onChangeSearchTerm = (event: string) => {
    router.push(pathname + "?" + createQueryString("search", event));
  };

  const onChangeImdbId = (event: any) => {
    setUploadMovieImdbId(event.target.value);
    setUploadMovieImdbIdValid(true);
  };

  return (
    <AppPage title="Movies">
      <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition mb-10">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Add New Movie
        </h2>

        <input
          id="upload"
          type="file"
          onChange={onUploadFile}
          className="hidden"
        />

        <label
          htmlFor="upload"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition text-center w-full"
        >
          Upload File
        </label>

        <label htmlFor="imdb-id" className="mt-4 text-sm text-gray-400 w-full">
          <div className="flex flex-col items-start">
            IMDB ID
            <input
              onChange={onChangeImdbId}
              aria-invalid={!uploadMovieImdbIdValid}
              id="imdb-id"
              className="mb-2 w-full px-4 py-2 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          {!uploadMovieImdbIdValid && (
            <span className="text-red-500 text-sm">
              Please enter a valid IMDB ID.
            </span>
          )}
        </label>
      </div>
      <div className="mb-10">
        <label htmlFor="search" className="block text-lg font-medium mb-1">
          Filter by title:
        </label>
        <input
          id="search"
          type="text"
          onInput={(e: any) => onChangeSearchTerm(e.target.value)}
          placeholder="Type to search..."
          className="mb-2 w-full px-4 py-2 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          title="Search"
        />
        <label htmlFor="pageSize" className="block text-lg font-medium mb-1">
          Page size:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={onChangePageSize}
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          {pageSizes.map((pageSize: number) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : movies?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2">
          {movies
            .filter((movie) =>
              movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((movie) => (
              <a
                href={"/stream/" + movie.id}
                key={movie.id}
                className="flex flex-col items-center justify-between p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition transform"
              >
                <h2 className="text-lg font-semibold mb-2 text-center break-all">
                  {movie?.title}
                </h2>
                <img src={movie.omdbMovie.Poster}></img>
              </a>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No movies found.</p>
      )}

      {movies?.length > 0 && totalMovies && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          {Array.from(
            { length: Math.ceil(totalMovies / pageSize) },
            (_, index) => (
              <button
                key={index}
                onClick={() => {
                  setPage(index + 1);
                  router.push(
                    pathname +
                      "?" +
                      createQueryString("page", (index + 1).toString())
                  );
                }}
                className={`px-4 py-2 rounded-lg ${
                  page === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } transition`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}
    </AppPage>
  );
};

export default Home;
