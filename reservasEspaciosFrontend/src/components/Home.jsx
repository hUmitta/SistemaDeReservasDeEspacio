
import React, { useState } from 'react';
import { Grid, Typography, Button, Card, CardContent, Box } from '@mui/material';
import './Home.css';
import { FitnessCenter } from '@mui/icons-material';
import { Book } from '@mui/icons-material';
import { MeetingRoom } from '@mui/icons-material';
import { DesktopWindows } from '@mui/icons-material';

function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state
  const [reservationSuccess, setReservationSuccess] = useState(false); // Add a success state

  const toggleOptions = () => {
    setShowOptions(prevState => !prevState);
  };

  const handleReserve = () => {
    toggleOptions(); // Toggle the showOptions state
  };

  return (
    <div className="home-container">
      <div className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <Box textAlign="center">
            <Typography variant="h1" component="h1">
              Bienvenido a la Universidad Católica
            </Typography>
            <Typography variant="subtitle1" className="subtitle">
              Explora y reserva los diferentes espacios que ofrece nuestra universidad.
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleReserve}>
            {showOptions ? 'Ocultar Opciones' : 'Reserva Ahora'}
          </Button>
          {reservationError && (
            <Typography variant="body1" color="error">
              {reservationError}
            </Typography>
          )}
          {reservationSuccess && (
            <Typography variant="body1" color="success">
              Reserva exitosa!
            </Typography>
          )}
          {loading && (
            <Typography variant="body1" color="primary">
              Procesando reserva...
            </Typography>
          )}
        </div>
      </div>
      
      {showOptions && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, '&:hover': { boxShadow: 5 } }}> {/* Added hover effect */}
              <CardContent>
                <Box textAlign="center">
                  <Typography variant="h5" component="h3">
                    Reserva Gimnasio
                  </Typography>
                  <Typography variant="body1">
                    Mantente en forma y saludable con nuestro gimnasio completamente equipado.
                  </Typography>
                  <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} /> {/* Added margin right to icon */}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, '&:hover': { boxShadow: 5 } }}> {/* Added hover effect */}
              <CardContent>
                <Box textAlign="center">
                  <Typography variant="h5" component="h3">
                    Reserva Biblioteca
                  </Typography>
                  <Typography variant="body1">
                    Un espacio tranquilo para estudiar, investigar y aprender.
                  </Typography>
                  <BookIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} /> {/* Added margin right to icon */}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, '&:hover': { boxShadow: 5 } }}> {/* Added hover effect */}
              <CardContent>
                <Box textAlign="center">
                  <Typography variant="h5" component="h3">
                    Reserva Salas
                  </Typography>
                  <Typography variant="body1">
                    Perfecto para reuniones, charlas o actividades grupales.
                  </Typography>
                  <MeetingRoomIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} /> {/* Added margin right to icon */}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, '&:hover': { boxShadow: 5 } }}> {/* Added hover effect */}
              <CardContent>
              <Box textAlign="center">
                  <Typography variant="h5" component="h3">
                    Reserva Cubículos
                  </Typography>
                  <Typography variant="body1">
                    Espacios individuales para que te concentres en tus estudios.
                  </Typography>
                  <DesktopWindowsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} /> {/* Added margin right to icon */}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Home;