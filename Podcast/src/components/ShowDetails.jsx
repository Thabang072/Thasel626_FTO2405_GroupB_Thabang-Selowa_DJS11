
const API_URL = 'https://podcast-api.netlify.app/id/';

const genreMap = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

function ShowDetails({ playAudio, toggleFavorite, isFavorite, playbackPositions }) {
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    fetchShowDetails();
  }, [id]);

  const fetchShowDetails = async () => {
    try {
      const response = await fetch(`${API_URL}${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const data = await response.json();
      setShow(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (episode) => {
    if (show) {
      toggleFavorite({
        ...episode,
        season: selectedSeason,
        showId: show.id,
        showTitle: show.title,
        image: show.image
      }, show);
    }
  };

  const handlePlayAudio = (episodeNumber) => {
    if (show) {
      playAudio(show.id, selectedSeason, episodeNumber);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  const getGenreTitle = (genre) => {
    if (typeof genre === 'number') {
      return genreMap[genre] || `Unknown (${genre})`;
    }
    return genre; // If it's already a string, return it as is
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!show) return <div className="not-found">Show not found</div>;

  const genres = show.genres ? show.genres.map(getGenreTitle) : [];
  const seasons = show.seasons || [];
  const currentSeason = seasons[selectedSeason - 1] || {};
  const seasonImage = currentSeason.image || show.image || '';






