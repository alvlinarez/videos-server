const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// environment variables
const config = require('./src/config/env');
// DB connection
const connectionDB = require('./src/config/db');
// routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const movieRoutes = require('./src/routes/movies');
const playlistRoutes = require('./src/routes/playlists');
const ratingRoutes = require('./src/routes/ratings');
const tagRoutes = require('./src/routes/tags');

// Custom middleware
const notFoundHandler = require('./src/utils/middleware/notFoundHandler');

// Initializing connection to DB
connectionDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(cors());

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
