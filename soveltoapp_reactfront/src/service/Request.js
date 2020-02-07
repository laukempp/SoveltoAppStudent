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

export const postScores = score => {
  return fetch(`/api/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(score)
  });
};

export const studentScore = searchData => {
  return fetch(`/api/scores/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(searchData)
  })
  .then(res => res.json())
};

