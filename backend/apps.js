const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Import routers
const driversRouter = require("./routes/drivers");
const packagesRouter = require("./routes/packages");

const app = express();

 
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// Your routes and other middleware here


const PORT = 2688;
// const url = "mongodb://localhost:27017/DriverManagementPortal";
const url = "mongodb://127.0.0.1:27017/myapp";

const API_KEY = process.env.GOOGLE_API_KEY; // Store your API key in .env file


// Stats model
const statsSchema = new mongoose.Schema({
    inserts: { type: Number, default: 0 },
    updates: { type: Number, default: 0 },
    reads: { type: Number, default: 0 },
    deletes: { type: Number, default: 0 },
  });
  
  const Stats = mongoose.model('Stats', statsSchema);
  
  // Initialize stats
  async function initializeStats() {
    const existingStats = await Stats.findOne();
    if (!existingStats) {
      await Stats.create({});
    }
  }
  
initializeStats().catch(err => console.error(err));
  
  // Middleware to track stats
  const statsMiddleware = async (req, res, next) => {
    res.on('finish', async () => {
      const stats = await Stats.findOne();
  
      if (req.method === 'POST') {
        stats.inserts++;
      } else if (req.method === 'PUT' || req.method === 'PATCH') {
        stats.updates++;
      } else if (req.method === 'GET') {
        stats.reads++;
      } else if (req.method === 'DELETE') {
        stats.deletes++;
      }
  
      await stats.save();
    });
    next();
  };
  
app.use(statsMiddleware);

// Setting up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
// Middlewares for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use("/33173273/Nayla/api/v1/drivers", driversRouter);
app.use("/33173273/Nayla/api/v1/packages", packagesRouter);

// Default route to API
app.get("/", (req, res) => {
    res.redirect("/33173273/Nayla/api/v1");
});

app.get('/stats', async (req, res) => {
    const stats = await Stats.findOne();
    res.send(stats);
});

// API Index Route to display counts
app.get("/33173273/Nayla/api/v1", async (req, res) => {
    try {
        const driversCount = await mongoose.model('Driver').countDocuments();
        const packagesCount = await mongoose.model('Package').countDocuments();
        // const driversCount = 0;
        // const packagesCount = 0;
        res.render("index", { driversCount, packagesCount });
    } catch (error) {
        console.error("Error fetching counts:", error);
        res.status(500).send("Error fetching data");
    }
});

const server = http.createServer(app);

const io = socketIo(server);
// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('translate', async ({ text, targetLanguage }) => {
        try {
            const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
                q: text,
                target: targetLanguage
            });
            socket.emit('translated', response.data.data.translations[0].translatedText);
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Translation failed');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Server listening
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});