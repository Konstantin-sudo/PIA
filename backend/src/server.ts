import express, { json } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { Collection } from 'mongoose';
import request from 'request'
//import multer from 'multer';

const app = express();

app.listen(4000, () => console.log(`Express server running on port 4000`));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/pia_projekat_baza');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('mongo open');
})

const router = express.Router();
//multer~~~~~~~~~~~~~~
// Multer File upload settings

/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './pictures/');
    },
    filename: (req, file, cb) => {
        const fileName = new Date().toISOString() + file.originalname
        cb(null, fileName)
    }
});
// Multer Mime Type Validation
var upload = multer({
    storage: storage,
    limits: {
       fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('image error'));
        }
    }
})*/


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import User from './models/user';
import Request from './models/request';
import Survey from './models/survey';
import Test from './models/test';
import Question from './models/question';

//USER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


router.route('/register').post(/*upload.single('myfile'),*/ (req, res) => {
   // console.log("req.file")
    //console.log(req.file)
    
    if (req.body.recaptcha == undefined || req.body.recaptcha == null || req.body.recaptcha == "") {
        return res.json({ 'request': 'recaptcha empty' })
    }

    const secretKey = "6Lc2jtYUAAAAANi_aREwWNks6WHPDHwkMBXrDZ3e";

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.recaptcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return res.json({ 'request': 'recaptcha failed' })
        }
        let username = req.body.user.username;
        User.find({ 'username': username }, (err, user_doc) => {
            if (err)
                console.log(err);
            else {
                if (user_doc[0])
                    res.json({ 'request': 'not available' });
                else {
                    User.count({ 'mail': req.body.user.mail }, (err, usercount) => {
                        if (err) console.log(err);
                        else {
                            if (usercount >= 2) res.json({ 'request': 'too many' });
                            else {
                                Request.find({ 'username': username }, (err, request_doc) => {
                                    if (err) console.log(err);
                                    else {
                                        if (request_doc[0]) res.json({ 'request': 'not available' });
                                        else {
                                            Request.count({ 'mail': req.body.user.mail }, (err, reqcount) => {
                                                if (err) console.log(err);
                                                else {
                                                    if (reqcount >= 2) res.json({ 'request': 'too many' });
                                                    else {
                                                        let request = new Request(req.body.user);
                                                        request.save().then(request => {
                                                            res.status(200).json({ 'request': 'ok' });
                                                        }).catch(err => {
                                                            res.status(400).json({ 'request': 'not ok' });
                                                        });
                                                    }
                                                }
                                            })

                                        }
                                    }
                                });
                            }
                        }
                    })
                }
            }
        });
    })
});

router.route('/login').post((req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.find({ 'username': username, 'password': password },
        (err, user) => {
            if (err) console.log(err);
            else res.json(user);
        })
});

router.route('/changepass').post((req, res) => {
    User.findOneAndUpdate({ username: req.body.username, password: req.body.oldpass }, { password: req.body.newpass }, (err, result) => {
        if (err) console.log(err);
        else {
            //console.log('change pass: ')
            //console.log(result);
            if (result) {
                res.json({ 'msg': 'ok' });
            }
            else {
                res.json({ 'msg': 'not ok' });
            }
        }
    })
})
router.route('/user/get').post((req, res) => {
    User.find({ username: req.body.username }, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})

//ADMIN ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.route('/admin/getUsers').post((req, res) => {
    User.find({ username: { $ne: req.body.username } }, (err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    })
})
router.route('/admin/getRequests').get((req, res) => {
    Request.find((err, requests) => {
        if (err) console.log(err);
        else res.json(requests);
    })
})
router.route('/admin/deleteUser').post((req, res) => {
    let username = req.body.username;
    User.findOneAndDelete({ 'username': username }, err => {
        if (err) console.log(err);
    })
})
router.route('/admin/denyRequest').post((req, res) => {
    let username = req.body.username;
    Request.findOneAndDelete({ 'username': username }, err => {
        if (err) console.log(err);
    })
})
router.route('/admin/approveRequest').post((req, res) => {
    let username = req.body.username;
    Request.find({ 'username': username }, { _id: 0, name: 1, surname: 1, username: 1, password: 1, birth_date: 1, birth_place: 1, id: 1, phone: 1, mail: 1, type: 1 }, (err, result) => {
        if (err) console.log(err);
        else {
            Request.findOneAndDelete({ 'username': username }, err => {
                if (err) console.log(err);
            });
            let user = new User(result[0]);
            const Collection = mongoose.Collection
            let c = new Collection("users", connection);
            c.save(user).then(msg => {
                res.status(200).json({ 'msg': 'ok' });
            }).catch(err => {
                res.status(400).json({ 'msg': 'not ok' });
            });
            console.log('zavrsio upis novog usera')

        }
    })
})
router.route('/admin/addNewUser').post((req, res) => {
    let username = req.body.user.username;
    User.find({ 'username': username }, (err, user_doc) => {
        if (err)
            console.log(err);
        else {
            if (user_doc[0])
                res.json({ 'msg': 'not available' });
            else {
                User.count({ 'mail': req.body.user.mail }, (err, usercount) => {
                    if (err) console.log(err);
                    else {
                        if (usercount >= 2) res.json({ 'msg': 'too many' });
                        else {
                            Request.find({ 'username': username }, (err, request_doc) => {
                                if (err) console.log(err);
                                else {
                                    if (request_doc[0]) res.json({ 'msg': 'not available' });
                                    else {
                                        Request.count({ 'mail': req.body.user.mail }, (err, reqcount) => {
                                            if (err) console.log(err);
                                            else {
                                                if (reqcount >= 2) res.json({ 'msg': 'too many' });
                                                else {
                                                    let user = new User(req.body.user);
                                                    user.save().then(result => {
                                                        res.status(200).json({ 'msg': 'ok', '_id': result._id });
                                                    }).catch(err => {
                                                        res.status(400).json({ 'msg': 'not ok' });
                                                    });
                                                }
                                            }
                                        })
                                    }
                                }
                            });
                        }
                    }
                })
            }
        }
    });
})
router.route('/admin/updateUser').post((req, res) => {
    let username = req.body.username;
    User.find({ 'username': username, _id: { $ne: req.body._id } }, (err, user_doc) => {
        if (err)
            console.log(err);
        else {
            if (user_doc[0])
                res.json({ 'msg': 'not available' });
            else {
                User.count({ 'mail': req.body.mail, _id: { $ne: req.body._id } }, (err, usercount) => {
                    if (err) console.log(err);
                    else {
                        if (usercount >= 2) res.json({ 'msg': 'too many' });
                        else {
                            Request.find({ 'username': username, _id: { $ne: req.body._id } }, (err, request_doc) => {
                                if (err) console.log(err);
                                else {
                                    if (request_doc[0]) res.json({ 'msg': 'not available' });
                                    else {
                                        Request.count({ 'mail': req.body.mail, _id: { $ne: req.body._id } }, (err, reqcount) => {
                                            if (err) console.log(err);
                                            else {
                                                if (reqcount >= 2) res.json({ 'msg': 'too many' });
                                                else {
                                                    let update = {
                                                        'name': req.body.name,
                                                        'surname': req.body.surname,
                                                        'username': req.body.username,
                                                        'password': req.body.password,
                                                        'birth_date': req.body.birth_date,
                                                        'birth_place': req.body.birth_place,
                                                        'id': req.body.id,
                                                        'phone': req.body.phone,
                                                        'mail': req.body.mail,
                                                        'type': req.body.type
                                                    };
                                                    User.findByIdAndUpdate(req.body._id, update, (err, result) => {
                                                        if (err) {
                                                            console.log(err);
                                                            res.json({ 'msg': 'not ok' });
                                                        }
                                                        else
                                                            res.json({ 'msg': 'ok' });
                                                    });
                                                }
                                            }
                                        })
                                    }
                                }
                            });
                        }
                    }
                })
            }
        }
    });
})

//AUTHENTICATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



//CLIENT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.route('/client/get/surveys').get((req, res) => {
    Survey.find().then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
    })
})
router.route('/client/get/survey').post((req, res) => {
    Survey.find({ name: req.body.name }, (err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    })
})
router.route('/client/surveys/end').post((req, res) => {
    Survey.findOneAndUpdate({ _id: req.body.survey._id }, req.body.survey, (err, doc) => {
        if (err) console.log(err);
        if (doc) res.json({ 'msg': 'ok' });
        else res.json({ 'msg': 'not ok' });
    })
})
router.route('/client/surveys/save').post((req, res) => {
    Survey.findOneAndUpdate({ _id: req.body.survey._id }, req.body.survey, (err, doc) => {
        if (err) console.log(err);
        if (doc) res.json({ 'msg': 'ok' });
        else res.json({ 'msg': 'not ok' });
    })
})
router.route('/client/surveys/get/user').post((req, res) => {
    User.find({ username: req.body.username }, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
router.route('/client/surveys/set/user/update').post((req, res) => {
    User.findOneAndUpdate({ _id: req.body.user._id }, req.body.user, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
//~~~~~~~~~~~~~~~~~
router.route('/client/get/tests').get((req, res) => {
    Test.find((err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    })
})
router.route('/client/get/test').post((req, res) => {
    Test.find({ name: req.body.name }, (err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    })
})
router.route('/client/tests/end').post((req, res) => {
    Test.findOneAndUpdate({ name: req.body.test.name }, req.body.test, (err, doc) => {
        if (err) console.log(err);
        if (doc) res.json({ 'msg': 'ok' });
        else res.json({ 'msg': 'not ok' });
    })
})
//AUTHOR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.route('/author/get/surveys').get((req, res) => {
    Survey.find().then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
    })
})
router.route('/author/get/survey').post((req, res) => {
    Survey.find({ name: req.body.name }, (err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    })
})
router.route('/author/surveys/end').post((req, res) => {
    Survey.findOneAndUpdate({ _id: req.body.survey._id }, req.body.survey, (err, doc) => {
        if (err) console.log(err);
        if (doc) res.json({ 'msg': 'ok' });
        else res.json({ 'msg': 'not ok' });
    })
})
router.route('/author/surveys/save/new').post((req, res) => {
    Survey.findOne({ name: req.body.survey.name }, (err, doc) => {
        if (err) console.log(err);
        if (doc) res.json({ 'msg': 'not ok' });
        else {
            let newSurvey = new Survey(req.body.survey);
            newSurvey.save().then(doc => {
                res.json({ 'msg': 'ok' })
            }).catch(err => {
                res.json({ 'msg': 'not ok' });
            })
        }
    })
})
router.route('/author/surveys/get/user').post((req, res) => {
    User.find({ username: req.body.username }, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
router.route('/author/surveys/get/mysurveys').post((req, res) => {
    Survey.find({ author: req.body.username }, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
router.route('/author/surveys/delete/survey').post((req, res) => {
    Survey.findOneAndDelete({ name: req.body.survey.name }, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
//~~~~~~~~~~~~~~~~~~
router.route('/author/user/update').post((req, res) => {
    User.findOneAndUpdate({ _id: req.body.user._id }, req.body.user, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
router.route('/author/get/questions').get((req, res) => {
    Question.find((err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
router.route('/author/get/questions').get((req, res) => {
    Question.find((err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
router.route('/author/update/questions').post((req, res) => {
    let newQuestions = req.body.questions;
    for (let i = 0; i < newQuestions.length; ++i) {
        let question = new Question(newQuestions[i]);
        question.save().then(doc => {
            res.json({ 'msg': 'ok' })
        }).catch(err => {
            res.json({ 'msg': 'not ok' });
        })
    }
})

//~~~~~~~~~~~~~~~~~~
router.route('/author/tests/save/new').post((req, res) => {
    Test.findOne({ name: req.body.test.name }, (err, doc) => {
        if (err) console.log(err);
        if (doc) res.json({ 'msg': 'not ok' });
        else {
            let newTest = new Test(req.body.test);
            newTest.save().then(doc => {
                res.json({ 'msg': 'ok' })
            }).catch(err => {
                res.json({ 'msg': 'not ok' });
            })
        }
    })
})
router.route('/author/get/tests').post((req, res) => {
    Test.find({ author: { $ne: req.body.username } }, (err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    })
})
router.route('/author/get/test').post((req, res) => {
    Test.find({ name: req.body.name }, (err, doc) => {
        if (err) console.log(err);
        else res.json(doc);
    })
})
router.route('/author/tests/end').post((req, res) => {
    Test.findOneAndUpdate({ name: req.body.test.name }, req.body.test, (err, doc) => {
        if (err) console.log(err);
        if (doc) res.json({ 'msg': 'ok' });
        else res.json({ 'msg': 'not ok' });
    })
})
router.route('/author/tests/get/mytests').post((req, res) => {
    Test.find({ author: req.body.username }, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})
router.route('/author/tests/delete/test').post((req, res) => {
    Test.findOneAndDelete({ name: req.body.test.name }, (err, doc) => {
        if (err) console.log(err)
        else res.json(doc);
    })
})







app.use('/', router);