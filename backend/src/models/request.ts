import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Request = new Schema({
    name:{
        type: String
    },
    surname:{
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    birth_date: {
        type: Date
    },
    birth_place: {
        type: String
    },
    id: {
        type: String
    },
    phone: {
        type: String
    },
    mail: {
        type: String
    },
    type: {
        type: String
    },
    picture:{
        type:String
    },
    finishedSurveys:{
        type: Array<String>()
    }
    
});

export default mongoose.model('Request', Request);