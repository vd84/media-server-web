import React from "react";

type PageProps = {
    params: { movie: string };
};

const Stream = ({ params }: PageProps) => {
    const movie = params.movie;
    const API_URL = "http://localhost:8080/";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8 text-white">
            <h1 className="text-4xl font-bold mb-8 text-center break-all">
                Streaming: {movie}
            </h1>

            <video
                className="rounded-lg shadow-lg border-2 border-gray-700 hover:shadow-xl transition-all duration-300 max-w-4xl w-full"
                controls
                src={API_URL + "stream/" + movie}
            />
        </div>
    );
};

export default Stream;
