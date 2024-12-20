const express = require("express");
const http = require("http");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow all origins, change this to specific domains in production
  },
});

// Middleware
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Sanitize request data
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);
app.use("/auth", authRoutes);
app.use("/", orderRoutes);

const customers = {}; // Track connected customers by their socket ID

socketIo.on("connection", (socket) => {

  // Join customers or admin
  socket.on("join", ({ role, userId }) => {
    if (role === "admin") {
      socket.join("admins"); // Admins join a specific room
      console.log("Admin connected:", userId);
    } else {
      customers[socket.id] = { userId }; // Track customers
      socket.join("customers"); // Customers join a specific room
      console.log("Customer connected:", userId);
    }
  });

  // Admin sending message to a specific customer
  socket.on("sendMessageToCustomer", ({ customerId, message }) => {
    const customerSocketId = Object.keys(customers).find(
      (key) => customers[key].userId === customerId
    );
    if (customerSocketId) {
      socketIo
        .to(customerSocketId)
        .emit("receiveMessage", { from: "admin", message });
      console.log(`Message sent to customer ${customerId}: ${message}`);
    } else {
      console.log(`Customer ${customerId} not found.`);
    }
  });

  // Customer sending message to the admin
  socket.on("sendMessageToAdmin", ({ message }) => {
    socketIo
      .to("admins")
      .emit("receiveMessage", { from: customers[socket.id]?.userId, message });
    console.log(
      `Message from customer ${customers[socket.id]?.userId}: ${message}`
    );
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (customers[socket.id]) {
      console.log(`Customer disconnected: ${customers[socket.id].userId}`);
      delete customers[socket.id];
    } else {
      console.log(`Admin disconnected: ${socket.id}`);
    }
  });
});

// Start the server
const PORT = 3100;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
