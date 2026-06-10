const express = require('express')
const sqlite3 = require('sqlite3').verbose()

//Criar o servidor 
const app = express()
app.use(express.json())
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
//Abrir o banco de dados 
const db = new sqlite3.Database('estoque.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message)
    } else {
        console.log('Banco conectado')
    }
})

//Criar tabela de produtos no banco de dados
//A tabela tem id, nome e preço

db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL
)`)

// CRIAÇÃO DAS ROTAS (URLS DA API)

app.get('/', (req, res) => {
    // Rettorna uma resposta em json quando acessa a rota /
    res.sendFile(__dirname + '/pagina.html')
})

// ====================================
// GET TODOS
// ====================================

app.get('/api/produtos', (req, res) => {

    db.all(
        'SELECT * FROM produtos',
        [],
        (err, produtos) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                })
            }

            res.status(200).json(produtos)
        }
    )

})

// ====================================
// GET POR ID
// ====================================

app.get('/api/produtos/:id', (req, res) => {

    const id = req.params.id

    db.get(
        'SELECT * FROM produtos WHERE id = ?',
        [id],
        (err, produto) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                })
            }

            if (!produto) {
                return res.status(404).json({
                    erro: 'Produto não encontrado'
                })
            }

            res.json(produto)
        }
    )

})

// ====================================
// CREATE
// ====================================

app.post('/api/produtos', (req, res) => {

    const { nome, preco } = req.body

    if (!nome) {
        return res.status(400).json({
            erro: 'Nome obrigatório'
        })
    }

    if (preco == null || preco < 0) {
        return res.status(400).json({
            erro: 'Preço inválido'
        })
    }

    db.run(
        'INSERT INTO produtos(nome, preco) VALUES (?, ?)',
        [nome, preco],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                })
            }

            res.status(201).json({
                mensagem: 'Produto cadastrado',
                id: this.lastID
            })
        }
    )

})

// ====================================
// UPDATE
// ====================================

app.put('/api/produtos/:id', (req, res) => {

    const id = req.params.id

    const { nome, preco } = req.body

    if (!nome) {
        return res.status(400).json({
            erro: 'Nome obrigatório'
        })
    }

    if (preco == null || preco < 0) {
        return res.status(400).json({
            erro: 'Preço inválido'
        })
    }

    db.run(
        'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?',
        [nome, preco, id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                })
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: 'Produto não encontrado'
                })
            }

            res.json({
                mensagem: 'Produto atualizado'
            })
        }
    )

})

// ====================================
// DELETE
// ====================================

app.delete('/api/produtos/:id', (req, res) => {

    const id = req.params.id

    db.run(
        'DELETE FROM produtos WHERE id = ?',
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                })
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: 'Produto não encontrado'
                })
            }

            res.json({
                mensagem: 'Produto removido'
            })
        }
    )

})

//ROTAS HTML

app.get('/estoque/produtos', (req, res) => {
    res.sendFile(__dirname + '/views/produtos.html')
})

// ====================================
// SERVIDOR
// ====================================

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})