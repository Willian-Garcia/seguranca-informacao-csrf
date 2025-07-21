import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

// Carrega as variáveis de ambiente definidas no arquivo .env
dotenv.config();

// Inicializa a aplicação Express
const app = express();

// Define a porta utilizada pelo servidor
const PORT = process.env.PORT || 3000;

// Inicializa o servidor na porta definida
// Edite o arquivo hosts no seu sistema operacional:
// C:\Windows\System32\drivers\etc\hosts
// Adicione as linhas:
// 127.0.0.1   vitima.local
// 127.0.0.1   atacante.local
// Isso permitirá acessar o servidor via http://vitima.local:3002
app.listen(PORT, function () {
  console.log(`Servidor rodando em http://atacante.local:${PORT}`);
});

// ****** ROTAS PARA PÁGINAS HTML ESTÁTICAS ******
app.get("/csrf-get-attack", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "csrf-get-attack.html"));
});

app.get("/csrf-post-attack", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "csrf-post-attack.html"));
});

app.get("/csrf-post-attack-seguro", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "csrf-post-attack-seguro.html"));
});

app.use(function (_: Request, res: Response) {
  res.status(404).json({error: "Rota não encontrada"});
});
