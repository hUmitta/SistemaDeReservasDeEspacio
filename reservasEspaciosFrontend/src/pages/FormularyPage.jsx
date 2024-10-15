import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { reserveRequest, resourceRequest, hoursRequest, getUserReservations } from '../api/auth'; // Importa getUserReservations
import { format } from 'date-fns';
import Calendary from 'reservasEspaciosFrontend/src/components/Calendary.jsx'; // Importa el componente Calendary
import { AuthContext } from '../context/AuthContext'; // Asegúrate de importar el contexto

export default function Formulary() {
  const { register, handleSubmit, setValue } = useForm();
  const [startDate, setStartDate] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  const [busyHours, setBusyHours] = useState([]); // Asegúrate de que esta línea esté presente
  const [idResources, setIdResources] = useState(null); 
  const [isResourceTypeSelected, setIsResourceTypeSelected] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    date: '',
    hour: '',
  });

  // Estado para almacenar los eventos del calendario
  const [events, setEvents] = useState([]);

  // Cargar las reservas del usuario al montar el componente
  useEffect(() => {
    const loadUserReservations = async () => {
      try {
        const userId = 21; // Cambia esto para que obtengas el ID del usuario dinámicamente
        const response = await getUserReservations(userId);
        const userReservations = response.map(reservation => ({
          title: `Reserva: ${reservation.recurso_id}`,
          start: new Date(`${reservation.fecha}T${reservation.hora_inicio}:00`),
          end: new Date(`${reservation.fecha}T${reservation.hora_fin}:00`),
          type: reservation.recurso_id, 
          style: { backgroundColor: 'green', color: 'white' },
        }));
        setEvents(userReservations);
      } catch (error) {
        console.error("Error al cargar las reservas del usuario:", error);
      }
    };

    loadUserReservations();
  }, []); // Solo se ejecuta una vez al montar el componente

  const GetResourcesByType = async (event) => {
    const resourceType = event.target.value;
    if (resourceType) {
      try {
        const response = await resourceRequest(resourceType);
        console.log("Respuesta completa de resourceRequest:", response); 
        
        if (response && response.data && Array.isArray(response.data)) {
          const firstResource = response.data[0]; 
          console.log("Primer recurso en data:", firstResource);
          
          if (firstResource && firstResource.id) {
            setIdResources(firstResource); 
            setIsResourceTypeSelected(true);
            setErrorMessages({ date: '', hour: '' });
          } else {
            console.log("El recurso no contiene un ID válido.");
            setIsResourceTypeSelected(false);
          }
        } else {
          console.log("La respuesta no contiene un array de recursos en 'data'.");
          setIsResourceTypeSelected(false);
        }
      } catch (error) {
        console.log("Error al obtener el dato", error);
      }
    } else {
      setIsResourceTypeSelected(false);
      setErrorMessages({ date: '', hour: '' });
    }
  };

  const handleBlockedClick = (field) => {
    if (!isResourceTypeSelected) {
      setErrorMessages(prevState => ({
        ...prevState,
        [field]: "Por favor, selecciona primero el tipo de recurso."
      }));
    }
  };

  const GetHoraryById = async (dateDataPicker) => {
    const dataFormated = format(dateDataPicker, 'yyyy-MM-dd');
    
    if (idResources && idResources.id) {
      console.log("idResources antes de la solicitud: ", idResources);
      
      let auxBusyHours = [];
      let auxAvailableHours = [];

      try {
        const resourceId = idResources.id;
        console.log("ID a pasar en la solicitud de horas: ", resourceId);
        const response = await hoursRequest(resourceId, dataFormated); 
        
        if (response) {
          for (let index = 0; index < response.length; index++) {
            const starTime = response[index]['hora_inicio'].substring(0, 5);
            const endTime = response[index]['hora_fin'].substring(0, 5);
            auxBusyHours.push(starTime + ' - ' + endTime);
          }
          setBusyHours(auxBusyHours); // Asegúrate de que esta línea esté presente

          for (let index = 8; index <= 19; index++) {
            let startTime = `${index}:00`;
            let endTime = `${index + 1}:00`;

            if (index <= 9) {
              startTime = `0${index}:00`;
              if (index === 9) {
                endTime = `${index + 1}:00`;
              } else {
                endTime = `0${index + 1}:00`;
              }
            }
            auxAvailableHours.push(startTime + ' - ' + endTime);
          }

          const availableHours = auxAvailableHours.filter(hour => !auxBusyHours.includes(hour));
          setAvailableHours(availableHours);
        }
      } catch (error) {
        console.log("Error al obtener los horarios", error);
      }
    } else {
      console.log("El id del recurso no está definido. Verifica si el recurso fue seleccionado correctamente.");
    }
  };

  const onSubmit = async (values) => {
    try {
      if (!values.date && startDate) {
        values.date = format(startDate, 'yyyy-MM-dd');
      }

      if (!values.resourceId && idResources && idResources.id) {
        values.resourceId = idResources.id;
      }

      console.log("Data de reserveRequest: ", values);

      const response = await reserveRequest(values);
      console.log("Respuesta del backend:", response);

      if (response && response.reserva && response.reserva.id) {
        const reservationId = response.reserva.id;

        const [startHour, endHour] = values.hour.split(' - ');
        const startDateTime = new Date(`${values.date}T${startHour}:00`);
        const endDateTime = new Date(`${values.date}T${endHour}:00`);

        const newEvent = {
          id: reservationId,
          title: `Reserva: ${values.resourceType}`,
          start: startDateTime,
          end: endDateTime,
          type: values.resourceType,
          style: { backgroundColor: 'green', color: 'white' },
        };

        setEvents(prevEvents => [...prevEvents, newEvent]);
      } else {
        console.log("Error: La respuesta del backend no contiene un ID de reserva válido.");
      }
    } catch (error) {
      console.log("Error al enviar la solicitud:", error);
    }
  };

  return (
    <div>
      <Calendary events={events} /> {/* Pasar eventos al Calendary */}

      <h1>Formulario</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Tipo de recurso</label>
          <select 
            {...register("resourceType", { required: "Selecciona un tipo de recurso" })}
            onChange={GetResourcesByType}
          >
            <option value="">Seleccionar...</option>
            <option value="CUBICULO">Cubiculo</option>
            <option value="GIMNASIO">Gimnasio</option>
          </select>
        </div>

        <div style={{ position: 'relative' }}>
          <label>Seleccionar Día</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              GetHoraryById(date);
            }} 
            dateFormat="yyyy/MM/dd"
            placeholderText="Seleccionar fecha"
            required
            disabled={!isResourceTypeSelected} 
          />
          {!isResourceTypeSelected && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'transparent',
                cursor: 'not-allowed'
              }}
              onClick={() => handleBlockedClick('date')}
            />
          )}
          {errorMessages.date && (
            <p style={{ color: 'red' }}>{errorMessages.date}</p>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <label>Seleccione la hora</label>
          <select 
            {...register("hour", { required: "Selecciona una hora" })}
            disabled={!isResourceTypeSelected} 
          >
            <option value="">Seleccionar...</option>
            {availableHours.map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
          {!isResourceTypeSelected && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'transparent',
                cursor: 'not-allowed'
              }}
              onClick={() => handleBlockedClick('hour')}
            />
          )}
          {errorMessages.hour && (
            <p style={{ color: 'red' }}>{errorMessages.hour}</p>
          )}
        </div>

        <button type="submit" disabled={!isResourceTypeSelected}>Enviar</button>
      </form>
    </div>
  );
}
