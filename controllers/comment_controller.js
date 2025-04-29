import { db } from "../config/db.js";

// Create a comment
const createComment = (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;   // Get postId from URL params instead of request body 
    const author_id = req.user.id;

    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }

    const insertQuery = `
        INSERT INTO comment (post_id, content, author_id)
        VALUES (?, ?, ?)
    `;

    db.query(insertQuery, [postId, content, author_id], (err, result) => {
        if (err) {
            console.error("Error inserting comment:", err);
            return res.status(500).json({ message: "Error creating comment" });
        }
        return res.status(201).json({ 
            message: "Comment created successfully", 
            commentId: result.insertId, 
            postId: postId 
        });
    });
};

// Get all comments for a post
const getComments = (req, res) => {
    const postId = req.params.id;
    const query = `SELECT * FROM comment WHERE post_id = ?`;

    db.query(query, [postId], (err, result) => {
        if (err) {
            console.error("Error fetching comments:", err);
            return res.status(500).json({ message: "Error fetching comments" });
        }
        return res.status(200).json(result);
    });
};

// Get a specific comment by its ID
const getCommentById = (req, res) => {
    const commentId = req.params.id;
    const query = `SELECT * FROM comment WHERE id = ?`;

    db.query(query, [commentId], (err, result) => {
        if (err) {
            console.error("Error fetching comment:", err);
            return res.status(500).json({ message: "Error fetching comment" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json(result[0]);
    });
};

// Edit a comment
const editComment = (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;

    const checkQuery = `SELECT * FROM comment WHERE id = ? AND author_id = ?`;

    db.query(checkQuery, [commentId, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error checking comment" });
        }

        if (result.length === 0) {
            return res.status(403).json({ message: "You are not authorized to edit this comment" });
        }

        const updateQuery = `
            UPDATE comment
            SET content = ?
            WHERE id = ?
        `;

        db.query(updateQuery, [content, commentId], (err, result) => {
            if (err) {
                console.error("Error updating comment:", err);
                return res.status(500).json({ message: "Error updating comment" });
            }
            return res.status(200).json({ message: "Comment updated successfully" });
        });
    });
};

// Delete a comment
const deleteComment = (req, res) => {
    const commentId = req.params.id;

    const checkQuery = `SELECT * FROM comment WHERE id = ?`;

    db.query(checkQuery, [commentId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error checking comment" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const comment = result[0];

        // Only the owner or admin can delete
        if (comment.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        const deleteQuery = `DELETE FROM comment WHERE id = ?`;

        db.query(deleteQuery, [commentId], (err, result) => {
            if (err) {
                console.error("Error deleting comment:", err);
                return res.status(500).json({ message: "Error deleting comment" });
            }
            return res.status(200).json({ message: "Comment deleted successfully" });
        });
    });
};

export { createComment, getComments, getCommentById, editComment, deleteComment };
