import { db } from "../config/db.js";

const createPost = (req, res) => {
    const { title, content, category,  reading_time } = req.body;
    const image = req.file ? req.file.filename : null;
    const author_id = req.user.id;

    const insertQuery = `
        INSERT INTO post (title, content,category, author_id, image, reading_time )
        VALUES (?, ?, ?, ?,?,?)
    `;

    db.query(insertQuery, [title, content, category, author_id, image, reading_time], (err, result) => {
        if (err) {
            console.error("Error inserting post:", err);
            return res.status(500).json({ message: "Error creating post" });
        }
        return res.status(201).json({ message: "Post created successfully", postId: result.insertId, author_id });
    });
}

const getPosts = (req, res) => {
   const result =  ` select * from post `;
   db.query(result, (err, result) => {
        if (err) {
            console.error("Error fetching posts:", err);
            return res.status(500).json({ message: "Error fetching posts" });
        }
        return res.status(200).json(result);
    });
} 

const getPostById = (req, res) => {
    const postId = req.params.id;
    const query = `SELECT * FROM post WHERE id = ?`;
    db.query(query, [postId], (err, result) => {
        if (err) {
            console.error("Error fetching post:", err);
            return res.status(500).json({ message: "Error fetching post" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(result[0]);
    });
}

const editPost = (req, res) => {
    const postId = req.params.id;
    const { title, content, category, reading_time } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const checkQuery = `SELECT * FROM post WHERE id = ? AND author_id = ?`;

    db.query(checkQuery, [postId, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error checking post" });
        }

        if (result.length === 0) {
            return res.status(403).json({ message: "You are not authorized to edit this post" });
        }

        const currentPost = result[0];
        const imageToSave = newImage || currentPost.image; // Keep existing image if not uploading a new one

        const updateQuery = `
            UPDATE post
            SET title = ?, content = ?, category = ?, reading_time = ?, image = ?
            WHERE id = ?
        `;

        db.query(updateQuery, [title, content, category, reading_time, imageToSave, postId], (err, result) => {
            if (err) {
                console.error("Error updating post:", err);
                return res.status(500).json({ message: "Error updating post" });
            }
            return res.status(200).json({ message: "Post updated successfully" });
        });
    });
};


const deletePost = (req, res) => {
    const postId = req.params.id;

    const checkQuery = `SELECT * FROM post WHERE id = ?`;

    db.query(checkQuery, [postId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error checking post" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        const post = result[0];

        // Only the owner or admin can delete
        if (post.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        const deleteQuery = `DELETE FROM post WHERE id = ?`;

        db.query(deleteQuery, [postId], (err, result) => {
            if (err) {
                console.error("Error deleting post:", err);
                return res.status(500).json({ message: "Error deleting post" });
            }
            return res.status(200).json({ message: "Post deleted successfully" });
        });
    });
};


export {createPost, getPosts, getPostById, editPost, deletePost};