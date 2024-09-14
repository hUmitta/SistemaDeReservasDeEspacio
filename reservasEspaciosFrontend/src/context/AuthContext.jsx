import { useState, createContext} from "react";


const AuthContext = createContext()

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)

    return (

        <div><h1>prueba</h1></div>



    )

}