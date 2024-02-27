// Cryptograph the user password
const bcrypt = require('bcrypt-nodejs')
const moment = require('moment')

module.exports = app => {
    // Add user to database
    const createUser = async (req, res) => {
        // Calculate the age
        var age = moment().diff(req.body.birthDate, 'years');

        // Check if the user who sign in have the same ID
        const respSameId = await app.db('user')
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
        const respSameEmail = await app.db('user')
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

                if (req.body.role === "Aluno" || req.body.role === "Monitor") {
                    app.db('user').insert({
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
                            if (req.body.gender === "Feminino") res.status(200).send(`Seja bem vinda, ${req.body.name}.`)
                            else res.status(200).send(`Seja bem vindo, ${req.body.name}.`)
                        })
                        .catch(() => res.status(400).send("Dados incompletos. Informe-os corretamente para realizarmos seu cadastro."))
                        //.catch(error => console.error(error))
                }
                else res.status(400).send("Ocupação inválida.")
            }
            else {
                res.status(400).send("O e-mail informado não está formatado. Por gentileza, insira este dado informando '@' e '.com'.")
            }
        })
    }

    // User login
    const login = async (req, res) => {
        // Empty field
        if (req.body.email === undefined) return res.status(400).send("O campo de e-mail não foi informado.")
        if (req.body.password === undefined) return res.status(400).send("O campo de senha não foi informado.")

        // Get the user data
        const userData = await app.db('user').where({ email: req.body.email }).first()

        // Check if e-mail is valid
        if (userData === undefined) {
            res.status(404).send("O e-mail informado não está em nossa base de dados.")
            return
        }

        // Check if user is valid
        if (userData) {
            // Compare the password typed by used and the DB' password
            bcrypt.compare(req.body.password, userData.password, (error, match) => {
                // Password invalid
                if (error || !match) return res.status(400).send("Senha incorreta.")

                // Password valid. Used logged in!
                if (userData.gender === "Feminino") res.status(200).send({
                    id: userData.id,
                    name: userData.name,
                    role: userData.role,
                    course: userData.course,
                    discipline: userData.discipline,
                    class: userData.class,
                    email: userData.email,
                    photo: userData.photo,
                    message: `Seja bem vinda, ${userData.name}!`
                })
                else res.status(200).send({
                    id: userData.id,
                    name: userData.name,
                    role: userData.role,
                    course: userData.course,
                    discipline: userData.discipline,
                    class: userData.class,
                    email: userData.email,
                    photo: userData.photo,
                    message: `Seja bem vindo, ${userData.name}!`
                })
            })
        }
    }

    // General user consult
    const getStudentList = (req, res) => {
        app.db('user')
            .where({role: 'Aluno'})
            .then((response) => res.status(200).json(response))
            .catch((error) => res.status(400).json(error))
    }

    const getMonitorList = (req, res) => {
        app.db('user')
            .where({role: 'Monitor'})
            .then((response) => res.status(200).json(response))
            .catch((error) => res.status(400).json(error))
    }

    // Specific user data consult
    const getSpecificUser = (req, res) => {
        app.db('user')
            .where({ id: req.params.id })
            .first()
            .then((response) => res.status(200).json(response))
            .catch(() => res.status(400).send("Usuário não encontrado."))
    }

    // Edit the user data
    const editDataUser = (req, res) => {
        //if (req.body.email.includes('@') && req.body.email.includes(".com")) {

        //console.log(req.body)
        app.db('user')
            .where({ id: req.params.id })
            .update(req.body)
            .then(() => res.status(200).send("Dados atualizados com sucesso!"))
            .catch(() => res.status(400).send("Os dados informados não estão consistentes."))
            //.catch((error) => console.log(error))
        //}
        // else {
        //     res.status(200).send("O preenchimento dos dados está incorreto.")
        // }        
    }

    const deleteUser = (req, res) => {
        app.db('user')
            .where({ id: req.params.id })
            .del()
            .then(() => res.status(200).send("Seu usuário foi removido do nosso sistema."))
            .catch(() => res.status(500).send("Não foi possível excluir seu usuário. Tente novamente mais tarde."))
    }

    // Get monitors by filter. Ver com a Bia
    const getMonitorsByFilter = async (req, res) => {
        // Catch the user preferences
        const userData = await app.db('user')
            .where({ id: req.params.id })
            .first()

        // Consult the monitors with corresponds to the user preferences
        await app.db('monitor')
            .where('course', '=', userData.course)
            .where('quotaHolder', '=', userData.quotaHolder)
            .where('gender', '=', userData.gender)
            .then((response) => res.status(200).json(response))
            .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
    }

    return { createUser, getStudentList, getMonitorList, editDataUser, deleteUser, getSpecificUser, login, getMonitorsByFilter }
}