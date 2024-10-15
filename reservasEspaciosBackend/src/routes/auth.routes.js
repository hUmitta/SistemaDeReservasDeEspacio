import { Router } from 'express';
import { login, reserve, getResource, getHorary, deleteReservation, getUserReservations } from '../controllers/auth.controller.js';

const router = Router();

// Rutas
router.post('/reserve/:resourceId/:date/:hour', reserve);

router.post('/login', login);

// Nueva ruta para obtener las reservas de un usuario
router.get('/reservas/:userId', getUserReservations); // Añade esta línea

router.get('/getResource/:resourceType/', getResource);

router.get('/getHorary/:id/:date', getHorary);

// Nueva ruta para eliminar una reserva
router.delete('/deleteReservation/:reservationId', deleteReservation);

export default router;
