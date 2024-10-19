import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Button, Flex, Card } from '@radix-ui/themes';
import { PlayIcon } from '@radix-ui/react-icons';

const API_BASE_URL = 'https://podcast-api.netlify.app';

function ShowDetails({ playAudio }) {
  const { id } = useParams(); // Get the show ID from the URL
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShowDetails();
  }, [id]);

  const fetchShowDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/id/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const data = await response.json();
      setShow(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (episode) => {
    if (playAudio) {
      playAudio(id, 1, episode);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
  };

  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const imageStyles = {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'cover',
  };

  const titleStyles = {
    marginTop: '20px',
    color: '#333',
    fontSize: '2.2rem',
  };

  const descriptionStyles = {
    color: '#555',
    lineHeight: '1.5',
    marginTop: '15px',
  };

  const episodesSectionStyles = {
    marginTop: '40px',
  };

  const episodesHeaderStyles = {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '10px',
  };

  const episodeCardStyles = {
    backgroundColor: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
  };

  const playButtonStyles = {
    backgroundColor: '#0066cc',
    color: 'white',
    borderRadius: '5px',
  };

  const playButtonHoverStyles = {
    backgroundColor: '#005bb5',
  };

  return (
    <Box style={containerStyles}>
      {show ? (
        <>
          <Card style={cardStyles}>
            <img src={show.image} alt={show.title} style={imageStyles} />
            <Box p="4">
              <Text size="8" weight="bold" style={titleStyles}>{show.title}</Text>
              <Text size="5" mt="2" style={descriptionStyles}>{show.description}</Text>
              <Text size="4" mt="2">Seasons: {show.seasons.length}</Text>
              <Text size="4" mt="2">Genres: {show.genres.join(', ')}</Text>
            </Box>
          </Card>

          <Box mt="4" style={episodesSectionStyles}>
            <Text size="6" weight="bold" style={episodesHeaderStyles}>Episodes</Text>
            {show.seasons.length > 0 && show.seasons[0].episodes.length > 0 ? (
              show.seasons[0].episodes.map((episode, index) => (
                <Card key={index} mt="2" style={episodeCardStyles}>
                  <Flex align="center" justify="between">
                    <Text size="4">{episode.title}</Text>
                    <Button
                      onClick={() => handlePlayAudio(episode.audio)}
                      size="2"
                      style={playButtonStyles}
                      onMouseOver={e => e.target.style.backgroundColor = playButtonHoverStyles.backgroundColor}
                      onMouseOut={e => e.target.style.backgroundColor = playButtonStyles.backgroundColor}
                    >
                      <PlayIcon /> Play
                    </Button>
                  </Flex>
                </Card>
              ))
            ) : (
              <Text>No episodes available</Text>
            )}
          </Box>
        </>
      ) : (
        <div>No show details available.</div>
      )}
    </Box>
  );
}

export default ShowDetails;
