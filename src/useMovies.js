import { useEffect, useState } from "react";

const KEY = "81488cee";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsloading(true);
          setError("");

          // بررسی اینترنت قبل از fetch
          if (!navigator.onLine) {
            throw new Error("اتصال اینترنت برقرار نیست");
          }

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal, timeout: 10000 }
          );

          if (!res.ok) {
            throw new Error("مشکلی در ارتباط با سرور به وجود آمده است");
          }

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("فیلم مورد نظر یافت نشد 🎬");
          }

          setMovies(data.Search);
          setError("");
        } catch (err) {
          // تبدیل خطاهای انگلیسی به فارسی
          const errorMessages = {
            "Failed to fetch": "⚠️ اتصال اینترنت برقرار نیست",
            "Network request failed": "⚠️ مشکل در اتصال شبکه",
            "Network Error": "⚠️ خطای شبکه",
            "fetch failed": "⚠️ دریافت اطلاعات ناموفق بود",
          };

          if (err.name !== "AbortError") {
            setError(errorMessages[err.message] || err.message);
          }
        } finally {
          setIsloading(false);
        }
      }

      if (!query || query.length < 3) {
        setMovies([]);
        setError(query ? "حداقل ۳ حرف وارد کنید" : "");
        return;
      }

      fetchMovies();

      return () => controller.abort();
    },
    [query]
  );

  return { movies, isLoading, error };
}
