import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { doubleCsrf } from "csrf-csrf";
import routerFactory from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS para frontend legítimo
const allowedOrigins = ["http://vitima.local:3001", "http://atacante.local:3002"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Middleware para processar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Necessário para POST via <form>

// ✅ Cookies
app.use(cookieParser());

// ✅ CSRF Configuração
const csrfTools = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "supersecretkey",
  getSessionIdentifier: (req) => req.cookies.user || "anon",
  cookieName: "XSRF-TOKEN",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: false
  },
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"] as string
});

const doubleCsrfProtection = csrfTools.doubleCsrfProtection;
const generateToken = (req: Request, res: Response) => csrfTools.generateCsrfToken(req, res);

// ✅ Endpoint para token CSRF
app.get("/api/csrf-token", (req: Request, res: Response) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

// ✅ Servir páginas HTML
app.use(express.static("public"));

app.get("/", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

app.get("/pages/home", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "home.html"));
});

app.get("/pages/contact", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "contact.html"));
});

app.get("/pages/change-password", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "change-password.html"));
});

// ✅ Rotas da API
app.use("/api", routerFactory(doubleCsrfProtection));

app.use((_: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor vítima rodando em http://vitima.local:${PORT}`);
});
