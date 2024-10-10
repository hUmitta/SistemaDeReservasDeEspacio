import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>home</h1>
        </div>
    )
}
