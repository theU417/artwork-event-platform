// JavaScript exports.getSplashConfig = (req, res) => {
  res.json({
    hue: Math.floor(Math.random() * 360),
    intensity: 0.7 // Default intensity
  });
};