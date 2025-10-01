"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router instead of next/router
import  {supabase}  from "@/lib/supabaseClient"; // ✅ make sure this file exists
import Header from "@/components/Header";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";

interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  type: string;
}

export default function IndexPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // ✅ Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      const { data, error } = await supabase.from("movies").select("*");
      if (error) {
        console.error("Error fetching movies:", error.message);
      } else {
        setMovies(data || []);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Fetch redirect URL from admin panel
  useEffect(() => {
    const fetchRedirectUrl = async () => {
      const { data, error } = await supabase
        .from("redirects") // ⚡ replace with your table name (maybe "ads")
        .select("redirect_url, is_active")
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Redirect fetch error:", error.message);
        return;
      }
      if (data?.redirect_url) {
        setRedirectUrl(data.redirect_url);
      }
    };
    fetchRedirectUrl();
  }, []);

  // ✅ Per-button ad redirect logic
  const handleClick = (id: number) => {
    if (!redirectUrl) {
      navigate(`/movie/${id}`);
      return;
    }
    const storageKey = `adRedirectDone-${id}`;
    const alreadyRedirected = sessionStorage.getItem(storageKey);

    if (!alreadyRedirected) {
      sessionStorage.setItem(storageKey, "true");
      window.location.href = redirectUrl;
    } else {
      navigate(`/movie/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="my-4">
        <ResponsiveAdPlaceholder position="header-banner" />
      </div>

      <main className="p-6 space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4">Latest Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="mt-2 font-semibold">{movie.title}</h3>
                <button
                  onClick={() => handleClick(movie.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  ▶ Watch Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-10 p-6 text-center text-gray-400 border-t border-gray-700">
        © {new Date().getFullYear()} Mflix. All rights reserved.
      </footer>
    </div>
  );
}
