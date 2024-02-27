module.exports = app => {
    // User
    app.route('/login')
        .post(app.api.user.login)

    // app.route('/user/signup')
    //     .post(app.api.user.createUser)

    app.route('/signup')
        .post(app.api.user.createUser)

    app.route('/user/student')
        .get(app.api.user.getStudentList)

    app.route('/user/monitor')
        .get(app.api.user.getMonitorList)

    app.route('/user/schedule')
        .post(app.api.schedule.userAddSchedule)

    app.route('/user/:id')
        .get(app.api.user.getSpecificUser)
        .put(app.api.user.editDataUser)
        .delete(app.api.user.deleteUser)

    // Filter the monitors by preferences
    app.route('/user/find/:id')
        .get(app.api.user.getMonitorsByFilter)

    app.route('/user/schedule/:id')
        .delete(app.api.schedule.removeSchedule)



    // Monitor
    // app.route('/monitor')
    //     .get(app.api.monitor.getMonitor)

    // app.route('/monitor/login')
    //     .post(app.api.monitor.login)

    // app.route('/monitor/signup')
    //     .post(app.api.monitor.createMonitor)

    // Schedule

    app.route('/schedule')
        .get(app.api.schedule.getScheduleList)

    app.route('/monitor/schedule')
        .post(app.api.schedule.monitorPostAvailable)
        .get(app.api.schedule.monitorGetSchedule)

    app.route('/monitor/schedule/:id')
        .post(app.api.schedule.monitorPostReport)
        .get(app.api.schedule.monitorGetIndividualSchedule)

    app.route('/monitor/:id')
        .get(app.api.monitor.getSpecificMonitor)
        .put(app.api.monitor.editDataMonitor)
        .delete(app.api.monitor.deleteMonitor)

    app.route('/test')
        .post(app.api.monitor.postTest)
        .get(app.api.monitor.getTest)
}