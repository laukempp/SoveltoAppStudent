import { types } from "./reducers";

export const useActions = (state, dispatch) => {

  //Funktio, joka tallettaa dataa storeContextiin ja saa datan question-komponentilta. Funktio ensin tarkistaa, löytyykö data-arraysta komponentin lähettämää id:ta vastaava id. Jos ei löydy, kyseessä on uusi datasetti ja se lähetetään funktiolle, joka tallentaa uutta dataa. Jos löytyy, se lähetetään funktiolle, joka päivittää jo olemassaolevaa dataa.
  function addToPointList(newPoint, pointArray) {
    const found = pointArray.some(el => el.identifier === newPoint.identifier)
    if (found) {
      dispatch({ type: types.UPDATE_POINT_LIST, payload: newPoint });
    } else {
      dispatch({ type: types.ADD_TO_POINT_LIST, payload: newPoint });
    }

  }

  //Exportataan ulos addToPointList-funktio
  return {
    addToPointList
  };
};
