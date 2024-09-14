
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";


function Navbar() {

    const { user, menu } = useContext(UserContext);

    console.log(user)
    console.log(menu)

    return (


        <div>
            <p>navbar</p>




        </div>




    )
    
}

export default Navbar