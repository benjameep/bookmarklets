let form = document.querySelector("#submit_quiz_form"), 
  quizId, numLoaded, numSaved

/**** Helper Method to Iterate Entries ****/
function iterateEntries(entries,fn){
	for(var [name,value] of entries){
		if (!name.startsWith("question_") || name === "question_text") continue;
		var elm = form.elements.namedItem(name)
		var $question = $(elm).closest('.question')
    fn(name,value,elm,$question)
	}
}

/**** Load Saved *****/
function loadSaved(){
  var saved = new URLSearchParams(localStorage.getItem(quizId)),
	  unanswered = {}
  // For each of the questions
  iterateEntries(saved.entries(),(name,value,elm,$question) => {
    // If it has not been answered
    if(!$question.hasClass('answered') || unanswered[$question.id]){
      unanswered[$question.id] = true
      // Set the value
      if(elm.type == 'textarea')
        tinyMCE.get(elm.id).setContent(value)
      else if($(elm).is(':checkbox'))
        $(elm).prop('checked',value==='true')
      else
        elm.value = value
        
      // Manually update the question so the 'answered' class is up to data
      $(elm).trigger('change')
      // Increment count
      numLoaded++
      // Cause logging is useful
      console.info(`[quizsaver] Answered ${name} with "${value}"`)
    } else {
      console.info(`[quizsaver] Skipped ${name} with "${value}"`)
    }
  })
}

/**** Save Answers ****/
function saveAnswers(){
  var formData = new FormData(form),
      saved = new URLSearchParams()
  numSaved = 0

  // For each of the questions
  iterateEntries(formData.entries(),(name,value,elm,$question) => {
    
    if($question.hasClass('answered')){
      if(elm.type == 'textarea')
        value = tinyMCE.get(elm.id).getContent()
      else if($(elm).is(':checkbox'))
        value = $(elm).filter('[id]').prop('checked')
      else 
        value = value
  
      saved.set(name,value)
  
      // Increment count
      numSaved++
      // Cause logging is useful
      console.info(`[quizsaver] Saved ${name} with "${value}"`)
    } else {
      console.info(`[quizsaver] Unanswered ${name} with "${value}"`)
    }

  })

  // Save to Local Storage
  localStorage.setItem(quizId,saved.toString())
}

export default function run(){
  if(form){
    quizId = form.action.match(/\d+/g).join("_");
    loadSaved()
    saveAnswers()
    $.flashMessage([
      numLoaded&&`${numLoaded} Question Answer${numLoaded==1?'':'s'} Loaded`,
      numSaved&&`${numSaved} Question Answer${numSaved==1?'':'s'} Saved`,
    ].filter(n => n).join(' '))
  } else {
    window.$ && window.$.flashError && 
    $.flashError('Unable to run the Quiz Saver on this page')
    console.error('Unable to run the Quiz Saver on this page') 
  }
}

form && $(form).submit(() => (run(),true))
