import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { loginWithGoogle, user, logout } = useContext(AuthContext);

    return (

        <div>

            <li>
                <NavLink to="/">Home</NavLink>
            </li>

            

            {user ? 
                <>
                    <li>
                        <NavLink to="/calendary">calendary</NavLink>
                    </li>
                    <li>
                        <NavLink to="/formulary" >formulary</NavLink>
                    </li>

                    <li>
                        <p>{user.name}</p>
                        <img src={user.avatar} />
                        <button onClick={logout}>Salir de la sesion</button>

                    </li>
                    
                </>
                :

                <>
                    <li>
                        <button onClick={loginWithGoogle}  >Login</button>
                    </li>
                
                </>

            }



        </div>
    )
}