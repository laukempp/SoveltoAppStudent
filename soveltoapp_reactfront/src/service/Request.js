const url = "/login";

//Kirjaudutaan sisään

export const loginUser = user => {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })
    .then(res => {
      return res.json();
    })
    .then(jsonResponse => {
      if (jsonResponse.message) {
        return;
      } else {
        localStorage.setItem("tommi", jsonResponse.data.token);
      }
    });
};

export const checkAuth = () => {
  return localStorage.getItem("tommi");
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
