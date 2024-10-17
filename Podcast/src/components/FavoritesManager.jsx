import React, { useState, useEffect } from 'react';
import Favorites from './Favorites';


function FavoritesManager({ playAudio }) {
    const [favorites, setFavorites] = useState([]);
  
    useEffect(() => {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(storedFavorites);
    }, []);

    const toggleFavorite = (show) => {
        setFavorites(prevFavorites => {
          const index = prevFavorites.findIndex(fav => fav.id === show.id);
          let newFavorites;
          if (index > -1) {
            newFavorites = prevFavorites.filter(fav => fav.id !== show.id);
          } else {
            newFavorites = [...prevFavorites, { 
              ...show, 
              dateAdded: new Date().toISOString(),
              updated: show.updated || new Date().toISOString()
            }];
          }
          localStorage.setItem('favorites', JSON.stringify(newFavorites));
          return newFavorites;
        });
      };



