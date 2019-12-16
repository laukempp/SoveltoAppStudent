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
const url = "/api/topics/";
const token = sessionStorage.getItem("tommi");
export const postQuestion = question => {
  return fetch(`${url}/question`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": token },
    body: JSON.stringify(question)
  });
};

export const getTopics = topic => {
  return fetch(`${url}/ids`).then(res => res.json())
    .catch(err => err)
}

// export const deleteQuestion = id => {
//   return fetch(`${url}/${id}`, {
//     method: "DELETE"
//   });
// };

// export const editQuestion = id => {
//   return fetch(`${url}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" }
//   });
// };
