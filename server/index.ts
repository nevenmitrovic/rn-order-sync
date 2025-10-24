import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import fs from "fs";
import path from "path";

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  address: string;
  role: "admin" | "user";
}
interface Product {
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

interface OrderItem {
  productId: number;
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  orderDate: string;
}

interface OrderRequest {
  items: OrderItem[];
  totalAmount: number;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
interface LoginRequest {
  email: string;
  password: string;
}
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  address: string;
}

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY: string = "your-secret-key";

// Load users from JSON file
const loadUsers = (): User[] => {
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
const saveUsers = (users: User[]): void => {
  try {
    const usersPath = path.join(__dirname, "db/users.json");
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};
// Load products from JSON file
const loadProducts = (): Product[] => {
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
const saveProducts = (products: Product[]): void => {
  try {
    const productsPath = path.join(__dirname, "db/products.json");
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error saving products:", error);
  }
};

// Load orders from JSON file
const loadOrders = (): Order[] => {
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
const saveOrders = (orders: Order[]): void => {
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
  const authHeader = req.headers["authorization"];
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
  (req: Request<{}, {}, OrderRequest>, res: Response): void => {
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

    // Create new order
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

    // Save order and updated products
    orders.push(newOrder);
    saveOrders(orders);
    saveProducts(products);

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  },
);

console.log("Starting server...");
app.listen(3001, (error?: Error): void => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
  console.log("Mock API server running on http://localhost:3001");
});
