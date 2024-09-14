
import axios from 'axios';

function ApplicationCard({name,career,typeAplication,index}) {

    //se les mandaria a la api

    
    const ApprovedAplication = () => {

        axios.get("http://localhost:3000/solicitud")

        console.log("Solicitud Aprovada")

    }

    const DeniedAplication= () => {
        console.log("Solicitud denegada")

    }



    return (
        <div style={{display:"flex",backgroundColor:""}}>
            <p>Numero: {index}</p>
            <p>Nombre: {name}|</p> 
            <p>Carrera: {career}|</p> 
            <p>Tipo de Solicitud: {typeAplication}</p>


            <button onClick={ApprovedAplication} style={{backgroundColor:"green", }}>Solicitud Aprobada </button>
            <button onClick={DeniedAplication } style={{backgroundColor:"red"}}>Solicitud Degenada </button>
        </div>
    );
}

export default ApplicationCard;
