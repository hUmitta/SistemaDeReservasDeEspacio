import { useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'; 
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import dayjs from 'dayjs';
import '../styles/calendar.css';  

const localizer = dayjsLocalizer(dayjs);

export default function Calendary({ events }) {
  const [selectedFilters, setSelectedFilters] = useState({
    CUBICULO: true,
    BIBLIOTECA: true,
    GIMNASIO: true, // Agregar filtro para el Gimnasio
  });

  // Filtrar eventos basados en los filtros seleccionados
  const filteredEvents = events.filter(event => selectedFilters[event.type]);

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
          eventPropGetter={(event) => ({
            style: event.style || {},
          })}
        />
      </div>
    </div>
  );
}