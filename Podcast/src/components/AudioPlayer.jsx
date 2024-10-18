import React, { useState, useRef, useEffect } from 'react';
import { Button, Flex, Text, Slider } from '@radix-ui/themes';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

function AudioPlayer({ currentEpisode, onComplete, updatePlaybackPosition }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(currentEpisode?.currentTime || 0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', setAudioDuration);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      return () => {
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', setAudioDuration);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, []);

  useEffect(() => {
    if (currentEpisode) {
      audioRef.current.src = currentEpisode.file;
      audioRef.current.currentTime = currentEpisode.currentTime || 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentEpisode]);

  const togglePlay = () => {
    if (currentEpisode) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
    updatePlaybackPosition(currentEpisode.id, audioRef.current.currentTime);
  };

  const setAudioDuration = () => {
    setDuration(audioRef.current.duration);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onComplete) {
      onComplete(currentEpisode);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (value) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    updatePlaybackPosition(currentEpisode.id, newTime);
  };





