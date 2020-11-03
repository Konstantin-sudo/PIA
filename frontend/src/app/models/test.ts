export class Test {
    name: String;
    details: String;
    date_begins: Date;
    date_ends: Date;
    author: String;
    maxPoints: number;
    duration: {
        minutes: number;
        seconds: number;
    }
    questions: Array<{ type: String, question: String, answers: Array<{ answer: String, isCorrect: boolean }>, points: number }>;
    results: Array<{ answersPerQuestion: Array<{ answers: Array<String>, pointsPerQuestion: number }>, username: string, name: String, surname: String, birth_date: Date, pointsSum: number }>;

    constructor() {
        this.questions = new Array<{ type: String, question: String, answers: Array<{ answer: String, isCorrect: boolean }>, points: number }>();
        this.results = new Array<{ answersPerQuestion: Array<{ answers: Array<String>, pointsPerQuestion: number }>, username: string, name: String, surname: String, birth_date: Date, pointsSum: number }>();
        this.date_begins = new Date()
        this.date_ends = new Date()
        this.duration = {
            minutes: 0,
            seconds: 0
        }
    }
}