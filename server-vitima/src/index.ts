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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://vitima.local:3001",
  credentials: true
}));

// ✅ Configuração do CSRF com todos os campos obrigatórios
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

// Endpoint para fornecer token CSRF ao frontend legítimo
app.get("/csrf-token", (req: Request, res: Response) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

// Servir páginas
app.use(express.static("public"));

app.get("/", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

app.get("/home", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "home.html"));
});

app.get("/contact", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "contact.html"));
});

app.get("/change-password", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "change-password.html"));
});

app.use("/", routerFactory(doubleCsrfProtection));

app.use((_: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor vítima rodando em http://vitima.local:${PORT}`);
});
