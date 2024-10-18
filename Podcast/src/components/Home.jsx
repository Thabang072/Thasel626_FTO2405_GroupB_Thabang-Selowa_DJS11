

const API_URL = 'https://podcast-api.netlify.app';

function CustomPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <Box
        className={className}
        style={{
          ...style,
          display: "block",
          left: "10px",
          zIndex: 1
        }}
        onClick={onClick}
      >
        <ChevronLeftIcon color="white" width="24" height="24" />
      </Box>
    );
  
    function CustomNextArrow(props) {
        const { className, style, onClick } = props;
        return (
          <Box
            className={className}
            style={{
              ...style,
              display: "block",
              right: "10px"
            }}
            onClick={onClick}
          >
            <ChevronRightIcon color="white" width="24" height="24" />
          </Box>
        );
      }
      
      function CustomNextArrow(props) {
        const { className, style, onClick } = props;
        return (
          <Box
            className={className}
            style={{
              ...style,
              display: "block",
              right: "10px"
            }}
            onClick={onClick}
          >
            <ChevronRightIcon color="white" width="24" height="24" />
          </Box>
        );
      }
      
      function Home({ playAudio }) {
        const [shows, setShows] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
      
        useEffect(() => {
          fetchShows();
        }, []);
      
        const fetchShows = async () => {
          try {
            const response = await fetch(API_URL);
            if (!response.ok) {
              throw new Error('Failed to fetch shows');
            }
            const data = await response.json();
            setShows(data.slice(0, 10)); // Show top 10 podcasts
            setIsLoading(false);
          } catch (err) {
            setError(err.message);
            setIsLoading(false);
          }
        };
      
        const handlePlayAudio = async (show) => {
          try {
            const response = await fetch(`${API_URL}/id/${show.id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch show details');
            }
            const showDetails = await response.json();
            
            if (showDetails.seasons && showDetails.seasons.length > 0 &&
                showDetails.seasons[0].episodes && showDetails.seasons[0].episodes.length > 0) {
              const episode = showDetails.seasons[0].episodes[0];
              playAudio(show.id, 1, episode.episode);
            } else {
              console.error('No episodes found for this show');
            }
          } catch (error) {
            console.error('Error fetching show details:', error);
          }
        };
      

        