import { Typography, Box, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { isUserLoggedIn, isAdmin } from "../../utils/api_auth";

function Header(props) {
  const { title = "Stock Management System" } = props;
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("currentUser"); // Clear the cookies
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box
      sx={{
        padding: "40px 0 30px 0",
        marginBottom: "30px",
        borderBottom: "1px solid #000",
      }}
    >
      <Typography
        variant="h1"
        align="center"
        sx={{
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        {title}
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: 1 }}
      >
        <Box display="flex" gap={2}>
          {/* Home */}
          <Button
            variant={location.pathname === "/" ? "contained" : "outlined"}
            color="primary"
            LinkComponent={Link}
            to="/"
            sx={{
              padding: "10px 20px",
            }}
          >
            Home
          </Button>

          {/* Bookmark (user) */}
          {isUserLoggedIn(cookies) && (
            <Button
              variant={location.pathname === "/bookmarks" ? "contained" : "outlined"}
              color="primary"
              LinkComponent={Link}
              to="/bookmarks"
              sx={{
                padding: "10px 20px",
              }}
            >
              Bookmark
            </Button>
          )}

          {/* Categories (admin) */}
          {isAdmin(cookies) && (
            <Button
              variant={location.pathname === "/categories" ? "contained" : "outlined"}
              color="primary"
              LinkComponent={Link}
              to="/categories"
              sx={{
                padding: "10px 20px",
              }}
            >
              Categories
            </Button>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {isUserLoggedIn(cookies) ? (
            <>
              <Typography
                variant="body1"
                fullWidth
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Current User: {cookies.currentUser.name}
              </Typography>
              <Button
                variant={location.pathname === "/profile" ? "contained" : "outlined"}
                color="primary"
                LinkComponent={Link}
                to="/profile"
                sx={{
                  padding: "10px 20px",
                }}
              >
                Profile
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  padding: "10px 20px",
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={location.pathname === "/login" ? "contained" : "outlined"}
                color="primary"
                LinkComponent={Link}
                to="/login"
                sx={{
                  padding: "10px 20px",
                }}
              >
                Login
              </Button>
              <Button
                variant={location.pathname === "/signup" ? "contained" : "outlined"}
                color="primary"
                LinkComponent={Link}
                to="/signup"
                sx={{
                  padding: "10px 20px",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
