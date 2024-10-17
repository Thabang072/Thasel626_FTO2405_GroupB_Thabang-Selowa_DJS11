import React, { useState, useEffect, useMemo } from 'react';
import { Button, Box, Text, Flex, Card, Select } from '@radix-ui/themes';
import { PlayIcon, Cross1Icon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

export default function Favorites({ 
  playAudio, 
  favorites, 
  toggleFavorite, 
  searchQuery, 
  playbackPositions, 
  getGenreTitle,
  genreMap 
}) {
  const [sortOrder, setSortOrder] = useState('recentlyUpdated');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    console.log('Favorites:', favorites);
    console.log('GenreMap:', genreMap);
  }, [favorites, genreMap]);

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites;
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = favorites.filter(fav => 
        fav.showTitle.toLowerCase().includes(lowercaseQuery) ||
        (fav.title && fav.title.toLowerCase().includes(lowercaseQuery))
      );
    }
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(fav => 
        Array.isArray(fav.genres) && fav.genres.includes(parseInt(selectedGenre))
      );
    }
    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'recentlyUpdated':
          return new Date(b.updated) - new Date(a.updated);
        case 'leastRecentlyUpdated':
          return new Date(a.updated) - new Date(b.updated);
        case 'titleAZ':
          return a.showTitle.localeCompare(b.showTitle);
        case 'titleZA':
          return b.showTitle.localeCompare(a.showTitle);
        default:
          return 0;
      }
    });
  }, [favorites, searchQuery, sortOrder, selectedGenre]);


  const handleRemoveFavorite = (favorite) => {
    toggleFavorite(favorite);
  };

  const handlePlayAudio = (favorite) => {
    if (favorite.episode) {
      playAudio(favorite.showId, favorite.season, favorite.episode);
    } else {
      playAudio(favorite.id, 1, 1);  // Play first episode of first season for show favorites
    }
  };

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
  };

  const renderGenres = (favorite) => {
    console.log('Rendering genres for:', favorite.showTitle, 'Genres:', favorite.genres);
    if (!favorite.genres || favorite.genres.length === 0) {
      return 'No genres available';
    }
    return favorite.genres.map(genreId => {
      const genreTitle = getGenreTitle(genreId);
      console.log('Genre ID:', genreId, 'Genre Title:', genreTitle);
      return genreTitle;
    }).join(', ');
  };