import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { reserveRequest, resourceRequest, hoursRequest } from '../api/auth';
import { format } from 'date-fns';
import Calendary from 'reservasEspaciosFrontend/src/components/Calendary.jsx'; // Importa el componente Calendary

export default function Formulary() {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [startDate, setStartDate] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  const [busyHours, setBusyHours] = useState([]);
  const [idResources, setIdResources] = useState(null); // Cambiar a null para manejar el objeto
  const [isResourceTypeSelected, setIsResourceTypeSelected] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    date: '',
    hour: '',
  });

  // Estado para almacenar los eventos del calendario
  const [events, setEvents] = useState([
    {
      title: 'Cubiculo, cubiculo 1',
      start: new Date(),
      end: new Date(),
      type: 'CUBICULO',
      style: { backgroundColor: 'blue', color: 'white' },
    },
    {
      title: 'Biblioteca, sala 2',
      start: new Date(2024, 9, 24, 12, 0),
      end: new Date(2024, 9, 24, 14, 0),
      type: 'BIBLIOTECA',
      style: { backgroundColor: 'red', color: 'white' },
    },
  ]);

  const GetResourcesByType = async (event) => {
    const resourceType = event.target.value;
    if (resourceType) {
      try {
        const response = await resourceRequest(resourceType);
        console.log("Respuesta completa de resourceRequest:", response); 
        
        // Verificar si la respuesta tiene un array en data
        if (response && response.data && Array.isArray(response.data)) {
          // Seleccionar el primer recurso en el array y obtener su id
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
      console.log("idResources antes de la solicitud: ", idResources); // Verifica que el objeto tenga el id correcto
      
      let auxBusyHours = [];
      let auxAvailableHours = [];

      try {
        // Verificar explícitamente el id que estamos pasando
        const resourceId = idResources.id;
        console.log("ID a pasar en la solicitud de horas: ", resourceId); // Verificar el id
        const response = await hoursRequest(resourceId, dataFormated); 
        
        if (response) {
          for (let index = 0; index < response.length; index++) {
            const starTime = response[index]['hora_inicio'].substring(0, 5);
            const endTime = response[index]['hora_fin'].substring(0, 5);
            auxBusyHours.push(starTime + ' - ' + endTime);
          }
          setBusyHours(auxBusyHours);

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
      // Asegurarnos de que la fecha esté correctamente asignada en el objeto `values`
      if (!values.date && startDate) {
        values.date = format(startDate, 'yyyy-MM-dd'); // Formatear y asignar la fecha seleccionada
      }

      // Añadir manualmente el resourceId en los valores de envío si no está presente
      if (!values.resourceId && idResources && idResources.id) {
        values.resourceId = idResources.id; // Asegurar que resourceId está presente
      }

      console.log("Data de reserveRequest: ", values); // Verificación de los valores antes de enviar

      const response = await reserveRequest(values);
      console.log(response);

      // Crear el nuevo evento para insertar en el calendario
      const [startHour, endHour] = values.hour.split(' - '); // Obtener la hora de inicio y fin

      // Asegurarse de que las horas se combinen correctamente con la fecha
      const startDateTime = new Date(`${values.date}T${startHour}:00`); // Concatenar fecha y hora de inicio
      const endDateTime = new Date(`${values.date}T${endHour}:00`); // Concatenar fecha y hora de fin

      const newEvent = {
        title: `Reserva: ${values.resourceType}`,
        start: startDateTime,
        end: endDateTime,
        type: values.resourceType,
        style: { backgroundColor: 'green', color: 'white' }, // Puedes personalizar este estilo
      };

      // Actualizar el estado de eventos
      setEvents(prevEvents => [...prevEvents, newEvent]);
    } catch (error) {
      console.log("Error al enviar la solicitud:", error);
    }
  };

  return (
    <div>
      {/* Calendario (Componente separado) */}
      <Calendary events={events} /> {/* Pasar eventos al Calendary */}

      {/* Formulario */}
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
