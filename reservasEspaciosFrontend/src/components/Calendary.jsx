import { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'; 
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import dayjs from 'dayjs';
import '../styles/calendar.css';  
import { deleteReservationRequest } from '../api/auth';  // Asegúrate de importar la función de eliminación

const localizer = dayjsLocalizer(dayjs);

export default function Calendary({ events }) {
  // Estado para manejar los eventos y que se actualice visualmente
  const [allEvents, setAllEvents] = useState([]);

  // Se ejecuta cuando se reciben los eventos iniciales y los almacena en el estado local
  useEffect(() => {
    setAllEvents(events); // Inicializar con los eventos que vienen como prop
  }, [events]);

  const [selectedFilters, setSelectedFilters] = useState({
    CUBICULO: true,
    BIBLIOTECA: true,
    GIMNASIO: true, // Filtro para el Gimnasio
  });

  // Filtrar eventos basados en los filtros seleccionados
  const filteredEvents = allEvents.filter(event => selectedFilters[event.type]);

  // Función para eliminar una reserva
  const handleDelete = async (reservationId) => {
    if (!reservationId) {
      console.error("Error: el ID de la reserva es undefined");
      return;
    }

    try {
      const response = await deleteReservationRequest(reservationId);
      console.log(response.message);  // Mostrar mensaje de éxito

      // Actualizar el estado eliminando el evento de la lista visual
      setAllEvents(prevEvents => prevEvents.filter(event => event.id !== reservationId));

    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
    }
  };

  // Función para renderizar el componente del evento con el botón de eliminar
  const renderEvent = ({ event }) => (
    <span>
      {event.title} 
      <button onClick={() => handleDelete(event.id)} className="delete-button">
        Eliminar
      </button>
    </span>
  );

  const handleFilterToggle = (type) => {
    setSelectedFilters(prevState => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  return (
    <div>
      <h1>Calendario de reservas</h1>
      
      {/* BOTONES DE FILTRADO */}
      <div>
        <button
          className={`calendar-button button-cubiculo ${selectedFilters.CUBICULO ? 'button-active' : 'button-inactive'}`}
          onClick={() => handleFilterToggle('CUBICULO')}
        >
          CUBICULO
        </button>
        <button
          className={`calendar-button button-biblioteca ${selectedFilters.BIBLIOTECA ? 'button-active' : 'button-inactive'}`}
          onClick={() => handleFilterToggle('BIBLIOTECA')}
        >
          BIBLIOTECA
        </button>
        <button
          className={`calendar-button button-gimnasio ${selectedFilters.GIMNASIO ? 'button-active' : 'button-inactive'}`}
          onClick={() => handleFilterToggle('GIMNASIO')}
        >
          GIMNASIO
        </button>
      </div>

      {/* CALENDARIO */}
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={filteredEvents}  // Mostrar solo los eventos filtrados
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          components={{
            event: renderEvent  // Renderizar el componente con el botón de eliminar
          }}
          eventPropGetter={(event) => ({
            style: event.style || {},
          })}
        />
      </div>
    </div>
  );
}
