import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Delete } from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { addComment, deleteComment, getComments } from "../../utils/api_comment";
import { getProduct } from "../../utils/api_products";
import { isAdmin } from "../../utils/api_auth";
import { API_URL } from "../../constants";

function CommentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]); // ✅ Ensure it's always an array
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    Promise.all([getProduct(id), getComments(id)])
      .then(([productData, commentData]) => {
        setProduct(productData);
        setComments(commentData || []); // ✅ Prevents errors if API returns null
      })
      .catch(() => toast.error("Failed to load product or comments."));
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return toast.error("Comment cannot be empty.");

    const userId = cookies.currentUser?._id;
    if (!userId) return toast.error("You must be logged in to comment.");

    try {
      const newCommentData = await addComment(id, userId, newComment, cookies.currentUser?.token);
      if (newCommentData) {
        setComments((prev) => [...prev, newCommentData]); // ✅ Ensure prev is always iterable
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch {
      toast.error("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAdmin(cookies)) {
      return toast.error("You do not have permission to delete comments.");
    }
  
    try {
      console.log(`Deleting comment ID: ${commentId}`); // Debugging
  
      const success = await deleteComment(commentId, cookies.currentUser?.token);
  
      if (success) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentId)); // ✅ Safe update
        toast.success("Comment deleted.");
      } else {
        console.error("Delete request failed: No success response");
        toast.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment.");
    }
  };
  

  return (
    <Container sx={{ marginTop: 4 }}>
      {product ? (
        <Grid container spacing={3}>
          {/* LEFT SIDE: Product Details */}
          <Grid item xs={12} md={5}>
            <Card sx={{ padding: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h4">{product.name}</Typography>
                <Typography variant="h6" color="green">Price: ${product.price}</Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  {product.description || "No description available."}
                </Typography>
                {product.image && (
                  <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <img
                      src={`${API_URL}/${product.image}`}
                      alt={product.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "250px",
                        borderRadius: "8px",
                        objectFit: "contain",
                      }}
                      onError={(e) => (e.target.style.display = "none")} // Hide broken images
                    />
                  </Box>
                )}
                {isAdmin(cookies) && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, width: "100%" }}
                    onClick={() => navigate(`/products/${product._id}/edit`)}
                  >
                    Edit Product
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT SIDE: Comments Section */}
          <Grid item xs={12} md={7}>
            <Card sx={{ padding: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5">Comments</Typography>

                {/* Scrollable comment list */}
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "60vh",
                    marginTop: 2,
                    padding: 2,
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <Card key={comment._id} sx={{ marginBottom: 1, padding: "10px" }}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{comment.user?.name || "Anonymous"}</Typography>
                            {isAdmin(cookies) && (
                              <IconButton color="error" onClick={() => handleDeleteComment(comment._id)}>
                                <Delete />
                              </IconButton>
                            )}
                          </Box>
                          <Typography variant="body2">{comment.comment}</Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                      No comments yet. Be the first to comment!
                    </Typography>
                  )}
                </Box>

                {/* Comment Input Field */}
                <Box sx={{ marginTop: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    label="Add your comment"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: 1, width: "100%" }}
                    onClick={handleAddComment}
                  >
                    Submit Comment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h5" align="center">
          Product not found.
        </Typography>
      )}
    </Container>
  );
}

export default CommentPage;
