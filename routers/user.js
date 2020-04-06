const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')


const router = new express.Router()

router.post('/users', async (req,res) => {
    const user = new User(req.body)
    
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('user-token',token)
        res.render('dashboard',{user})
    }catch(e){
        res.status(400).send()
    }
})
router.get('/users/dashboard', auth ,  async (req,res) => {    
    try{
        if(req.user){
            res.render('dashboard',{user: req.user})
        }else{
            res.redirect('/users/loginPage')
        }
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('user-token',token)
        res.render('dashboard',{user})
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/users/loginPage', (req,res) => {
    try{
        if(!req.cookies['user-token']){
            res.render('login')
          }else{
            res.redirect('/users/dashboard')
        }
    }catch(e){
        res.status(400).send()
    }

})

router.post('/users/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.cookie('user-token','')
        res.redirect('/')
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        
        res.send('Logged out of all Session')
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    try{
        if(req.user){
            if(req.user.avatar){
                res.render('profile',{user: req.user, url: `/users/${req.user._id}/avatar`})
            }else{
                res.render('profile',{user: req.user, url: ''})
            }
        }else{
            res.redirect('/users/loginPage')
        }
    }catch(e){

    }
})

router.post('/users/me', auth, async (req,res) => {
    for(let val in req.body){
        if(!req.body[val]){
            delete req.body[val]
        }
    }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Update Request'})
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.redirect('/users/me')
    } catch (e) {
        res.status(400).send()
    }

})

router.get('/profile/update', auth,  (req,res) => {
    try{
        if(req.user){
            res.render('update-profile',{user: req.user})            
        }else{
            res.redirect('/users/loginPage')
        }
    }catch(e){
        res.status(400).send()
    }
})

//==================Image Upload======================
const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload jpg/jpeg/png file'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'),async (req,res) => {
    try{
        if(req.user){
            const buffer = await sharp(req.file.buffer).resize({width: 150, height: 200}).png().toBuffer()

            req.user.avatar = buffer
        
            await req.user.save() 
            res.redirect('/users/me')
        }else{
            res.redirect('/users/loginPage')
        }
    }catch(e){
        console.log(e)
    }
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.post('/users/me/deleteAvatar', auth, async (req,res) => {
    if(req.user){
        req.user.avatar = undefined
        await req.user.save()
        res.redirect('/users/me')
    }
    else{
        res.redirect('/users/loginPage')
    }
})

//============IMAGE URL route ======================


router.get('/users/:id/avatar', auth, async (req,res) => {
    try{
        if(req.user){
            const user =await User.findById(req.params.id)

            if(!user || !user.avatar){
                throw new Error()
            }
    
            res.set('Content-Type','image/png')
            res.send(user.avatar)
        }
        else{
            res.redirect('/users/loginPage')
        }

    }catch(e){
        res.status(404).send()
    }
})


module.exports = router 
