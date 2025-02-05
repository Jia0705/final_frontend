import { Container, Typography, TextField, Box, Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import Header from "../../components/Header";
import { toast } from "sonner";
import { editProduct, getProduct } from "../../utils/api_products";
import { getUserToken } from "../../utils/api_auth";
import { getCategories } from "../../utils/api_categories";
import { useCookies } from "react-cookie";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);

  useEffect(() => {
    getProduct(id).then((productData) => {
      setLoading(false);
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category);
      setStock(productData.stock);
    });
  }, [id]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // check for error
    if (!name || !price || !category || !stock) {
      toast.error("Please fill out all the required fields");
    } else {
      // trigger the API
      const updatedProduct = await editProduct(
        id,
        name,
        description,
        price,
        category,
        stock,
        token
      );

      if (updatedProduct) {
        toast.success("Product has been edited successfully!");
        navigate("/");
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
              Edit Product
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
                label="Description"
                required
                fullWidth
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Price"
                required
                fullWidth
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Box>
            <Box mb={2}>
              <FormControl sx={{ minWidth: "100%" }}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="category"
                  onChange={(event) => {
                    console.log(event.target.value);
                    setCategory(event.target.value);
                  }}
                  sx={{
                    width: "100%",
                  }}
                >
                  {categories.map((category) => {
                    return (
                      <MenuItem value={category._id}>{category.name}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                label="Stock"
                required
                fullWidth
                value={stock}
                onChange={(event) => setStock(event.target.value)}
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

export default ProductEdit;
