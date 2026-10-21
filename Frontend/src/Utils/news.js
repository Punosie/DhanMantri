import { useEffect, useState } from "react";
import { createHttpClient } from "../lib/http";

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || import.meta.env.VITE_API_KEY;
const CACHE_KEY = "news:general";
const CACHE_TTL = 10 * 60 * 1000;
const MAX_ARTICLES = 20;

const finnhub = createHttpClient("finnhub", { baseURL: "https://finnhub.io/api/v1" });

export const newsEnabled = Boolean(API_KEY);

const readCache = () => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    return cached && Date.now() - cached.at < CACHE_TTL ? cached.news : null;
  } catch {
    return null;
  }
};

/** Latest general market news from Finnhub, cached for the browser session. */
const useFinhubNews = () => {
  const [state, setState] = useState(() => ({ news: readCache(), error: null }));

  useEffect(() => {
    if (!newsEnabled || state.news) return;
    const controller = new AbortController();
    finnhub
      .get("/news", { params: { category: "general", token: API_KEY }, signal: controller.signal })
      .then(({ data }) => {
        const news = data.slice(0, MAX_ARTICLES);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), news }));
        } catch {
          // storage unavailable
        }
        setState({ news, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ news: [], error });
      });
    return () => controller.abort();
  }, [state.news]);

  return { news: state.news ?? [], loading: newsEnabled && state.news === null, error: state.error };
};

export default useFinhubNews;
