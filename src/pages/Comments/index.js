import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Delete } from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { getProduct } from "../../utils/api_products";
import { getComments, deleteComment, addComment } from "../../utils/api_comment"; 
import { isAdmin, getUserToken } from "../../utils/api_auth";
import { API_URL } from "../../constants"; 
import Header from "../../components/Header"; 

function Comment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState("");
  const token = getUserToken(cookies); 

  useEffect(() => {
    getProduct(id).then((productData) => {
      setProduct(productData);
    });

    getComments(id).then((commentData) => {
      setComments(commentData);
    });
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment || newComment === "") return toast.error("Comment cannot be empty.");

    const userId = cookies.currentUser?._id; 
    const userName = cookies.currentUser?.name; 
    if (!userId) return toast.error("You must be logged in to comment.");

    try {
      const newCommentData = await addComment(
        id,
        userId,
        newComment,
        token 
      );
      if (newCommentData) {
        newCommentData.user = { name: userName };
        setComments((abc) => [...abc, newCommentData]);
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch {
      toast.error("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAdmin(cookies)) {
      const userId = cookies.currentUser?._id;
      const commentToDelete = comments.find((comment) => comment._id === commentId);

      if (commentToDelete?.user._id !== userId) {
        return toast.error("You can only delete your own comments.");
      }
    }

    try {
      const success = await deleteComment(commentId, token);

      if (success) {
        setComments((abc) =>
          abc.filter((comment) => comment._id !== commentId)
        );
        toast.success("Comment deleted.");
      } else {
        toast.error("Failed to delete comment.");
      }
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <Container sx={{ marginTop: 2 }}>
      <Header title="Product Details and Comments" /> 
       {/* Products */}
      {product ? (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Card sx={{ width: "48%", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4">{product.name}</Typography>
              <Typography variant="h6" color="green">
                Price: ${product.price}
              </Typography>
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
                    onError={(event) => (event.target.style.display = "none")}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card sx={{ width: "48%", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5">Comments</Typography>

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
                          <Typography variant="h6">
                            {comment.user?.name || "Anonymous"}
                          </Typography>
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

              {/* Add new comment */}
              <Box sx={{ marginTop: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
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
        </Box>
      ) : (
        <Typography variant="h5" align="center">
          Product not found.
        </Typography>
      )}
    </Container>
  );
}

export default Comment;
