import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Flex, Box, Text, Select } from '@radix-ui/themes';
import { StarFilledIcon, StarIcon, PlayIcon } from '@radix-ui/react-icons';


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
  }, [filteredShows]);

  const fetchShows = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SHOWS_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data);
      setFilteredShows(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchShowDetails = async () => {
    const details = {};
    for (const show of filteredShows) {
      try {
        const response = await fetch(`${API_BASE_URL}/id/${show.id}`);
        if (response.ok) {
          const data = await response.json();
          const totalEpisodes = data.seasons.reduce((sum, season) => sum + season.episodes.length, 0);
          details[show.id] = { totalEpisodes };
        }
      } catch (error) {
        console.error(`Error fetching details for show ${show.id}:`, error);
      }
    }
    setShowDetails(details);
  };

  const filterAndSortShows = () => {
    let filtered = shows;
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(show => 
        show.title.toLowerCase().includes(lowercaseQuery) ||
        show.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(show => show.genres.includes(parseInt(selectedGenre)));
    }

    switch (sortOrder) {
      case 'titleAZ':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'recentlyUpdated':
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'leastRecentlyUpdated':
        filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }
    setFilteredShows(filtered);
  };

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
  };

  const handlePlayAudio = async (show) => {
    try {
      const response = await fetch(`${API_BASE_URL}/id/${show.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const showDetails = await response.json();
      
      if (showDetails.seasons && showDetails.seasons.length > 0 &&
          showDetails.seasons[0].episodes && showDetails.seasons[0].episodes.length > 0) {
        const firstEpisode = showDetails.seasons[0].episodes[0];
        playAudio(show.id, 1, firstEpisode.episode);
      } else {
        console.error('No episodes found for this show');
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
