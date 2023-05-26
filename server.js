//chakri9182
const express = require("express");
const { mongoose } = require("mongoose");

const app = express();
const port = 5000;
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://chakravarthy:chakri9182@cluster1.1h8rtr5.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database is connected");
  })
  .catch(() => {
    console.log("database is not connected");
  });

const { Schema } = mongoose;

const AllblogsSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  posted_at: {
    type: Date,
    default: Date.now,
  },
  posted_by: {
    type: String,
    required: true,
  },
});
const Blog = mongoose.model("Blog", AllblogsSchema);
//get method getting all blogs
app.get("/blogs", async (req, res) => {
  const { page, search } = req.query;
  const limit = 5;
  const skip = (page - 1) * limit;
  try {
    const query = search ? { topic: { $regex: search, $options: "i" } } : {};
    const allBlogs = await Blog.find(query).skip(skip).limit(limit);
    return res.json({ status: "success", result: allBlogs });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});
// post method
app.post("/blog", async (req, res) => {
  const { topic, description, posted_by } = req.body;
  try {
    const blog = await Blog.create({
      topic,
      description,
      posted_by,
    });
    res.json({ status: "success", result: blog });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

//update
app.put("/blog/:id", async (req, res) => {
  const { id } = req.params;
  const { topic, description, posted_by } = req.body;

  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { topic, description, posted_by },
      { new: true }
    );
    res.json({ status: "success", result: blog });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});
// delete id
app.delete("blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    res.json({ status: "success", result: blog });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});
app.listen(port, () => {
  console.log(`server running at ${port}`);
});
