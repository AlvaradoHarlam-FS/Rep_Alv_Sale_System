import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import Loader from "../../components/loader/Loader";
import { selectUser } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { updateUser } from "../../services/authService";
import ChangePassword from "../../components/changePassword/ChangePassword";
import "./Profile.scss";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { email } = user;

  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    bio: user?.bio,
    photo: user?.photo,
  });
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/profile");
    }
  }, [email, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleImageChange = async (e) => {
    setProfileImage(e.target.files[0]);

    try {
      // Handle Image upload
      if (
        profileImage &&
        ["image/jpeg", "image/jpg", "image/png"].includes(profileImage.type)
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", "dyudfd0a2");
        image.append("upload_preset", "ml_default");

        // First save image to cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dyudfd0a2/image/upload",
          { method: "post", body: image }
        );

        const responseData = await response.json();

        console.log("Cloudinary Response:", responseData);

        if (!response.ok) {
          throw new Error(
            `Image upload failed with status ${response.status}`
          );
        }

        const imageURL = responseData.url.toString();

        // Save Profile
        const formData = {
          name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
          photo: profileImage ? imageURL : profile.photo,
        };

        const data = await updateUser(formData);
        console.log(data);
        toast.success("User updated");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Your existing saveProfile logic
    } catch (error) {
      console.error("Error during profile update:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile --my2">
      {isLoading && <Loader />}

      <Card cardClass={{ card: true, "flex-dir-column": true }}>
        <span className="profile-photo">
          <img src={user?.photo} alt="profilepic" />
        </span>
        <form className="--form-control --m" onSubmit={saveProfile}>
          <span className="profile-data">
            <p>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profile?.name}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={profile?.email}
                disabled
              />
              <br />
              <code>Email cannot be changed.</code>
            </p>
            <p>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile?.phone}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Bio:</label>
              <textarea
                name="bio"
                value={profile?.bio}
                onChange={handleInputChange}
                cols="30"
                rows="10"
              ></textarea>
            </p>
            <p>
              <label>Photo:</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </p>
            <div>
              <button className="--btn --btn-primary">Save Profile</button>
            </div>
          </span>
        </form>
      </Card>
      <br />
      <ChangePassword />
    </div>
  );
};

export default EditProfile;
