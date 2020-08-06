const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// environment variables
const config = require('./config/env');
// DB connection
const connectionDB = require('./config/db');
// routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const playlistRoutes = require('./routes/playlists');
const ratingRoutes = require('./routes/ratings');
const tagRoutes = require('./routes/tags');

// Custom middleware
const notFoundHandler = require('./utils/middleware/notFoundHandler');

// Initializing connection to DB
connectionDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    //origin: ['http://localhost:3000'],
    origin: ['https://alv-videos.herokuapp.com/'],
    credentials: true
  })
);
app.use(cookieParser());

// routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', movieRoutes);
app.use('/api', playlistRoutes);
app.use('/api', ratingRoutes);
app.use('/api', tagRoutes);

// 404 middleware
app.use(notFoundHandler);

const port = config.port || 5000;
app.listen({ port }, () => {
  console.log(`Server running on port ${port}`);
});
