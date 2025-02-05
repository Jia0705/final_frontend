import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Typography, Box, TextField, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { ArrowRight, ArrowLeft, BookmarkBorder, Bookmark } from "@mui/icons-material";
import Header from "../../components/Header";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { API_URL } from "../../constants";

import { getProducts } from "../../utils/api_products";
import { getCategories } from "../../utils/api_categories";
import { deleteProduct } from "../../utils/api_products";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "../../utils/api_bookmark";
import { isAdmin, getUserToken } from "../../utils/api_auth";

function Products() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [bookmarkedProducts, setBookmarkedProducts] = useState([]); // Store bookmarked products

  useEffect(() => {
    getProducts(category, page).then((data) => {
      setProducts(data);
    });
  }, [category, page]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (cookies.currentUser) {
      getBookmarks(cookies.currentUser._id).then((data) => {
        setBookmarkedProducts(data.products || []);
      });
    }
  }, [cookies]);

  // Handle Bookmark Toggle
  const handleBookmark = async (productId) => {
    const userId = cookies.currentUser._id;
    try {
      if (bookmarkedProducts.includes(productId)) {
        // Remove from bookmarks if already bookmarked
        await removeBookmark(userId, productId);
        setBookmarkedProducts(bookmarkedProducts.filter((id) => id !== productId));
      } else {
        // Add to bookmarks if not already bookmarked
        await addBookmark(userId, productId);
        setBookmarkedProducts([...bookmarkedProducts, productId]);
      }
    } catch (error) {
      toast.error("Failed to update bookmark.");
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 5) return "#ffcccb";
    if (stock <= 15) return "#fffacd";
    return "#d4edda";
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      const deleted = await deleteProduct(id, token);
      if (deleted) {
        const latestProducts = await getProducts(category, page);
        setProducts(latestProducts);
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <Container>
      <Header />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Products</Typography>
        {isAdmin(cookies) && (
          <Button LinkComponent={Link} to="/products/new" variant="contained" color="success">
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
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            label="category"
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
                  {product.image ? (
                    <CardMedia component="img" image={`${API_URL}/${product.image}`} />
                  ) : null}
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{product.name}</Typography>
                      <IconButton onClick={() => handleBookmark(product._id)}>
                        {bookmarkedProducts.includes(product._id) ? (
                          <Bookmark sx={{ color: "#ff9800" }} />
                        ) : (
                          <BookmarkBorder sx={{ color: "#1976d2" }} />
                        )}
                      </IconButton>
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                      <Typography color="green" fontWeight="bold">${product.price}</Typography>
                      <Typography
                        sx={{
                          display: "inline-block",
                          padding: "2px 8px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          marginTop: "5px",
                          textTransform: "capitalize",
                        }}
                        color="textSecondary"
                      >
                        {product.category?.name || ""}
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
                      Check in Detail
                    </Button>
                    {isAdmin(cookies) && (
                      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Button
                          variant="outlined"
                          LinkComponent={Link}
                          to={`/products/${product._id}/edit`}
                          color="primary"
                          size="small"
                          sx={{ textTransform: "none", marginRight: "8px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
        ) : (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="body1" align="center">
                  No product found.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ padding: "20px 0 40px 0" }}>
        <Button variant="contained" color="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <ArrowLeft /> Prev
        </Button>
        <span>Page {page}</span>
        <Button variant="contained" color="secondary" disabled={products.length === 0} onClick={() => setPage(page + 1)}>
          Next <ArrowRight />
        </Button>
      </Box>
    </Container>
  );
}

export default Products;
