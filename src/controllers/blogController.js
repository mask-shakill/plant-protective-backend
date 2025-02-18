const Blog = require("../models/Blog");

const getBlogs = async (req, res) => {
  const blogs = await Blog.find().populate("author", "name email");
  res.json(blogs);
};

const createBlog = async (req, res) => {
  const { title, content, coverImage } = req.body;
  const blog = await Blog.create({
    title,
    content,
    coverImage,
    author: req.user.id,
  });
  res.status(201).json(blog);
};

const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog && blog.author.toString() === req.user.id) {
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.coverImage = req.body.coverImage || blog.coverImage;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).json({ message: "Blog not found" });
  }
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog && blog.author.toString() === req.user.id) {
    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } else {
    res.status(404).json({ message: "Blog not found" });
  }
};

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog };
