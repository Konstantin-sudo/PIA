import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Survey = new Schema({
    name: {
        type: String
    },
    date_begins: {
        type: Date
    },
    date_ends: {
        type: Date
    },
    questions: {
        type: Array<{ type: { name: String, number: Number }, question: string, answers: Array<string>, isRequired: Boolean }>()
    },
    results: {
        type: Array<{ answers: Array<Array<string>>, name: string, surname: string, birth_date: Date }>()
    },
    author: {
        type: String
    },
    details: {
        type: String
    },
    type: {
        type: String
    },
    pageViewCnt: {
        type: Number
    }

});

export default mongoose.model('Survey', Survey);