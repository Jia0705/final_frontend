import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import Header from "../../components/Header";
import {
  getCategories,
  addNewCategory,
  deleteCategory,
} from "../../utils/api_categories";
import { getUserToken, isAdmin } from "../../utils/api_auth";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

function Categories() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  // Fetch categories
  useEffect(() => {
    getCategories(token).then((data) => {
      setCategories(data);
    });
  }, [token]);

  const handleCategoryAdd = async (event) => {
    event.preventDefault();
    if (!name) {
      toast.error("Please fill out all the required fields");
    } else {
      const newCategoryData = await addNewCategory(name, token);
      if (newCategoryData) {
        toast.success("Category has been added successfully");
        setCategories(await getCategories(token));
        setName("");
      }
    }
  };

  const handleCategoryDelete = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmed) {
      const deleted = await deleteCategory(_id, token);
      if (deleted) {
        const latestCategory = await getCategories(token);
        setCategories(latestCategory);
        toast.success("Category has been deleted");
      } else {
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <Container>
      <Header title="Categories" />
      <Card elevation={1} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" align="center" mb={4}>
            Add Category
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Category Name"
              required
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCategoryAdd}
            >
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <strong>{category.name}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/categories/${category._id}/edit`}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleCategoryDelete(category._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No category found!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Categories;
