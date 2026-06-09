const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("usuarios.db", (err) => {
    if (err) {
        console.log("Erro ao conectar:", err.message);
    } else {
        console.log("Banco conectado!");
    }
});

// Apaga a tabela antiga (se existir)
db.run("DROP TABLE IF EXISTS usuarios", (err) => {
    if (err) {
        console.log(err.message);
        return;
    }

    // Cria a tabela correta
    db.run(`
        CREATE TABLE usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.log(err.message);
            return;
        }

        console.log("Tabela criada!");

        // Usuário padrão
        db.run(
            "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)",
            ["admin", "1234"],
            (err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log("Usuário admin criado!");
                }
            }
        );
    });
});

// Login
app.post("/login", (req, res) => {

    const { usuario, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?",
        [usuario, senha],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro no servidor"
                });
            }

            if (row) {
                return res.json({
                    sucesso: true,
                    mensagem: "Login realizado com sucesso!"
                });
            }

            res.json({
                sucesso: false,
                mensagem: "Usuário ou senha inválidos"
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});