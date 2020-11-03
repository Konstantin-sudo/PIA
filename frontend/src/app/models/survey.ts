export class Survey {
    name: String;
    date_begins: Date;
    date_ends: Date;
    details: String;
    author: String;
    type: String;
    pageViewCnt: number;
    questions: Array<{ type: { name: String, number: Number }, question: string, answers: Array<string>, isRequired: boolean; }>;
    results: Array<{ answers: Array<Array<string>>, name: string, surname: string, birth_date: Date }>;

    constructor() {
        this.questions = new Array<{ type: { name: String, number: Number }, question: string, answers: Array<string>, isRequired: boolean; }>();
        this.results = new Array<{ answers: Array<Array<string>>, name: string, surname: string, birth_date: Date }>();
        this.date_begins = new Date();
        this.date_ends = new Date();
    }
}
