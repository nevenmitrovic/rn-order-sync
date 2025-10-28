import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import fs from "fs";
import path from "path";
import { Expo } from "expo-server-sdk";

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  address: string;
  role: "admin" | "user";
}
export interface Product {
  id: number;
  name: string;
  category: string;
  pricePerKg?: number;
  pricePerLiter?: number;
  pricePerDozen?: number;
  unit: "liter" | "kg" | "dozen";
  availableQuantity: number;
  harvestDate: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unit: "liter" | "kg" | "dozen";
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  orderDate: string;
}

export interface OrderRequest {
  items: OrderItem[];
  totalAmount: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  address: string;
}
export interface UserToken {
  userId: number;
  pushToken: string;
}

const SECRET_KEY: string = "your-secret-key";
const app = express();
export const expo = new Expo();
app.use(express.json());
app.use(cors());

export const sendAdminNotification = async (order: Order): Promise<void> => {
  try {
    const users = loadUsers();
    const tokens = loadTokens();

    // Find all admin users
    const adminUsers = users.filter((user) => user.role === "admin");

    for (const admin of adminUsers) {
      // Find admin's push token
      const adminToken = tokens.find((token) => token.userId === admin.id);

      if (adminToken?.pushToken) {
        const message = {
          to: adminToken.pushToken,
          title: "Nova narudžbina",
          body: `Kreirana je nova narudžbina #${order.id} u vrednosti od $${order.totalAmount}`,
          android: {
            channelId: "default",
          },
        };

        const messageResponse = await expo.sendPushNotificationsAsync([
          message,
        ]);
      }
    }
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};

// Load tokens from JSON file
export const loadTokens = (): UserToken[] => {
  try {
    const tokensPath = path.join(__dirname, "db/tokens.json");

    // Check if file exists
    if (!fs.existsSync(tokensPath)) {
      console.error(`Tokens file not found at: ${tokensPath}`);
      return [];
    }

    const tokensData = fs.readFileSync(tokensPath, "utf8");
    return JSON.parse(tokensData);
  } catch (error) {
    console.error("Error loading tokens:", error);
    return [];
  }
};

// Save tokens to JSON file
export const saveTokens = (tokens: UserToken[]): void => {
  try {
    const tokensPath = path.join(__dirname, "db/tokens.json");
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
};

// Load users from JSON file
export const loadUsers = (): User[] => {
  try {
    const usersPath = path.join(__dirname, "db/users.json");

    // Check if file exists
    if (!fs.existsSync(usersPath)) {
      console.error(`Users file not found at: ${usersPath}`);
      return [];
    }

    const usersData = fs.readFileSync(usersPath, "utf8");
    return JSON.parse(usersData);
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};
// Save users to JSON file
export const saveUsers = (users: User[]): void => {
  try {
    const usersPath = path.join(__dirname, "db/users.json");
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};
// Load products from JSON file
export const loadProducts = (): Product[] => {
  try {
    const productsPath = path.join(__dirname, "db/products.json");

    // Check if file exists
    if (!fs.existsSync(productsPath)) {
      console.error(`Products file not found at: ${productsPath}`);
      return [];
    }

    const productsData = fs.readFileSync(productsPath, "utf8");
    return JSON.parse(productsData);
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
};

// Save products to JSON file
export const saveProducts = (products: Product[]): void => {
  try {
    const productsPath = path.join(__dirname, "db/products.json");
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error saving products:", error);
  }
};

// Load orders from JSON file
export const loadOrders = (): Order[] => {
  try {
    const ordersPath = path.join(__dirname, "db/orders.json");

    // Check if file exists
    if (!fs.existsSync(ordersPath)) {
      console.error(`Orders file not found at: ${ordersPath}`);
      return [];
    }

    const ordersData = fs.readFileSync(ordersPath, "utf8");
    return JSON.parse(ordersData);
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
};

// Save orders to JSON file
export const saveOrders = (orders: Order[]): void => {
  try {
    const ordersPath = path.join(__dirname, "db/orders.json");
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error saving orders:", error);
  }
};

// Authentication middleware
const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader =
    (req.headers["authorization"] as string) ||
    (req.headers.authorization as string);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  });
};

// expo push notifications
app.post(
  "/api/push-notification",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { token, title, body, metadata } = req.body;
    if (!Expo.isExpoPushToken(token)) {
      throw new Error("Invalid push token");
    }

    const message = {
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: metadata || {},
    };

    const tickets = await expo.sendPushNotificationsAsync([message]);

    return res.status(200).json(tickets);
  },
);

// save expo token
app.post(
  "/api/save-token",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { token } = req.body;
    const userId = req.user?.id;

    if (!token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: "User authentication required" });
      return;
    }

    // Validate if it's a valid Expo push token
    if (!Expo.isExpoPushToken(token)) {
      res.status(400).json({ error: "Invalid Expo push token" });
      return;
    }

    try {
      const tokens = loadTokens();

      // Check if user already has a token
      const existingTokenIndex = tokens.findIndex((t) => t.userId === userId);

      if (existingTokenIndex !== -1) {
        // Update existing token
        tokens[existingTokenIndex] = {
          userId,
          pushToken: token,
        };
      } else {
        // Create new token entry
        const newToken: UserToken = {
          userId,
          pushToken: token,
        };
        tokens.push(newToken);
      }

      saveTokens(tokens);

      res.status(200).json({
        message: "Push token saved successfully",
        token: token,
      });
    } catch (error) {
      console.error("Error saving push token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Login endpoint
app.post(
  "/api/auth/login",
  (req: Request<{}, {}, LoginRequest>, res: Response): void => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const users = loadUsers();
    const user = users.find(
      (u) => u.email.toLowerCase().trim() === email && u.password === password,
    );
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  },
);

// Register endpoint
app.post(
  "/api/auth/register",
  (req: Request<{}, {}, RegisterRequest>, res: Response): void => {
    const { email, password, name, address } = req.body;

    // Validate input
    if (!email || !password || !name || !address) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }

    const users = loadUsers();

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // Create new user
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      email: email.toLowerCase().trim(),
      password,
      name,
      address,
      role: "user",
    };

    users.push(newUser);
    saveUsers(users);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      SECRET_KEY,
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  },
);

// Get all users (admin only)
app.get(
  "/api/users",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response): void => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const users = loadUsers();

    res.json(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
      })),
    );
  },
);

// Get all products
app.get(
  "/api/products",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response): void => {
    const products = loadProducts();
    res.json(products);
  },
);

// Get product by ID
app.get(
  "/api/products/:id",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response): void => {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    const products = loadProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  },
);

// Create new product (admin only)
app.post(
  "/api/products",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response): void => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const {
      name,
      category,
      pricePerKg,
      pricePerLiter,
      pricePerDozen,
      unit,
      availableQuantity,
      harvestDate,
    } = req.body;

    // Validate required fields
    if (!name || !category || !unit || !availableQuantity || !harvestDate) {
      res.status(400).json({
        error:
          "Name, category, unit, available quantity, and harvest date are required",
      });
      return;
    }

    // Validate unit-specific pricing
    if (unit === "kg" && !pricePerKg) {
      res.status(400).json({ error: "Price per kg is required for kg unit" });
      return;
    }
    if (unit === "liter" && !pricePerLiter) {
      res
        .status(400)
        .json({ error: "Price per liter is required for liter unit" });
      return;
    }
    if (unit === "dozen" && !pricePerDozen) {
      res
        .status(400)
        .json({ error: "Price per dozen is required for dozen unit" });
      return;
    }

    const products = loadProducts();

    // Create new product
    const newProduct: Product = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      name: name.trim(),
      category: category.trim(),
      pricePerKg,
      pricePerLiter,
      pricePerDozen,
      unit,
      availableQuantity: Number(availableQuantity),
      harvestDate,
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
  },
);

// Post order
app.post(
  "/api/order",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { items, totalAmount } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      res.status(401).json({ error: "User authentication required" });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Order items are required" });
      return;
    }

    // Validate order items
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        res.status(400).json({
          error: "Each item must have a valid productId and positive quantity",
        });
        return;
      }
    }

    const products = loadProducts();
    const orders = loadOrders();

    // Validate products exist
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        res.status(404).json({
          error: `Product with ID ${item.productId} not found`,
        });
        return;
      }

      if (product.availableQuantity < item.quantity) {
        res.status(400).json({
          error: `Insufficient quantity for product ${product.name}. Available: ${product.availableQuantity}, Requested: ${item.quantity}`,
        });
        return;
      }
    }

    const newOrder: Order = {
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      userId,
      items,
      totalAmount,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    // Update product quantities
    for (const item of items) {
      const productIndex = products.findIndex((p) => p.id === item.productId);
      if (productIndex !== -1) {
        products[productIndex].availableQuantity -= item.quantity;
      }
    }

    // Save order and update products
    orders.push(newOrder);
    saveOrders(orders);
    saveProducts(products);
    // await sendAdminNotification(newOrder);

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  },
);

console.log("Starting server...");
app.listen(3001, "192.168.1.7", (error?: Error): void => {
  // app.listen(3001, (error?: Error): void => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
  console.log("Mock API server running on http://192.168.1.7:3001");
});
