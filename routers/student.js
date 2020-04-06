const express = require('express')
const Student = require('../models/student')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Class = require('../models/class')

const router = new express.Router()


router.get('/getStudents', auth, (req,res) => {
        res.render('student')
}) 

router.post('/student', auth, async (req,res) => {
    const standard = await Class.findOne({name: req.body.class})
    const student = new Student({
        name: req.body.name,
        class: standard._id
    })
    try{
        await student.save()
        res.redirect('/getStudents')
    }catch(e){
        res.status(400).send()
    }
})

router.get('/attendance', auth, async (req,res) => {
    res.render('attendance')
})

router.post('/attendance', auth, async (req,res) => {
    const standard = await Class.findOne({name: req.query.class})
    await standard.populate('students').execPopulate()
    if(standard.students[0].attendance.find(el => el.day.getDate() === new Date(req.body.date).getDate() && 
                                        el.day.getMonth() === new Date(req.body.date).getMonth() &&
                                        el.day.getFullYear() === new Date(req.body.date).getFullYear())){
                                            return 
                                        }
    else{
        for( let i = 0; i< standard.students.length; i++){
            const student = await Student.findById({_id: standard.students[i]._id})
            student.attendance = student.attendance.concat({present: Boolean(req.body.attendance[i]), day: new Date(req.body.date)})
            await student.save()
        }
        res.send(standard.students)
    }
})

router.post('/checkDate',async (req,res) => {
    const standard = await Class.findOne({name: req.body.class})
    await standard.populate('students').execPopulate()
    if(standard.students[0].attendance.find(el => el.day.getDate() === new Date(req.body.date).getDate() && 
                                                el.day.getMonth() === new Date(req.body.date).getMonth() &&
                                                el.day.getFullYear() === new Date(req.body.date).getFullYear())){
                                                    res.send({msg: 'Attendance already taken for this date'}) 
                                                }
    else{
        res.send({msg: ''})
    }
})

router.get('/allStudent', auth, async (req,res) => {
    const standard = await Class.findOne({name: req.query.class})
    await standard.populate('students').execPopulate()
    res.send(standard.students)
})

router.post('/viewAttendance', auth, async (req,res) => {
    const standard = await Class.findOne({name: req.body.class})
    await standard.populate('students').execPopulate()
    const attendanceArray = []
    let obj = {}
    standard.students.forEach(el => {
        obj.name = el.name
    let attendance = el.attendance.find(el =>   el.day.getDate() === new Date(req.body.date).getDate() && 
                                                el.day.getMonth() === new Date(req.body.date).getMonth() &&
                                                el.day.getFullYear() === new Date(req.body.date).getFullYear())
        
        obj.present = attendance.present

        attendanceArray.push(obj)
        obj = {}
    })
    res.send(attendanceArray)
})

router.get('/viewAttendance', auth, async (req,res) => {
    res.render('viewAttendance')
})


module.exports = router