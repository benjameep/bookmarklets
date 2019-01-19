var types = [
  {
    q: "[type=checkbox],[type=radio]",
    get: elm => elm.checked,
    set: (elm, val) => (elm.checked = val),
    nullval: false
  },
  {
    q: "[type=text]",
    get: elm => elm.value,
    set: (elm, val) => (elm.value = val),
    nullval: ""
  },
  {
    q: "select",
    get: elm => elm.selectedIndex,
    set: (elm, val) => (elm.selectedIndex = val),
    nullval: 0
  },
  {
    q: ".ic-RichContentEditor textarea",
    get: elm => tinyMCE.get(elm.id).getContent(),
    set: (elm, val) => tinyMCE.get(elm.id).setContent(val),
    nullval: ""
  }
];

var $$ = (q, elm) => [].slice.apply((elm || document).querySelectorAll(q));


export default (function(){

  var form = document.querySelector("#submit_quiz_form");
  if(!form || window.jQuery == 'undefined') {
    $.flashError('Unable to run the Quiz Saver')
    return console.error.bind(null,'Unable to run the quizsaver');
  }
  var questions = $$("#questions .question", form);
  var quizId = form.action.match(/\d+/g).join("_");
  var saved = JSON.parse(localStorage.getItem(quizId) || "{}");
  
  function run() {
    var numAnswered = 0

    var answers = Array.from(questions)
      .map(question => {
        var type = types.find(({ q }) => question.querySelector(q));
        if (!type) return;
        var answers = $$(type.q, question);
        var hasBeenAnswered = !answers.every(n => type.get(n) === type.nullval);
        if (saved[question.id] && !hasBeenAnswered) {
          console.log(
            "answering " + question.querySelector(".question_name").innerText
          );
          numAnswered++
          saved[question.id].forEach((answer, i) => {
            type.set(answers[i], answer);
          });
        }
        return {
          id: question.id,
          hasBeenAnswered,
          answers: answers.map(type.get)
        };
      })
      .filter(n => n && n.hasBeenAnswered)
      .reduce((o, n) => ((o[n.id] = n.answers), o), {});

    localStorage.setItem(quizId, JSON.stringify(answers));
    
    if(numAnswered > 1){
      $.flashMessage(`${numAnswered} Question Answer${numAnswered==1?'':'s'} Loaded`)
    } else {
      $.flashMessage('Quiz Answers Saved')
    }
  }

  $(form).submit(function() {
    run();
    return true;
  });

  return run

})()