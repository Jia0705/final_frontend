import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Header from "../../components/Header";
import { toast } from "sonner";
import { signup } from "../../utils/api_auth";
import { useCookies } from "react-cookie";

function SignUp() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = async () => {
    // check for error
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill up all the fields");
    } else if (password !== confirmPassword) {
      toast.error("Your password does not match");
    } else {
      try {
        // trigger the API
        const userData = await signup(name, email, password);
        if (userData) {
          // set cookies
          setCookie("currentUser", userData, {
            maxAge: 60 * 60 * 24 * 30, // second * minutes * hours * days
          });
          // redirect user back to home
          navigate("/");
          toast.success("You have successfully signed up. Happy shopping!");
        }
      } catch (error) {
        toast.error("Signup failed. Please try again.");
      }
    }
  };
  

  return (
    <Container>
      <Header title = "Create a New Account" />
      <Container maxWidth="sm">
        <Card elevation={5}>
          <CardContent>
            <Typography variant="h4" align="center" mb={4}>
              Sign Up
            </Typography>
            <Box mb={2}>
              <TextField
                label="Name"
                required
                fullWidth
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Confirm Password"
                type="password"
                required
                fullWidth
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Container>
  );
}

export default SignUp;
