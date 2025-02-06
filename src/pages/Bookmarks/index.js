import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Grid2,
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
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "../../utils/api_bookmark";
import { getCategories } from "../../utils/api_categories";
import { isUserLoggedIn, getUserToken } from "../../utils/api_auth";
import Header from "../../components/Header";

function Bookmarks() {
  const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [bookmark, setBookmark] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = getUserToken(cookies);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (cookies.currentUser) {
      getBookmarks(cookies.currentUser._id, token)
        .then((data) => {
          setBookmark(data || []);
        })
        .catch((error) => {
          console.error("Error fetching bookmarks:", error);
        });
    }
  }, [cookies, token]);

  // remove bookmark
  const handleRemoveBookmark = async (productId) => {
    if (cookies.currentUser) {
      try {
        await removeBookmark(cookies.currentUser._id, productId, token);
        const updatedBookmarks = await getBookmarks(
          cookies.currentUser._id,
          token
        );
        setBookmark(updatedBookmarks || []);
      } catch (error) {
        console.error("Error removing bookmark:", error);
      }
    }
  };

  // add bookmark
  const handleAddBookmark = async (productId) => {
    if (cookies.currentUser) {
      try {
        const addedProduct = await addBookmark(
          cookies.currentUser._id,
          productId,
          token
        );
        setBookmark([...bookmark, addedProduct]);
      } catch (error) {
        console.error("Error adding bookmark:", error);
      }
    }
  };

  // stock color
  const getStockColor = (stock) => {
    if (stock <= 5) return "#ffcccb";
    if (stock <= 15) return "#fffacd";
    return "#d4edda";
  };

  return (
    <Container>
      <Header />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "20px" }}
      >
        <Typography variant="h4">Bookmark</Typography>
      </Box>

      <Grid container spacing={2}>
        {bookmark.length > 0 ? (
          bookmark.map((product) => {
            // Find the category name for the product
            const categoryName = categories.find(
              (category) => category._id === product.category
            )
              ? categories.find((category) => category._id === product.category)
                  .name
              : "Uncategorized";

            return (
              <Grid key={product._id} item xs={12} sm={4} md={4} lg={4}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "8px",
                    boxShadow: 3,
                    backgroundColor: getStockColor(product.stock),
                  }}
                >
                  {product.image && (
                    <CardMedia
                      component="img"
                      image={`${API_URL}/${product.image}`}
                      sx={{
                        height: 400,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">{product.name}</Typography>
                      <Tooltip
                        title={
                          bookmark.some((item) => item._id === product._id)
                            ? "Remove Bookmark"
                            : "Add Bookmark"
                        }
                      >
                        <IconButton
                          onClick={() => {
                            if (
                              bookmark.some((item) => item._id === product._id)
                            ) {
                              handleRemoveBookmark(product._id);
                            } else {
                              handleAddBookmark(product._id);
                            }
                          }}
                        >
                          {bookmark.some((item) => item._id === product._id) ? (
                            <Bookmark sx={{ color: "#ff9800" }} />
                          ) : (
                            <BookmarkBorder sx={{ color: "#1976d2" }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      sx={{ marginTop: 1 }}
                    >
                      <Typography color="green" fontWeight="bold">
                        ${product.price}
                      </Typography>
                      <Typography
                        sx={{
                          display: "inline-block",
                          padding: "2px 8px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          textTransform: "capitalize",
                        }}
                        color="textSecondary"
                      >
                        {categoryName}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ mt: 1 }}
                    >
                      Stock: {product.stock}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1 }}
                      color="textSecondary"
                    >
                      {product.description || "No description available."}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: "block", padding: "16px" }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        marginTop: "10px",
                        backgroundColor: "#1976d2",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#115293" },
                      }}
                      onClick={() =>
                        navigate(`/products/${product._id}/comment`)
                      }
                    >
                      Check
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid size ={12}>
            <Card>
              <CardContent>
                <Typography variant="body1" align="center">
                  No bookmarks found. Add some products to your bookmarks list.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Bookmarks;
