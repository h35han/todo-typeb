export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)[0]?.message || 'Invalid todo data';
    return res.status(400).json({ message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid todo id' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON' });
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
}
