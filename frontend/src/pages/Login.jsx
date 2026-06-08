import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin = async () => {
  const response = await fetch(
    "http://localhost:5000/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data =
    await response.json();

  if (data.success) {
    localStorage.setItem(
      "userToken",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    alert("Login Successful");

    navigate("/");
  } else {
    alert(data.message);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>User Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;