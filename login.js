
const formulario = document.getElementById('formLogin')

const mensagem = document.getElementById('mensagem')

formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault()

    const usuario =
        document.getElementById('usuario').value

    const senha =
        document.getElementById('senha').value

    const resposta = await fetch('/login', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            usuario,
            senha
        })

    })

    const dados = await resposta.json()

    if (dados.sucesso) {

        mensagem.textContent =
            'Login realizado com sucesso!'

    } else {

        mensagem.textContent =
            'Usuário ou senha inválidos.'

    }

})
