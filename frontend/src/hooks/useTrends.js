import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const MOCK_TRENDS = {
  sounds: [
    { id: 1, name: 'Espresso – Sabrina Carpenter', plays: '2.4M', growth: 34, platform: 'tiktok' },
    { id: 2, name: 'Feather – Sabrina Carpenter',  plays: '1.8M', growth: 28, platform: 'tiktok' },
    { id: 3, name: 'Von der Natur – Schrotthand',   plays: '980K', growth: 52, platform: 'instagram' },
    { id: 4, name: 'Cruel Summer – Taylor Swift',   plays: '3.1M', growth: 15, platform: 'youtube' },
    { id: 5, name: 'APT. – ROSÉ & Bruno Mars',      plays: '5.2M', growth: 89, platform: 'tiktok' },
  ],
  hashtags: [
    { id: 1, name: 'fyp',            posts: '142B', engagement: '8.4%', platform: 'tiktok' },
    { id: 2, name: 'viral',          posts: '89B',  engagement: '7.1%', platform: 'tiktok' },
    { id: 3, name: 'contentcreator', posts: '12B',  engagement: '9.3%', platform: 'instagram' },
    { id: 4, name: 'reels',          posts: '45B',  engagement: '6.8%', platform: 'instagram' },
    { id: 5, name: 'shorts',         posts: '28B',  engagement: '5.5%', platform: 'youtube' },
  ],
  aesthetics: [
    { id: 1, name: 'Dark Academia',    description: 'Bücher, Kerzen, dunkle Töne',        platform: 'tiktok' },
    { id: 2, name: 'Cottagecore',      description: 'Ländlich, natürlich, romantisch',     platform: 'instagram' },
    { id: 3, name: 'Y2K Revival',      description: 'Silber, Glitzer, 2000er Nostalgie',  platform: 'tiktok' },
    { id: 4, name: 'Minimalist Vlog',  description: 'Sauber, ruhig, fokussiert',           platform: 'youtube' },
  ],
};

export function useTrends() {
  const [trends, setTrends]   = useState(MOCK_TRENDS);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchTrends = useCallback(async (platform = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/trendradar?platform=${platform}`);
      setTrends(data);
    } catch {
      setTrends(MOCK_TRENDS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrends(); }, [fetchTrends]);

  return { trends, loading, error, refetch: fetchTrends };
}
