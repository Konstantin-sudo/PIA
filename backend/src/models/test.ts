import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Test = new Schema({
    name: {
        type: String
    },
    details: {
        type: String
    },
    date_begins: {
        type: Date
    },
    date_ends: {
        type: Date
    },
    author: {
        type: String
    },
    maxPoints: {
        type: Number
    },
    duration: {
        type: {
            minutes: Number,
            seconds: Number
        },
    },
    questions: {
        type: Array<{ type: String, question: String, answers: Array<{ answer: String, isCorrect: Boolean }>, points: Number }>()
    },
    results: {
        type: Array<{ answersPerQuestion: Array<{ answers: Array<String>, pointsPerQuestion: Number }>, username: String, name: String, surname: String, birth_date: Date, pointsSum: Number }>()
    }
}

);

export default mongoose.model('Test', Test);