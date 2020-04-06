const express = require('express')
const Student = require('../models/student')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Class = require('../models/class')

const router = new express.Router()


router.post('/class', auth, async (req,res) => {
    const standard = new Class({
        name: req.body.name,
        teacher: req.user._id
    })
    try{
        await standard.save()
        res.redirect('/dashboard')
    }catch(e){
        res.status(400).send()
    }
})

router.get('/dashboard', auth, async (req,res) => {
    res.render('dashboard', {user: req.user})
})

router.get('/allClass', auth, async (req,res) => {
    const user = await User.findById(req.user._id)
    await user.populate('classes').execPopulate()
    res.send(user.classes)
})


module.exports = router