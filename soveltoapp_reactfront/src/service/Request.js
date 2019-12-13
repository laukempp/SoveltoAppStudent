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