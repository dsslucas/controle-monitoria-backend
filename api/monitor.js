// Cryptograph the user password
const bcrypt = require('bcrypt-nodejs')
const moment = require('moment')

module.exports = app => {
    // Add user to database
    const createMonitor = async (req, res) => {
        // Calculate the age
        var age = moment().diff(moment(req.body.birthDate, "DD-MM-YYYY"), 'years');

        console.log(req.body)

        // Check if the user who sign in have the same ID
        const respSameId = await app.db('monitor')
            .where({ id: req.body.id })
            .where('id', '=', req.body.id)
            .first()
            .then((response) => {
                if (response === undefined) return false
                if (response !== undefined) return true
            })
            .catch(() => res.status(500).send("Ocorreu um erro em nosso sistema. Tente novamente mais tarde."))

        if (respSameId === true) {
            res.status(400).send("A matrícula informada já está cadastrada no sistema.")
            return
        }

        // Check if the user who sign in have the same email
        const respSameEmail = await app.db('monitor')
            //.where({ id: req.body.id })
            .where('email', '=', req.body.email)
            .first()
            .then((response) => {
                if (response === undefined) return false
                if (response !== undefined) return true
            })
            .catch(() => res.status(500).send("Ocorreu um erro em nosso sistema. Tente novamente mais tarde."))

        if (respSameEmail === true) {
            res.status(400).send("O e-mail informado já está cadastrado no sistema.")
            return
        }

        // Generate the password hash
        const generateHash = (password, callback) => {
            // Gera dez interações, QUE É O PADRÃO
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
            })
        }

        generateHash(req.body.password, password => {
            // Check if the email have @ and .com
            if (req.body.email.includes('@') && req.body.email.includes(".com")) {

                // Check the role
                if (req.body.role === "monitor") {
                    app.db('monitor').insert({
                        id: req.body.id,
                        name: req.body.name,
                        telephone: req.body.telephone,
                        birthDate: req.body.birthDate,
                        age: age,
                        discipline: req.body.discipline,
                        class: req.body.class,
                        course: req.body.course,
                        quotaHolder: req.body.quotaHolder,
                        gender: req.body.gender,
                        email: req.body.email,
                        password: password,
                        role: req.body.role,
                        photo: req.body.photo
                    })
                        .then(() => {
                            if (req.body.gender === "female") res.status(200).send(`Seja bem vinda, ${req.body.name}.`)
                            else res.status(200).send(`Seja bem vindo, ${req.body.name}.`)
                        })
                        .catch(() => res.status(400).send("Dados incompletos. Informe-os corretamente para realizarmos seu cadastro."))
                }
                else res.status(400).send("Ocupação inválida.")
            }
            else {
                res.status(400).send("O e-mail informado não está formatado. Por gentileza, insira este dado informando '@' e '.com'.")
            }
        })
    }

    // Monitor login
    const login = async (req, res) => {
        // Empty field
        if (req.body.email === undefined) return res.status(400).send("O campo de e-mail não foi informado.")
        if (req.body.password === undefined) return res.status(400).send("O campo de senha não foi informado.")

        // Get the user data
        const monitorData = await app.db('monitor').where({ email: req.body.email }).first()

        // Check if user is valid
        if (monitorData) {
            // Compare the password typed by used and the DB' password
            bcrypt.compare(req.body.password, monitorData.password, (error, match) => {
                // Password invalid
                if (error || !match) return res.status(400).send("Senha incorreta.")

                // Password valid. Used logged in!
                if (monitorData.gender === "female") res.status(200).send(`Seja bem vinda, ${monitorData.name}!`)
                else res.status(200).send(`Seja bem vindo, ${monitorData.name}!`)
            })
        }
    }

    // General user consult
    const getMonitor = (req, res) => {
        app.db('monitor')
            .then((response) => res.status(200).json(response))
            .catch((error) => res.status(400).json(error))
    }

    // Specific user data consult
    const getSpecificMonitor = (req, res) => {
        app.db('monitor')
            .where({ id: req.params.id })
            .first()
            .then((response) => res.status(200).json(response))
            .catch(() => res.status(400).send("Usuário não encontrado."))
    }

    // Edit the monitor data
    const editDataMonitor = (req, res) => {
        app.db('monitor')
            .where({ id: req.params.id })
            .update(req.body)
            .then(() => res.status(200).send("Dados atualizados com sucesso!"))
            .catch(() => res.status(400).send("Os dados informados não estão consistentes."))
    }

    const deleteMonitor = (req, res) => {
        app.db('monitor')
            .where({ id: req.params.id })
            .del()
            .then(() => res.status(200).send("Seu usuário foi removido do nosso sistema."))
            .catch(() => res.status(500).send("Não foi possível excluir seu usuário. Tente novamente mais tarde."))
    }

    const postTest = (req, res) => {
        console.log(req.query)
    }

    const getTest = (req, res) => {

    }

    return { createMonitor, getMonitor, editDataMonitor, deleteMonitor, getSpecificMonitor, login, postTest, getTest }
}