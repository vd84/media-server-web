"use client";
import React, {useEffect, useState} from "react";
import {API_URL} from "@/shared";

const MovieList = () => {
    const [movies, setMovies] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchMovies().catch((err) => console.error(err));
    }, []);

    async function fetchMovies() {
        try {
            setLoading(true);
            const response = await fetch(API_URL + "movies", {credentials: "include"});
            const data = await response.json();
            setMovies(data.movies);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    }

    async function onDeleteMovie(movie: string) {
        const assuranceRes = confirm("Are you sure you want to delete " + movie);
        if (!assuranceRes) {
            return;
        }
        const response = await fetch(API_URL + "delete/" + movie, {method: "DELETE", credentials: "include"});
        if (response.status === 200) {
            alert("Movie deleted");
            await fetchMovies();
        } else {
            alert("Error deleting movie " + movie);
        }
    }

    async function onUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);


        const response = await fetch(API_URL + 'add', {
            method: "POST", body: formData, headers: {
                "X-Filename": file.name,
            }, credentials: "include",
        });

        if (!response.ok) {
            console.error("Error uploading file:", response.json());
            alert("Upload failed!");
        }

        alert("Upload successful!");
        await fetchMovies();
    }

    return (<div className="p-6 bg-gray-900 min-h-screen text-white">
        <h1 className="text-4xl font-bold text-center mb-10">Movies</h1>

        <div className="mb-10 max-w-md mx-auto">
            <label htmlFor="search" className="block text-lg font-medium mb-2">
                Filter by title:
            </label>
            <input
                id="search"
                type="text"
                onInput={(e: any) => setSearchTerm(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                title="Search"
            />
        </div>

        {loading ? (<p className="text-center">Loading...</p>) : movies?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies
                    .filter((movie) => movie.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((movie) => (<div
                        key={movie}
                        className="flex flex-col items-center p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform"
                    >
                        <h2 className="text-lg font-semibold mb-2 text-center break-all">{movie}</h2>
                        <a
                            href={'stream/' + movie}
                            className="mt-2 w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Stream Movie
                        </a>
                        <button
                            onClick={() => onDeleteMovie(movie)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full transition"
                        >
                            Delete Movie
                        </button>
                    </div>))}

                {/* Upload Card */}
                <div
                    className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold mb-4 text-center">Add New Movie</h2>

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
                </div>

            </div>) : (<p className="text-center text-gray-500">No movies found.</p>)}
    </div>);
};

export default MovieList;
