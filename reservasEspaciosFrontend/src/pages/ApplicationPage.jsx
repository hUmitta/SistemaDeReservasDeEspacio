import { useState } from "react"
import ApplicationCard from "../components/ApplicationCard"


function ApplicationPage() {

    //aqui se pediria a la api, los datos de la solicitudes
    const [userAplications,setUserAplications] = useState([
        {nombre: "Diego Alvarez", carrera: "Informatica", solicitud: "Solicitud de Sala"},
        {nombre: "Maximo Mora", carrera:"Biologia", solicitud:"Solicitud de Cubiculo"},
        {nombre: "Kevin Parra", carrera:"Derecho", solicitud:"Solicitud de cambio "}
    ])

    return (
        <div>
            <h1>Tabla de solicitudes</h1>

            {userAplications.map((i,index) => (

                <ApplicationCard key={index + 1} name={i.nombre} career={i.carrera} typeAplication={i.solicitud}></ApplicationCard>

            ))}

            {/* }<ApplicationCard name={"Diego Alvarez"} career={"Informatica"} typeAplication={"Solicitud de Sala"}></ApplicationCard> */}



        </div>
    )
    
}

export default ApplicationPage