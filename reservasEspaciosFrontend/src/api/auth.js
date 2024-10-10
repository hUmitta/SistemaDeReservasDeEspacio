import axios from 'axios';

const API = 'http://localhost:3000/api';

export const reserveRequest = async (data) => { 
    try {
        console.log("Data de reserveRequest: ", data);

        const date = data['date'];
        const resourceId = data['resourceId'];
        const hour = data['hour'];
        
        console.log("date: ", date, "resourceType: ", resourceId, "hour: ", hour);
        
        const response = await axios.post(`${API}/reserve/${resourceId}/${date}/${hour}`);
        return response.data;  // Devuelve la respuesta
    } catch (error) {
        console.error("Error en la solicitud de reserva:", error);
        throw error;  
    }
};

export const resourceRequest = async (typeResource) =>  await axios.get(`${API}/getResource/${typeResource}`);

export const hoursRequest = async (idResource, date) => {
  console.log("hoursRequest con idResource: ", idResource); // Verificación del id
  try {
    console.log("id Resource: ", idResource);
    console.log("date: ", date);

    // Asegúrate de que `idResource` no sea undefined antes de hacer la solicitud
    if (!idResource) {
      throw new Error("El id del recurso es undefined");
    }

    const response = await axios.get(`${API}/getHorary/${idResource}/${date}`);
    
    console.log("Response from API:", response);

    return response.data;  

  } catch (error) {
    console.error("Error in hoursRequest:", error);
    throw error;  // Lanza el error para que se maneje en otro lugar
  }
};


//nunca se ocupo
export const register = async (data) => {

    console.log("Data de register Api: ", data )

}