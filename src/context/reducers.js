
//Globaali tila alkutilanteessa, jolloin vastaus-array on tyhjä. 
const initialState = {
    pointList: []
  };
  
 //Määritellään käytettävät funktiot ja niiden tyypit 
  const types = {
    SET_POINT_LIST: "SET_POINT_LIST",
    ADD_TO_POINT_LIST: "ADD_TO_POINT_LIST",
  };
  
  //Funktio reducer, joka sisältää yllämääritellyt funktiot. Se funktio käynnistyy, jota actions-komponentin funktio käyttää. Jokaiselle funktiolle on määritelty, että mitä funtio tekee tilalle.
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case types.SET_POINT_LIST:
        return {
          ...state,
          pointList: action.payload
        };

      //Tämä funktio lisää tila-arrayhin uusia dataelementtejä
      case types.ADD_TO_POINT_LIST:
        return {
          ...state,
          pointList: [...state.pointList, action.payload]
        };

      //Tämä funktio päivittää olemassaolevia dataelementtejä käyttäen id:ta päivitykseen eli vanha korvataan uudella
      case types.UPDATE_POINT_LIST:
          return {
              ...state,
              pointList: state.pointList.map(item => {
                  if (item.identifier !== action.payload.identifier) {
                      return item
                  } return {
                      ...item,
                      ...action.payload
                  }
              })
          }
      default:
        throw new Error("Unexpected action");
   };
}
  export { initialState, types, reducer };
  