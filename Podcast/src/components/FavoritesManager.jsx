


function FavoritesManager({ playAudio }) {
    const [favorites, setFavorites] = useState([]);
  
    useEffect(() => {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(storedFavorites);
    }, []);