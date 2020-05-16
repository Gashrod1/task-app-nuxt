const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const TaskSchema = mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        site: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            required: true,
            enum: ['Lowest', 'Low', 'Medium', 'High', 'Highest']
        },
        type: {
            type: String,
            required: true,
            enum: ['Task', 'Bug', 'Story', 'Epic', 'Theme']
        },
        points: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        assignee: {
            type: ObjectId,
            ref: 'User'
        },
        reporter: {
            type: ObjectId,
            ref: 'User'
        },
        comment: {
            type: String
        },
        dateAdded: {
            type: mongoose.Schema.Types.Date,
            default: Date.now
        },
        dateCompleted: { type: mongoose.Schema.Types.Date, default: null },
        // user: [{ type: ObjectId, ref: 'User' }],
        // board: [{ type: ObjectId, ref: 'Board' }],
        column: [{ type: ObjectId, ref: 'Column' }]
    },
    {
        timestamps: true
    }
)

module.exports =
    mongoose.models.Task || mongoose.model('task', TaskSchema, 'tasks')
