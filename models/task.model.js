const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uuid = require('uuid');

const dateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        default: uuid.v4()
    },
})

mongoose.model('task-model', dateSchema)