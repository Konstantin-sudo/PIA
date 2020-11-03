export class User {
  name: string;
  surname: string;
  username: string;
  password: string;
  birth_date: Date;
  birth_place: string;
  id: string;
  phone: string;
  mail: string;
  type: string;
  picture: File;
  finishedSurveys: Array<{ name: string, answers: Array<Array<string>> }>;
  savedSurveys: Array<{ name: string, answers: Array<Array<string>> }>;
  finishedTests: Array<{ name: string, answers: Array<Array<string>>, points: number }>;

  constructor() {
    this.finishedSurveys = new Array<{ name: string, answers: Array<Array<string>> }>();
    this.savedSurveys = new Array<{ name: string, answers: Array<Array<string>> }>();
    this.finishedTests = new Array<{ name: string, answers: Array<Array<string>>, points: number }>();
    this.birth_date = new Date();
  }
}
