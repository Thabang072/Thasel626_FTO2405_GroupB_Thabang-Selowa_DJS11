import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import Home from './components/Home';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import Favorites from './components/Favorites';
import ThemeToggle from './components/ThemeToggle';
import AudioPlayer from './components/AudioPlayer';
import CompletedEpisodes from './components/CompletedEpisodes';
import SearchBar from './components/SearchBar';
import '@radix-ui/themes/styles.css';
import './App.css';
}