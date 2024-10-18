

const API_URL = 'https://podcast-api.netlify.app';

function CustomPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <Box
        className={className}
        style={{
          ...style,
          display: "block",
          left: "10px",
          zIndex: 1
        }}
        onClick={onClick}
      >
        <ChevronLeftIcon color="white" width="24" height="24" />
      </Box>
    );
  