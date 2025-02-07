import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUserToken, isUserLoggedIn } from "../../utils/api_auth";
import { getUserProfile, updateUserProfile } from "../../utils/api_profile";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { toast } from "sonner";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!isUserLoggedIn(cookies)) {
      toast.error("You must be logged in to view your profile.");
      navigate("/login");
      return;
    }

    const token = getUserToken(cookies);
    const userId = cookies.currentUser?._id;

    if (!token || !userId) {
      toast.error("You must be logged in to view your profile.");
      return;
    }

    getUserProfile(userId, token)
      .then((userData) => {
        if (userData) {
          setName(userData.name);
          setEmail(userData.email);
        }
      })
      .catch(() => {
        toast.error("Failed to load profile.");
      });
  }, [cookies, navigate]);

  const handleUpdateProfile = async () => {
    // check error
    if (!name || !oldPassword || !newPassword) {
      return toast.error(
        "Name, old password, and new password cannot be empty."
      );
    }

    if (oldPassword === newPassword) {
      return toast.error("New password cannot be the same as old password.");
    }

    try {
      const token = getUserToken(cookies);
      const userId = cookies.currentUser?._id;

      if (!token || !userId) {
        toast.error("You must be logged in to update your profile.");
        return;
      }

      const updatedUser = await updateUserProfile(
        userId,
        { name, oldPassword, newPassword },
        token
      );

      if (updatedUser) {
        // update the currentUser cookie with the new profile data
        setCookie("currentUser", {
          ...cookies.currentUser,
          name: updatedUser.name,
          email: updatedUser.email,
        });

        toast.success("Profile updated!");
        navigate("/");

        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      toast.error("Profile update failed.");
    }
  };

  return (
    <Container>
      <Header title="User Profile" />
      <Card sx={{ padding: 2, maxWidth: 500, margin: "auto" }}>
        <CardContent>
          <Box sx={{ marginTop: 2 }}>
            {/* Name */}
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{ marginBottom: 2 }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              value={email}
              InputProps={{ readOnly: true }}
              sx={{
                marginBottom: 2,
                backgroundColor: "#f5f5f5",
              }}
            />

            {/* Old Password */}
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              sx={{ marginBottom: 2 }}
            />

            {/* New Password */}
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
            >
              Update Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;
