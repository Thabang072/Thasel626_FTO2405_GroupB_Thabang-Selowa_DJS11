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


  