import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./routes";

// Carrega as variáveis de ambiente definidas no arquivo .env
dotenv.config();

// Inicializa a aplicação Express
const app = express();

// Define a porta utilizada pelo servidor
const PORT = process.env.PORT || 3000;

// Middleware para permitir o envio de dados em formato JSON no corpo das requisições
app.use(express.json());
// Middleware para permitir o envio de dados em formato URL-encoded no corpo das requisições
app.use(express.urlencoded({ extended: true }));

// Middleware para cookies
app.use(cookieParser());

// Middleware para habilitar requisições de diferentes origens (CORS)
app.use(cors({
  origin: "http://vitima.local:3001", // Permite requisições apenas do domínio da vítima
  credentials: true // Permite o envio de cookies entre domínios
}));

// Middleware para servir arquivos estáticos a partir do diretório "public"
app.use(express.static("public"));

// Inicializa o servidor na porta definida
// Edite o arquivo hosts no seu sistema operacional:
// C:\Windows\System32\drivers\etc\hosts
// Adicione as linhas:
// 127.0.0.1   vitima.local
// 127.0.0.1   atacante.local
// Isso permitirá acessar o servidor via http://vitima.local:3001
app.listen(PORT, function () {
  console.log(`Servidor rodando em http://vitima.local:${PORT}`);
});

// ****** ROTA PARA PÁGINA HTML ESTÁTICA ******
app.get("/", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

// Resposta do Exercício 3
app.get("/change-pwd", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "change-pwd.html"));
});

app.use("/", router);

app.use(function (_: Request, res: Response) {
  res.status(404).json({error: "Rota não encontrada"});
});
