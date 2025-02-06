import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Header from "../../components/Header";
import { toast } from "sonner";
import { login } from "../../utils/api_auth";
import { useCookies } from "react-cookie";

function Login() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async () => {
    // check for error
    if (!email || !password) {
      toast.error("Please fill up all the fields.");
      return;
    }

    try {
      // trigger the login API
      const userData = await login(email, password);

      if (!userData) {
        toast.error("Invalid email or password.");
        return;
      }

      // set cookies with the returned user data
      setCookie("currentUser", userData, {
        maxAge: 60 * 60 * 24 * 30, // second * minutes * hours * days
      });

      // redirect user to home
      navigate("/");
      toast.success("Welcome back! You have successfully logged in.");
    } catch (error) {
      toast.error(error?.message || "An error occurred during login.");
    }
  };

  return (
    <Container>
      <Header title="Login to Your Account" />
      <Container maxWidth="sm">
        <Card elevation={5}>
          <CardContent>
            <Typography variant="h4" align="center" mb={4}>
              Login
            </Typography>
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

export default Login;
