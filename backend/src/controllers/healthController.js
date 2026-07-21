const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Marketplace API is running',
    timestamp: new Date().toISOString(),
  });
};

const getTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend connection successful',
  });
};

module.exports = {
  getHealth,
  getTest,
};