import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Typography, Box, IconButton, CircularProgress, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { BookmarkBorder, Bookmark } from "@mui/icons-material"; 
import Header from "../../components/Header";
import { useCookies } from "react-cookie";
import { addBookmark, getBookmarks, removeBookmark } from "../../utils/api_bookmark"; 
import { API_URL } from "../../constants";

function Bookmarks() {
  const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [bookmarkedProducts, setBookmarkedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookmarked products on page load
  useEffect(() => {
    if (cookies.currentUser) {
      getBookmarks(cookies.currentUser._id)
        .then((data) => {
          setBookmarkedProducts(data?.products || []);
          setLoading(false); // Data loaded, stop loading spinner
        })
        .catch((error) => {
          console.error("Error fetching bookmarks:", error);
          setLoading(false); // Stop loading spinner on error
        });
    }
  }, [cookies]);

  // Handle removing a bookmark
  const handleRemoveBookmark = async (productId) => {
    if (cookies.currentUser) {
      await removeBookmark(cookies.currentUser._id, productId);
      setBookmarkedProducts(bookmarkedProducts.filter((id) => id !== productId));
    }
  };

  // Handle adding a bookmark
  const handleAddBookmark = async (productId) => {
    if (cookies.currentUser) {
      await addBookmark(cookies.currentUser._id, productId);
      setBookmarkedProducts([...bookmarkedProducts, productId]);
    }
  };

  return (
    <Container>
      <Header />
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: "20px" }}>
        <Typography variant="h4">Bookmarked Products</Typography>
      </Box>

      {/* Show a loading spinner while bookmarks are being fetched */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: "40px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {bookmarkedProducts.length > 0 ? (
            bookmarkedProducts.map((product) => (
              <Grid key={product._id} size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <Card variant="outlined" sx={{ borderRadius: "8px", boxShadow: 3 }}>
                  {product.image ? (
                    <CardMedia component="img" image={`${API_URL}/${product.image}`} />
                  ) : null}
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{product.name}</Typography>
                      <Tooltip title={bookmarkedProducts.includes(product._id) ? "Remove Bookmark" : "Add Bookmark"}>
                        <IconButton
                          onClick={() => {
                            // Toggle between add and remove bookmarks
                            if (bookmarkedProducts.includes(product._id)) {
                              handleRemoveBookmark(product._id);
                            } else {
                              handleAddBookmark(product._id);
                            }
                          }}
                        >
                          {bookmarkedProducts.includes(product._id) ? (
                            <Bookmark sx={{ color: "#ff9800" }} />
                          ) : (
                            <BookmarkBorder sx={{ color: "#1976d2" }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {product.description ? product.description : "No description available."}
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
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant="body1" align="center">
                    No bookmarks found. Add some products to your bookmarks list.
                  </Typography>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/products")}>
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default Bookmarks;
