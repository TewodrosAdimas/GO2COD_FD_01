import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // Import the CSS module

interface ErrorResponse {
  error: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/accounts/login/",
        formData
      );

      const { token, username } = response.data;

      if (token && username) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("username", username);
        navigate("/profile");
      } else {
        setError("Invalid login response. Username or Token missing.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.data) {
          const responseData = axiosError.response.data as ErrorResponse;
          setError(responseData.error || "Something went wrong");
        } else {
          setError("An unexpected error occurred");
        }
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className={styles.container}>
      {" "}
      {/* Apply styles from the module */}
      <h2>Login</h2>
      {error && <p className={styles.error}>{error}</p>}{" "}
      {/* Apply error styles */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
