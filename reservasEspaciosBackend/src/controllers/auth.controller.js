import { connectSupabase } from '../database/db.js'

const supabase = connectSupabase()

// Controlador para realizar una reserva
export const reserve = async (req, res) => {
    console.log("Reserva desde auth controller")

    const { date, resourceId, hour } = req.params
    console.log(date, resourceId, hour)

    const [hora_inicio, hora_fin] = hour.split(" - ")
    console.log(hora_inicio, hora_fin)
    
    let nuevoHorarioId = 0

    // Insertar horario en la base de datos
    try { 
        const { data: dataHorary, error: errorHorary } = await supabase
            .from('horarios')
            .insert([
                {
                    recurso_id: resourceId,
                    hora_inicio,
                    hora_fin,
                    fecha: date
                }
            ])

        if (errorHorary) {
            console.log(errorHorary)
            console.log("Error con el horario")
            return res.status(500).json({ error: "Error al crear el horario" })
        }
        
    } catch (error) {
        console.log("Error intentando crear el horario")
        return res.status(500).json({ error: "Error en el servidor al crear el horario" })
    }

    // Obtener el ID del horario recién creado
    try { 
        const { data: dataHoraryId, error: errorHoraryId } = await supabase
            .from('horarios')
            .select('id')
            .eq('hora_inicio', hora_inicio)
            .eq('hora_fin', hora_fin)
            .eq('fecha', date)
            .single()

        if (errorHoraryId) {
            console.log("Error en conseguir el id de horario")
            return res.status(500).json({ error: "Error al obtener el id del horario" })
        }

        nuevoHorarioId = dataHoraryId.id

    } catch (error) {
        console.log("Error intentando obtener el horario")
        return res.status(500).json({ error: "Error en el servidor al obtener el id del horario" })
    }

    // Insertar reserva en la base de datos
    try {
        const { data: dataReserva, error: errorReserva } = await supabase
            .from('reservas')
            .insert([
                {
                    usuario_id: 21, // Este id de usuario debería venir dinámicamente
                    horario_id: nuevoHorarioId
                }
            ])

        if (errorReserva) {
            console.error('Error al registrar la reserva:', errorReserva)
            return res.status(400).json({ error: errorReserva.message })
        }

        console.log('Fecha Agendada correctamente:', dataReserva)

        // Enviamos la respuesta con los datos de la reserva al frontend
        return res.status(200).json({
            message: 'Reserva creada con éxito',
            reserva: {
                fecha: date,
                recurso_id: resourceId,
                hora_inicio,
                hora_fin
            }
        })

    } catch (error) {
        console.error("Error intentando crear la reserva")
        return res.status(500).json({ error: "Error en el servidor al crear la reserva" })
    }
}

// Controlador para obtener los recursos
export const getResource = async (req, res) => {
    const { resourceType } = req.params
    console.log("Auth controllers ", resourceType)

    try {
        const { data: dataResource, error: errorResource } = await supabase
            .from('recursos_reservables')
            .select('id')
            .eq('tipo', resourceType)

        if (errorResource) {
            console.log("Error en conseguir los datos")
            return res.status(500).json({ error: "Error al obtener el recurso" })
        }

        return res.status(200).json(dataResource)

    } catch (error) {
        console.error("Error en el servidor: ", error)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

// Controlador para obtener los horarios
export const getHorary = async (req, res) => {
    const { id, date } = req.params
    console.log("Id: ", id)
    console.log("Fecha: ", date)

    try {
        const { data: dataHorary, error: errorHorary } = await supabase
            .from('horarios')
            .select('*')
            .eq('recurso_id', id)
            .eq('fecha', date)

        if (errorHorary) {
            console.log("Error en conseguir los horarios")
            return res.status(500).json({ error: "Error al obtener los horarios" })
        }

        console.log("Horas ocupadas: ", dataHorary)

        // Enviamos los horarios al frontend
        return res.status(200).json({ horarios: dataHorary })
        
    } catch (error) {
        console.error("Error al intentar obtener los horarios")
        return res.status(500).json({ error: "Error en el servidor al obtener los horarios" })
    }
}

// Controlador de login (no se ha modificado, se deja como estaba)
export const login = (req, res) => res.send("Login")
