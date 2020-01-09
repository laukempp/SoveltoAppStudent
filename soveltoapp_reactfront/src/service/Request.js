const url = "/api/topics/";

export const fetchQuestions = (querydata) => {
  console.log('Tässä serviceclientissa näkyvä quiz-data ' + querydata)
  let token = sessionStorage.getItem("tommi")
  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": token,
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(querydata)
  })
    .then(res => res.json())
};

export const postQuiz = (quiz) => {
  let token = sessionStorage.getItem("tommi")
  return fetch("api/topics/quiz", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(quiz)
  })
}

export const getStudentQs = (array) => {
  let token = sessionStorage.getItem("tommi")
  console.log(JSON.stringify(array))
  return fetch("/api/topics/quiz", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(array),
  })
    .then(res => res.json())
};

export const postQuestion = question => {
  let token = sessionStorage.getItem("tommi")
  return fetch(`/api/topics/question`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": token },
    body: JSON.stringify(question)
  });
};

export const getTopics = topic => {
  let token = sessionStorage.getItem("tommi")
  return fetch(url, {
    headers: {
      "Authorization": token
    },
  }).then(res => res.json())
    .catch(err => err)
}

export const postScores = score => {
  console.log("Tässä näkyy score" + score)
  return fetch(`/api/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(score)
  });
};




/*


//Kirjaudutaan sisään



export const checkAuth = (token) => {

  return token;
};

export const logoutUser = () => {
  localStorage.removeItem("tommi");
};

export const checkItem = () => {
  let item = localStorage.getItem("tommi");
  if (item) {
    return true;
  } else {
    return false;
  }
};

export const redirect = () => {};
 */
