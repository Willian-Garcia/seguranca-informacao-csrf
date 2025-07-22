import express from "express";
import db from "./db";

export default function createRouter(doubleCsrfProtection: any) {
  const router = express.Router();

  // ✅ Login
  router.post("/login", async (req, res): Promise<void> => {
    const { username, password } = req.body;
    const result = await db.query(
      "SELECT id FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length > 0) {
      res.cookie("user", result.rows[0].id, {
        sameSite: "lax", // permite CSRF clássico
        secure: false,
        httpOnly: false, // apenas para teste (em produção use true)
      });
      res.json({ message: "Login efetuado com sucesso!" });
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  // ✅ GET vulnerável - adicionar contato
  router.get("/contact", async (req, res): Promise<void> => {
    const { name, phone } = req.query;
    const user = req.cookies.user || 1;
    if (!name || !phone) {
      res.status(400).json({ error: "Nome e telefone são necessários" });
      return;
    }

    await db.query(
      "INSERT INTO contacts(user_id, name, phone) VALUES($1,$2,$3)",
      [user, name, phone]
    );
    res.json({ message: "Contato registrado com sucesso" });
  });

  // ✅ POST vulnerável - alterar senha
  router.post("/change-password", async (req, res): Promise<void> => {
    const { password } = req.body;
    const user = req.cookies.user || 1; // Mocka usuário para testes

    if (!password) {
      res.status(400).json({ error: "Senha não fornecida" });
      return;
    }

    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      password,
      user,
    ]);
    res.json({ message: "Senha alterada com sucesso (rota insegura)" });
  });

  // ✅ POST protegido com CSRF
  router.post(
    "/change-password-segura",
    doubleCsrfProtection,
    async (req, res): Promise<void> => {
      const { password } = req.body;
      const user = req.cookies.user || 1; // Mocka usuário para testes

      if (!password) {
        res.status(400).json({ error: "Senha não fornecida" });
        return;
      }

      await db.query("UPDATE users SET password = $1 WHERE id = $2", [
        password,
        user,
      ]);
      res.json({ message: "Senha alterada com segurança (rota protegida)" });
    }
  );

  return router;
}
