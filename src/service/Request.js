
//Noudetaan kysymys-array Quiz-komponenttia varten
export const getStudentQs = (object) => {
  return fetch("/api/quiz", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(object),
  })
    .then(res => res.json())
};

//Lähetetään oppilaan vastaukset tietokantaan
export const postScores = score => {
  return fetch(`/api/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(score)
  })
  .then(res => res.json())
};

//Noudetaan tulokset tietokannasta
export const studentScore = (searchData) => {
  return fetch('/api/scores/student', {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(searchData)
  })
  .then(res => res.json())
};

//Tarkistetaan tietokantaa vasten, onko oppilaan entry-sivulle syöttämä opettajanumero validi
export const checkTeacherBadge = badge => {
  return fetch('/teacher', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(badge)
  })
  .then(res => res.json())
}
