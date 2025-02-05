import { useState, useEffect } from "react";
import { Container, Button, Typography, Box, TextField, Card, CardContent } from "@mui/material";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { getUserProfile, updateUserProfile } from "../../utils/api_profile";

function UserProfile() {
  const [cookies] = useCookies(["currentUser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!cookies.currentUser?._id) {
      toast.error("You must be logged in to view your profile.");
      return;
    }

    // Fetch user profile
    getUserProfile(cookies.currentUser._id, cookies.currentUser?.token)
      .then((userData) => {
        if (userData) {
          setName(userData.name);
          setEmail(userData.email);
        }
      })
      .catch(() => toast.error("Failed to load profile."));
  }, [cookies]);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      return toast.error("Name and email cannot be empty.");
    }

    try {
      const updatedUser = await updateUserProfile(
        cookies.currentUser._id,
        { name, email },
        cookies.currentUser?.token
      );

      if (updatedUser) {
        toast.success("Profile updated!");
      }
    } catch {
      toast.error("Profile update failed.");
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card sx={{ padding: 2, boxShadow: 3, maxWidth: 500, margin: "auto" }}>
        <CardContent>
          <Typography variant="h4">User Profile</Typography>

          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "100%" }}
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

export default UserProfile;
