const mongoose = require('mongoose')


const classSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

classSchema.virtual('students', {
    ref: 'Student',
    localField:'_id',
    foreignField: 'class'
})

const Class = mongoose.model('Class',classSchema)

module.exports = Class