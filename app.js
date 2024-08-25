const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/lib');

const bookschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    }
}, { versionKey: false });


const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        enum: ['American', 'Armenian']
    }
}, { versionKey: false });

const Book = mongoose.model('Book', bookschema);
const Author = mongoose.model('Author', authorSchema);

app.post('/author', async (req, res) => {
    const { name, birthdate, nationality } = req.body;
    const authorDoc = new Author({ name, birthdate, nationality });
    await authorDoc.save();
    res.send('document added successfully');
});

app.post('/book', async (req, res) => {
        const { title, pages } = req.body;
        const latestAuthor = await Author.findOne().sort({ _id: -1 });
        const bookDoc = new Book({
            title,
            pages,
            author: latestAuthor._id
        });
        await bookDoc.save();
        res.send('Book added successfully');
});


app.get('/books', async (req, res) => {
    const books = await Book.find().populate('author');
    res.json(books);
});

app.listen(3000);