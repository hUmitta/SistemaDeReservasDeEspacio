import { connectSupabase } from '../database/db.js';

const supabase = connectSupabase();

// Controlador para realizar una reserva
export const reserve = async (req, res) => {
    console.log("Reserva desde auth controller");

    const { date, resourceId, hour } = req.params;
    console.log(date, resourceId, hour);

    const [hora_inicio, hora_fin] = hour.split(" - ");
    console.log(hora_inicio, hora_fin);

    let nuevoHorarioId = 0;

    // Insertar horario en la base de datos
    try {
        const { data: dataHorary, error: errorHorary } = await supabase
            .from('horarios')
            .insert([{
                recurso_id: resourceId,
                hora_inicio,
                hora_fin,
                fecha: date,
            }])
            .select(); // Asegurarse de obtener los datos insertados, incluyendo el id

        if (errorHorary) {
            console.log(errorHorary);
            console.log("Error con el horario");
            return res.status(500).json({ error: "Error al crear el horario" });
        }

        // Asignar el ID del nuevo horario creado
        nuevoHorarioId = dataHorary[0].id;

    } catch (error) {
        console.log("Error intentando crear el horario");
        return res.status(500).json({ error: "Error en el servidor al crear el horario" });
    }

    // Insertar reserva en la base de datos
    try {
        const { data: dataReserva, error: errorReserva } = await supabase
            .from('reservas')
            .insert([{
                usuario_id: 21, // Este id de usuario debería venir dinámicamente
                horario_id: nuevoHorarioId,
            }])
            .select(); // Seleccionar la reserva recién insertada, incluyendo el id

        if (errorReserva) {
            console.error('Error al registrar la reserva:', errorReserva);
            return res.status(400).json({ error: errorReserva.message });
        }

        // Verificar que la reserva fue creada y devolver el id de la reserva
        if (dataReserva && dataReserva.length > 0) {
            console.log('Fecha Agendada correctamente:', dataReserva);
            // Enviamos la respuesta con los datos de la reserva al frontend, incluyendo el id
            return res.status(200).json({
                message: 'Reserva creada con éxito',
                reserva: {
                    id: dataReserva[0].id, // Asegúrate de devolver el ID de la reserva recién creada
                    fecha: date,
                    recurso_id: resourceId,
                    hora_inicio,
                    hora_fin,
                },
            });
        } else {
            return res.status(500).json({ error: 'No se pudo crear la reserva correctamente.' });
        }
    } catch (error) {
        console.error("Error intentando crear la reserva");
        return res.status(500).json({ error: "Error en el servidor al crear la reserva" });
    }
};

// Controlador para obtener las reservas de un usuario
export const getUserReservations = async (req, res) => {
    const { userId } = req.params; // Asume que el ID del usuario se pasa como parámetro

    try {
        const { data: reservations, error: errorReservations } = await supabase
            .from('reservas')
            .select(`
                id,
                horario_id,
                horarios (
                    fecha,
                    hora_inicio,
                    hora_fin,
                    recurso_id
                )
            `)
            .eq('usuario_id', userId); // Filtrar por el ID del usuario

        if (errorReservations) {
            console.error('Error al obtener reservas:', errorReservations);
            return res.status(500).json({ error: "Error al obtener las reservas" });
        }

        // Formatear las reservas para que se envíen al frontend
        const formattedReservations = reservations.map(reservation => ({
            id: reservation.id,
            recurso_id: reservation.horarios.recurso_id,
            fecha: reservation.horarios.fecha,
            hora_inicio: reservation.horarios.hora_inicio,
            hora_fin: reservation.horarios.hora_fin,
        }));

        return res.status(200).json(formattedReservations);
    } catch (error) {
        console.error("Error al obtener las reservas del usuario:", error);
        return res.status(500).json({ error: "Error en el servidor al obtener las reservas" });
    }
};

// Controlador para obtener los recursos
export const getResource = async (req, res) => {
    const { resourceType } = req.params;
    console.log("Auth controllers ", resourceType);

    try {
        const { data: dataResource, error: errorResource } = await supabase
            .from('recursos_reservables')
            .select('id')
            .eq('tipo', resourceType);

        if (errorResource) {
            console.log("Error en conseguir los datos");
            return res.status(500).json({ error: "Error al obtener el recurso" });
        }

        return res.status(200).json(dataResource);
    } catch (error) {
        console.error("Error en el servidor: ", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
};

// Controlador para obtener los horarios
export const getHorary = async (req, res) => {
    const { id, date } = req.params;
    console.log("Id: ", id);
    console.log("Fecha: ", date);

    try {
        const { data: dataHorary, error: errorHorary } = await supabase
            .from('horarios')
            .select('*')
            .eq('recurso_id', id)
            .eq('fecha', date);

        if (errorHorary) {
            console.log("Error en conseguir los horarios");
            return res.status(500).json({ error: "Error al obtener los horarios" });
        }

        console.log("Horas ocupadas: ", dataHorary);

        // Enviamos los horarios al frontend
        return res.status(200).json({ horarios: dataHorary });
    } catch (error) {
        console.error("Error al intentar obtener los horarios");
        return res.status(500).json({ error: "Error en el servidor al obtener los horarios" });
    }
};

// Controlador para eliminar una reserva
export const deleteReservation = async (req, res) => {
    const { reservationId } = req.params;

    try {
        // Primero obtenemos el horario asociado con la reserva
        const { data: reserva, error: errorReserva } = await supabase
            .from('reservas')
            .select('horario_id')
            .eq('id', reservationId)
            .single();  // Obtenemos una única reserva

        if (errorReserva) {
            console.error('Error al obtener la reserva:', errorReserva);
            return res.status(400).json({ error: "Error al obtener la reserva" });
        }

        const horarioId = reserva.horario_id;

        // Eliminamos la reserva de la tabla 'reservas'
        const { error: errorDeleteReserva } = await supabase
            .from('reservas')
            .delete()
            .eq('id', reservationId);

        if (errorDeleteReserva) {
            console.error('Error al eliminar la reserva:', errorDeleteReserva);
            return res.status(400).json({ error: "Error al eliminar la reserva" });
        }

        console.log('Reserva eliminada correctamente');

        // Ahora eliminamos el horario relacionado
        const { error: errorDeleteHorario } = await supabase
            .from('horarios')
            .delete()
            .eq('id', horarioId);  // Eliminamos el horario relacionado

        if (errorDeleteHorario) {
            console.error('Error al eliminar el horario:', errorDeleteHorario);
            return res.status(400).json({ error: "Error al eliminar el horario" });
        }

        console.log('Horario eliminado correctamente');

        return res.status(200).json({ message: 'Reserva y horario eliminados correctamente' });
    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        return res.status(500).json({ error: "Error en el servidor al eliminar la reserva" });
    }
};

// Controlador de login (no se ha modificado, se deja como estaba)
export const login = (req, res) => res.send("Login");
