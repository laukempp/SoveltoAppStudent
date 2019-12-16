const token = sessionStorage.getItem('tommi');

export const fetchQuestions =(topic_id)=> {
  return fetch("api/topics/" + topic_id, {
    headers: {
      'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlN1bGFra2FAc2lsYWtrYS5maSIsImlkIjoxLCJ0aW1lIjoiMjAxOS0xMi0xNlQxMTo0Mzo1OS43NThaIiwiaWF0IjoxNTc2NDk2NjM5LCJleHAiOjE1NzY1MTgyMzl9.DDL727Zu6GY_k0gWayPr0i42abIoVDRYdExl9pJ72BM',
    }
  })
  .then(res => res.json())
};

export const postQuiz = (quiz) => {
  return fetch("api/topics/quiz", {
    method: "POST",
        headers: {
        "Accept": "application/json", 
        "Content-type": "application/json", 
        "authorization": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlN1bGFra2FAc2lsYWtrYS5maSIsImlkIjoxLCJ0aW1lIjoiMjAxOS0xMi0xNlQxMTo0Mzo1OS43NThaIiwiaWF0IjoxNTc2NDk2NjM5LCJleHAiOjE1NzY1MTgyMzl9.DDL727Zu6GY_k0gWayPr0i42abIoVDRYdExl9pJ72BM'
        },
        body: JSON.stringify(quiz)
    })
  }




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