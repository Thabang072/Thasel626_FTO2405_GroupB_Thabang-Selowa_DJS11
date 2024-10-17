import { useEffect, useState } from 'react';
import '../App.css';


const API_BASE_URL = 'https://podcast-api.netlify.app';
const SHOWS_URL = `${API_BASE_URL}/shows`;

function ShowList({ playAudio, toggleFavorite, isFavorite, searchQuery, getGenreTitle, genreMap }) {
    const [shows, setShows] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('recentlyUpdated');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [showDetails, setShowDetails] = useState({});


   useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    filterAndSortShows();
  }, [shows, sortOrder, selectedGenre, searchQuery]);

  useEffect(() => {
    fetchShowDetails();
  }, [filteredShows])