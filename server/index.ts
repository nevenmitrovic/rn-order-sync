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
    const usersPath = path.join(__dirname, "../db/users.json");
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
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
      (u) => u.email === email && u.password === password,
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
      email,
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

console.log("Starting server...");
app.listen(3001, (error?: Error): void => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
  console.log("Mock API server running on http://localhost:3001");
});
