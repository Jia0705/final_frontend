import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { BookmarkBorder, Bookmark } from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { API_URL } from "../../constants";

import { getProducts } from "../../utils/api_products";
import { getCategories } from "../../utils/api_categories";
import { deleteProduct } from "../../utils/api_products";
import { getBookmarks, addBookmark, removeBookmark } from "../../utils/api_bookmark";
import { isAdmin, isUserLoggedIn, getUserToken } from "../../utils/api_auth";
import Header from "../../components/Header"; 

function Products() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [bookmark, setBookmark] = useState([]);

  useEffect(() => {
    getProducts(category, page).then(setProducts);
  }, [category, page]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (isUserLoggedIn(cookies)) {
      getBookmarks(cookies.currentUser._id).then((data) => {
        setBookmark(data.products || []);
      });
    }
  }, [cookies]);

  const handleBookmark = async (productId) => {
    const userId = cookies.currentUser._id;
    try {
      if (bookmark.includes(productId)) {
        await removeBookmark(userId, productId);
        setBookmark(bookmark.filter((id) => id !== productId));
      } else {
        await addBookmark(userId, productId);
        setBookmark([...bookmark, productId]);
      }
    } catch {
      toast.error("Failed to update bookmark.");
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 5) return "#ffcccb";
    if (stock <= 15) return "#fffacd";
    return "#d4edda";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const deleted = await deleteProduct(id, token);
      if (deleted) {
        setProducts(await getProducts(category, page));
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <Container>
      <Header />
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: "20px" }}>
        <Typography variant="h4">Products</Typography>
        {isAdmin(cookies) && (
          <Button component={Link} to="/products/new" variant="contained" color="success">
            Add New
          </Button>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, padding: "10px 0", alignItems: "center" }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All Products</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {products.length > 0 ? (
          products
            .filter((product) => product.name.toLowerCase().includes(search))
            .map((product) => (
              <Grid key={product._id} size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "8px",
                    boxShadow: 3,
                    backgroundColor: getStockColor(product.stock),
                  }}
                >
                  {product.image && <CardMedia component="img" image={`${API_URL}/${product.image}`} />}
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{product.name}</Typography>

                      {/* Hide bookmark for guests */}
                      {isUserLoggedIn(cookies) && (
                        <IconButton onClick={() => handleBookmark(product._id)}>
                          {bookmark.includes(product._id) ? (
                            <Bookmark sx={{ color: "#ff9800" }} />
                          ) : (
                            <BookmarkBorder sx={{ color: "#1976d2" }} />
                          )}
                        </IconButton>
                      )}
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography color="green" fontWeight="bold">
                        ${product.price}
                      </Typography>
                      <Typography
                        sx={{
                          padding: "2px 8px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          marginTop: "5px",
                          textTransform: "capitalize",
                        }}
                        color="textSecondary"
                      >
                       {product.category && product.category.name
                        ? product.category.name
                        : ""}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                      Stock: {product.stock}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: "block", padding: "16px" }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        marginBottom: "10px",
                        backgroundColor: "#1976d2",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#115293" },
                      }}
                      onClick={() => navigate(`/products/${product._id}/comment`)}
                    >
                      Check
                    </Button>
                    {isAdmin(cookies) && (
                      <Box display="flex" justifyContent="space-between">
                        <Button variant="outlined" component={Link} to={`/products/${product._id}/edit`} size="small">
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(product._id)}>
                          Delete
                        </Button>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
        ) : (
          <Typography variant="body1" align="center" sx={{ width: "100%" }}>
            No product found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Products;
