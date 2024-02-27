module.exports = app => {
    const userAddSchedule = async (req, res) => {
        // Database consult for check if the user has registered on system.
        const checkUserId = await app.db('user').where({ id: req.body.idStudent }).first()

        // If not have register of user on database, the register will be aborted.
        if (checkUserId === undefined) {
            res.status(404).send("O ID do usuário não foi encontrado em nossa base de dados.")
            return
        }

        // Check if the student have scheduled with some monitor
        const checkStudentId = await app.db('schedule').where({ idStudent: req.body.idStudent }).first()

        // If the student has registered the schedule, he/she can't schedule again. With this, the register will be aborted.
        if (checkStudentId) {
            res.status(404).send("Por existir um limite para um agendamento por estudante, não foi possível agendar um horário com este monitor.")
            return
        }

        // First step: check if monitor have free time
        const monitorFreeTime = await app.db('schedule_monitor')
            .where({ idMonitor: req.body.idMonitor })
            .where('day', '=', req.body.scheduled.day)
            .where('hour', '=', req.body.scheduled.hour)
            .first()

        if(monitorFreeTime === undefined){
            res.status(404).send("O monitor está ocupado no dia e horário solicitado. Por gentileza, faça o agendamento em outro momento.")
            return
        }

        // Second step: register the schedule
        const scheduleData = await app.db('schedule')
            .insert({
                idStudent: req.body.idStudent,
                idMonitor: req.body.idMonitor,
                local: req.body.local,
                additionalInfo: req.body.additionalInfo
            })
            .returning('id')

        // Third step: register the day and hour
        await app.db('schedule_timestamp')
            .insert({
                idSchedule: scheduleData[0].id,
                day: req.body.scheduled.day,
                hour: req.body.scheduled.hour
            })
        // .then(() => res.status(200).send(`Agendamento de monitoria registrado!`))
        // .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))

        // Fourth step: remove the avaliable day and time of monitor
        await app.db('schedule_monitor')
            .where({ idMonitor: req.body.idMonitor })
            .where('day', '=', req.body.scheduled.day)
            .where('hour', '=', req.body.scheduled.hour)
            .del()
            .then(() => res.status(200).send("Agendamento realizado!"))
            .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
    }

    const getScheduleList = async (req, res) => {
        // Catch ONLY the ID of each schedule
        const scheduleData = await app.db('schedule')
            .returning('id')

        // If valid
        if (scheduleData) {
            const result = await Promise.all(scheduleData.map(async (data, index) => {
                // Consult the data about day and hour from the second schedule table and includes on the main Schedule table.
                const scheduleDetails = await app.db('schedule_timestamp').where({ idSchedule: data.id }).first()

                // Schedule report
                const scheduleReport = await app.db('schedule_report').where({idSchedule: data.id})

                //console.log(scheduleReport)

                if (scheduleDetails === undefined) return {}
                else {
                    return ({
                        ...data,
                        scheduled: {
                            day: scheduleDetails.day,
                            hour: scheduleDetails.hour
                        },
                        report: scheduleReport                        
                    })                    
                }
            }))
            res.status(200).json(result)
        }
        else res.status(500).send("Ainda não há agendamentos registrados.")
    }

    const removeSchedule = async (req, res) => {
        await app.db('schedule_timestamp')
            .where({ idSchedule: req.params.id })
            .del()

        await app.db('schedule')
            .where({ id: req.params.id })
            .del()
            .then(() => res.status(200).send("Agendamento removido."))
            .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
    }

    // For monitor
    const monitorPostAvailable = async (req, res) => {
        //console.log(req.body.available)
        //res.status(200).json(req.body)

        //const schedule = req.body.available

        //console.log(schedule.length)

        // For avoid double time "available" at same day and hour.
        const checkMonitorAvailable = await app.db('schedule_monitor')
            .where({ idMonitor: req.body.id })
            .where('day', '=', req.body.day)
            .where('hour', '=', req.body.hour)
            .first()

        // If was true, the schedule will be deleted.
        if (checkMonitorAvailable !== undefined) {
            app.db('schedule_monitor')
                .where({ idMonitor: req.body.id })
                .where('day', '=', req.body.day)
                .where('hour', '=', req.body.hour)
                .del()
                .then(() => res.status(200).send("O dia e horário selecionado voltou a ser indisponível."))
                .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
            return
        }

        app.db('schedule_monitor')
            .insert({
                idMonitor: req.body.id,
                day: req.body.day,
                hour: req.body.hour
            })
            .then(() => res.status(200).send("Dia e horário marcados."))
            .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
    }

    const monitorGetSchedule = (req, res) => {
        app.db('schedule_monitor')
            .then((response) => res.status(200).json(response))
            .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
    }

    const monitorGetIndividualSchedule = (req, res) => {
        app.db('schedule_monitor')
            .where({ idMonitor: req.params.id })
            .then((response) => res.status(200).json(response))
            .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
    }

    // Register a report in the schedule
    const monitorPostReport = (req, res) => {
        app.db('schedule_report')
            .insert({
                idMonitor: req.params.id,
                idStudent: req.body.idStudent,
                idSchedule: req.body.idSchedule,
                timestamp: new Date(),
                description: req.body.description
            })
            .then(() => res.status(200).send("Registro realizado."))
            .catch(() => res.status(500).send("Ocorreu um problema em nossos servidores e não obtivemos os dados. Tente novamente mais tarde."))
    }

    return { userAddSchedule, getScheduleList, removeSchedule, monitorPostAvailable, monitorGetSchedule, monitorGetIndividualSchedule, monitorPostReport }
}