import { useEffect, useState } from 'react';
import axios from 'axios';

const useFinhubNews = (symbol) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/company-news`,
          {
            params: {
              symbol,
              from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], // 1 week before the current date
              to: new Date().toISOString().split('T')[0],   // Current date as end date
              token: import.meta.env.VITE_API_KEY,
            },
          }
        );
        setNews(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);
  
  return { news, loading, error };
};

export default useFinhubNews;
