const express = require("express");
const http = require("http");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoute")
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const { Message } = require("./models/model");
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
app.use("/messages",messageRoutes)
app.use("/", orderRoutes);

const customers = {}; // Track connected customers by their socket ID
let adminId;
socketIo.on("connection", (socket) => {
  // Join customers or admin
  socket.on("join", ({ role, userId }) => {
    if (role === "admin") {
      socket.join("admins"); // Admins join a specific room
      adminId = userId;
    } else {
      console.log(userId)
      customers[socket.id] = { userId }; // Track customers
      socket.join("customers"); // Customers join a specific room
    }
  });

  // Admin sending message to a specific customer
  socket.on("sendMessageToCustomer", async ({ customerId, message }) => {
    const customerSocketId = Object.keys(customers).find(
      (key) => customers[key].userId == customerId
    );
    if (customerSocketId) {
      socketIo
        .to(customerSocketId)
        .emit("receiveMessage", { from: "admin", message });
      await Message.create({
        senderId: adminId,
        receiverId: customerId,
        message,
      });
    } else {
      // eslint-disable-next-line no-console
      console.log(`Customer ${customerId} not found.`);
    }
  });

  // Customer sending message to the admin
  socket.on("sendMessageToAdmin", async ({ customerId, message }) => {
    socketIo
      .to("admins")
      .emit("receiveMessage", { from: customers[socket.id]?.userId, message });
    await Message.create({
      senderId: customerId,
      receiverId: adminId,
      message,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (customers[socket.id]) {
      delete customers[socket.id];
    } else {
      // eslint-disable-next-line no-console
      console.log(`Admin disconnected: ${socket.id}`);
    }
  });
});

// Start the server
const PORT = 3100;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
