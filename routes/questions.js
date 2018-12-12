const express = require('express');
const Question = require('../models/question');
const Answer = require('../models/answer'); 
const catchErrors = require('../lib/async-error');
var multer = require('multer');
var uploadSetting = multer({dest:"/"});
const router = express.Router();

// 동일한 코드가 users.js에도 있습니다. 이것은 나중에 수정합시다.
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET questions listing. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}},
      {host: {'$regex': term, '$options': 'i'}},
      {area: {'$regex': term, '$options': 'i'}},
      {subject: {'$regex': term, '$options': 'i'}},
      {periodst: {'$regex': term, '$options': 'i'}},
      {perioden: {'$regex': term, '$options': 'i'}},
      {outline: {'$regex': term, '$options': 'i'}},
      {manager: {'$regex': term, '$options': 'i'}},
      {tel: {'$regex': term, '$options': 'i'}},
      {img: {'$regex': term, '$options': 'i'}},

    ]};
  }
  const questions = await Question.paginate(query, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('questions/index', {questions: questions, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('questions/new', {question: {}});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  res.render('questions/edit', {question: question});
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate('author');
  const answers = await Answer.find({question: question.id}).populate('author');
  question.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???

  await question.save();
  res.render('questions/show', {question: question, answers: answers});
}));

router.put('/:id', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    req.flash('danger', 'Not exist question');
    return res.redirect('back');
  }
  question.title = req.body.title;
  question.content = req.body.content;
  question.host = req.body.host;
  question.area = req.body.area;
  question.subject = req.body.subject;
  question.periodst = req.body.periodst;
  question.perioden = req.body.perioden;
  question.outline = req.body.outline;
  question.manager = req.body.manager;
  question.tel = req.body.tel;
  question.img = req.body.img;
  question.tags = req.body.tags.split(" ").map(e => e.trim());

  await question.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/questions');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Question.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/questions');
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  var question = new Question({
    title: req.body.title,
    author: user._id,
    content: req.body.content,
    host: req.body.host,
    area: req.body.area,
    subject: req.body.subject,
    periodst: req.body.periodst,
    perioden: req.body.perioden,
    outline: req.body.outline,
    manager: req.body.manager,
    tel: req.body.tel,
    img: req.body.img,
    tags: req.body.tags.split(" ").map(e => e.trim()),
  });
  await question.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/questions');
}));

// router.post('/', uploadSetting.single('/'),function(req,res){
//   var tmpPath = req.file.path;
//   var fileName = req.file.filename;
//   var newPath = "../public/images" + fileName;

//   fs.rename(tmpPath,newPath,function(err){
//     if(err){
//       console.log(err);
//     }
//     var html;

//     html="";
//     html += "<script type='text/javascript'>";
//     html += " var funcNum = " + req.query.CKEditorFuncNum + ";";
//     html += " var url = \"/images/" + fileName + "\";";
//     html += " var message = \"업로드 완료\";";
//     html += " window.parent.CKEDITOR.tools.callFunction(funcNum, url);";
//     html += "</script>";
//     res.send(html);
//   });
// });

router.post('/:id/answers', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const question = await Question.findById(req.params.id);

  if (!question) {
    req.flash('danger', 'Not exist question');
    return res.redirect('back');
  }

  var answer = new Answer({
    author: user._id,
    question: question._id,
    content: req.body.content
  });
  await answer.save();
  question.numAnswers++;
  await question.save();

  req.flash('success', 'Successfully answered');
  res.redirect(`/questions/${req.params.id}`);
}));



module.exports = router;
