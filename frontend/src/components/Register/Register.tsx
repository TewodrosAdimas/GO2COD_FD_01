import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

// Define the shape of the form data for better TypeScript support
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  bio: string;
  profile_picture: File | null;
}

// Define the expected structure of the error response
interface ErrorResponse {
  detail: string;
}

const Register = () => {
  // Use state with proper typing for form data and error message
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    bio: "",
    profile_picture: null,
  });

  const [error, setError] = useState<string>(""); // Typing the error as a string
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        profile_picture: files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("username", formData.username);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("bio", formData.bio);

    // Append the profile picture if it's selected
    if (formData.profile_picture) {
      formDataToSubmit.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/accounts/register/",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      // Cast the error to AxiosError
      const error = err as AxiosError;

      // Check if the error response contains the 'detail' field
      if (error.response?.data) {
        const responseData = error.response.data as ErrorResponse; // Type casting for response data
        setError(
          responseData?.detail || "Something went wrong. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="register-container container my-5">
      <h2 className="text-center">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="form-group mb-3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            className="form-control"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="profile_picture">Profile Picture</label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
