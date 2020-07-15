const notFoundHandler = (req, res) => {
  return res.status(404).json({
    error: 'Resource not found.'
  });
};

module.exports = notFoundHandler;
