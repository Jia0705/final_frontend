import { Container, Typography, TextField, Box, Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Header from "../../components/Header";
import { toast } from "sonner";
import { getCategories, updateCategory } from "../../utils/api_categories";
import { getUserToken } from "../../utils/api_auth";
import { useCookies } from "react-cookie";

function CategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    getCategories(id).then((categoryData) => {
      setName(categoryData.name);
      setLoading(false);
    });
  }, [id]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      toast.error("Please fill out all the required fields");
    } else {
      const updatedCategory = await updateCategory(id, name, token);
      if (updatedCategory) {
        toast.success("Category has been updated successfully!");
        navigate("/categories");
      }
    }
  };

  return (
    <>
      <Container>
        <Header />
        <Card>
          <CardContent>
            <Typography variant="h4" align="center" mb={4}>
              Edit Category
            </Typography>
            <Box mb={2}>
              <TextField
                label="Category Name"
                required
                fullWidth
                value={name}
                onChange={(event) => 
                  setName(event.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFormSubmit}
            >
              Update
            </Button>
          </CardContent>
        </Card>
      </Container>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" ml={2}>
          Loading...
        </Typography>
      </Backdrop>
    </>
  );
}

export default CategoryEdit;
