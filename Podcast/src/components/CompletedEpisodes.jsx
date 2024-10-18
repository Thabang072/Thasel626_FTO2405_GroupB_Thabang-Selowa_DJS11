import React, { useState, useEffect } from 'react';
import { Button, Dialog, Flex, Box, Text, Card, Tabs, Badge, ScrollArea } from '@radix-ui/themes';
import { PlayIcon, TrashIcon, ClockIcon, CheckCircledIcon } from '@radix-ui/react-icons';

function CompletedEpisodes({ 
  listeningHistory, 
  playAudio, 
  resetListeningHistory, 
  searchQuery, 
  playbackPositions 
}) {
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    const filtered = searchQuery
      ? listeningHistory.filter(episode => 
          (episode.title && episode.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (episode.showTitle && episode.showTitle.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : listeningHistory;
    setFilteredHistory(filtered);
  }, [listeningHistory, searchQuery]);