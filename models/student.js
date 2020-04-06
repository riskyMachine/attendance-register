const mongoose = require('mongoose')


const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    class:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    attendance:[{
        present:{
            type: Boolean,
            required: true
        },
        day:{
            type: Date,
            required: true
        }
    }]
})

const Student = mongoose.model('Student',studentSchema)

module.exports = Student