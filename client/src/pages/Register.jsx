import { useState } from "react";
import axios from "axios";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await axios.post(
        "https://chat-backend-nqrw.onrender.com/api/auth/register",
        {
          username,
          password
        }
      );

      alert("Registered");

      window.location.href = "/";

    } catch (error) {

      alert("Registration failed");

    }

  };

  return (
    <div>

      <h1>Register</h1>

      <input
        placeholder="Username"
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleRegister}>
        Register
      </button>

    </div>
  );
}

export default Register;