import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Question = new Schema({
    questionText:{
        type: String
    }
});

export default mongoose.model('Question', Question);