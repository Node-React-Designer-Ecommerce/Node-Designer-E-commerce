const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        description: {
            type: String
        },
        image: {
            type: String
        }
    }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
