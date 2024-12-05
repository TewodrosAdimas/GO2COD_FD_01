import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Styles.css"; // Import CSS styles

interface ProfileData {
  username: string;
  email: string;
  bio: string | null;
  profile_picture: string | null;
}

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // For loading state
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      axios
        .get<ProfileData>("http://localhost:8000/accounts/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          console.log("Profile data fetched:", response.data); // Debugging
          setProfileData(response.data);
          setFormData({
            username: response.data.username,
            email: response.data.email,
            bio: response.data.bio || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setError("Failed to load profile data.");
          setLoading(false);
        });
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    if (token) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("username", formData.username);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("bio", formData.bio);

      if (file) {
        formDataToSubmit.append("profile_picture", file);
      }

      try {
        const response = await axios.put<ProfileData>(
          "http://localhost:8000/accounts/profile/",
          formDataToSubmit,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          setProfileData(response.data);
          setError(null);
          alert("Profile updated successfully.");
          // Redirect to profile page after update
          navigate("/profile"); // Use navigate to redirect to the profile page
        }
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("An error occurred while updating your profile.");
      }
    }
  };

  const profilePictureUrl = profileData?.profile_picture
    ? `http://localhost:8000${profileData.profile_picture}`
    : "https://via.placeholder.com/100";

  return (
    <div className="container edit-profile-container">
      <h2 className="text-center my-4">Edit Profile</h2>

      {loading ? (
        <p className="text-center text-secondary">Loading profile data...</p>
      ) : (
        <>
          {error && <p className="text-danger text-center">{error}</p>}

          {profileData ? (
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="p-4 shadow-lg rounded"
            >
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleTextAreaChange}
                  className="form-control"
                  rows={3}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="profile_picture" className="form-label">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profile_picture"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>
              {profilePictureUrl && (
                <div className="mb-3 text-center">
                  <h5>Current Profile Picture</h5>
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="img-fluid rounded-circle profile-picture-preview"
                  />
                </div>
              )}
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-secondary">
              Failed to load profile data.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default EditProfile;
