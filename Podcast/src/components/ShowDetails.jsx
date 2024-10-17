
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

  return (
    <Box className="show-details">
      <Text size="8" weight="bold" mb="4">{show.title}</Text>
      {show.image && <img src={show.image} alt={show.title} className="show-image" style={{ maxWidth: '300px', marginBottom: '20px' }} />}
      <Text size="3" mb="4">{show.description}</Text>
      
      <Flex direction="column" mb="4">
        <Flex align="center" justify="space-between" mb="2">
          <Text size="5" weight="bold">Season {selectedSeason}</Text>
          <Select.Root value={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(Number(value))}>
            <Select.Trigger />
            <Select.Content>
              {seasons.map((season, index) => (
                <Select.Item key={index} value={(index + 1).toString()}>
                  Season {index + 1}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        {seasonImage && (
          <img 
            src={seasonImage} 
            alt={`Season ${selectedSeason}`} 
            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px', borderRadius: '8px' }} 
          />
        )}
        {genres.length > 0 && (
          <Text size="2" mt="2" mb="4">
            Genre: {genres.map((genre, index) => (
              <React.Fragment key={index}>
                {index > 0 && ', '}
                <Text style={{ color: 'gray' }}>{genre}</Text>
              </React.Fragment>
            ))}
          </Text>
        )}
      </Flex>
      
      <ScrollArea style={{ height: 'calc(100vh - 400px)', paddingRight: '16px' }}>
        <Card>
          {currentSeason.episodes && currentSeason.episodes.map((episode) => {
            const episodeId = `${show.id}-S${selectedSeason}E${episode.episode}`;
            const playbackPosition = playbackPositions[episodeId];
            const isFavorited = isFavorite(show.id, episode.title);
            return (
              <Card key={episode.episode} style={{ marginBottom: '15px', padding: '10px' }}>
                <Text size="3" weight="bold" mb="1">
                  Episode {episode.episode}: {episode.title}
                </Text>
                <br />
                <Text size="2" mb="2" style={{ color: 'gray' }}>
                  {episode.description}
                </Text>
                <br />
                {playbackPosition && (
                  <Text size="2" mb="2" style={{ color: 'gray' }}>
                    Last played: {formatTime(playbackPosition)}
                  </Text>
                )}
                <Flex gap="2" mt="2">
                  <Button 
                    size="1"
                    variant="soft" 
                    onClick={() => handlePlayAudio(episode.episode)} 
                    style={{ 
                      backgroundColor: '#64748b', 
                      color: 'white',
                      flex: 1
                    }}
                  >
                    <PlayIcon /> Play
                  </Button>
                  <Button 
                    onClick={() => handleToggleFavorite(episode)}
                    variant="ghost"
                    size="1"
                    style={{ flex: 0 }}
                  >
                    {isFavorited ? <StarFilledIcon color="orange" /> : <StarIcon />}
                  </Button>
                </Flex>
              </Card>
            );
          })}
        </Card>
      </ScrollArea>
      
      <Flex justify="center" mt="6">
        <Button 
          asChild 
          size="2" 
          variant="soft" 
          style={{ 
            backgroundColor: '#64748b', 
            color: 'white',
            padding: '0 20px'
          }}
        >
          <Link to="/shows">Back to Shows</Link>
        </Button>
      </Flex>
    </Box>
  );
}






