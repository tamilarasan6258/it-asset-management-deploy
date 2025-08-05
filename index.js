const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // <-- ✅ Add this
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const requestRoutes = require('./routes/requestRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const healthRoute = require('./routes/healthRoutes');
const setupSwagger = require('./config/swagger');

dotenv.config();              // Load .env variables
connectDB();                  // Connect to MongoDB

const app = express();

app.use(cookieParser());


// ✅ Allow frontend origin + allow credentials
// app.use(cors({
//   origin: 'http://localhost:4200' || 'https://it-asset.netlify.app',  // ✅ Replace with your Angular app's origin
//   credentials: true                 // ✅ Allow sending cookies
// }));


const allowedOrigins = [
  'http://localhost:4200',
  'https://it-asset.netlify.app'          // your Netlify frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // important if you're using cookies or sessions
}));

setupSwagger(app);

app.use(express.json());      // Body parser for JSON



//routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api', healthRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs at ${PORT}/api-docs`);
});
