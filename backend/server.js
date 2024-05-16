const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

//import Controllers
const eventController = require("./controllers/eventControllers");
const userController = require("./controllers/userController");
const bannerController = require("./controllers/bannerController");

//import Routes
const EventRoutes = require("./routes/eventRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const userRoute = require("./routes/userRoutes");
const paymentRoute = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const walletRoutes = require("./routes/walletRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const eventTypeRoutes = require("./routes/eventTypeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const admin = require("./routes/admin");

//import Middlewares
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this based on your frontend's origin
    credentials: true,
  },
});

const db = require("./db/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle new messages and broadcast to connected clients
  socket.on("newMessage", (message) => {
    io.emit("newMessage", message);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);

// Use commonMiddleware for the /api/events route
app.post("/api/events", upload.single("image"), eventController.createEvent);

// Use commonMiddleware for the /api/categories route
app.post("/api/banners", upload.single("image"), bannerController.uploadBanner);

// Use commonMiddleware for the /api/user route
app.post("/api/user", upload.single("image"), userController.uploadAvatar);

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for the React Native app
app.use("/", express.static("public"));

// Serve static files for the admin React app
app.use("/admin", express.static("uploads"));

// Use the db module to establish the MongoDB connection
db.connectToDatabase();

//User App
app.use("/api/events", EventRoutes);
app.use("/api/user", userRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/eventTypes", eventTypeRoutes);

//Admin app
app.use("/api/v2/admin", admin);
app.use("/api/v2/events", upload.single("image"), EventRoutes);
app.use("/api/v2/banners", upload.single("image"), bannerRoutes);
app.use("/api/v2/orders", orderRoutes);
app.use("/api/v2/user", userRoute);
app.use("/api/v2/categories", categoryRoutes);
app.use("/api/v2/eventTypes", eventTypeRoutes);

const port = process.env.PORT || config.get("port");
server.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});
