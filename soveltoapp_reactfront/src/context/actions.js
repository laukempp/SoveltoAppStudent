import { types } from "./reducers";

export const useActions = (state, dispatch) => {

  function addToPointList(newPoint, pointArray) {
    const found = pointArray.some(el => el.identifier === newPoint.identifier)
    if (found) {
      dispatch({ type: types.UPDATE_POINT_LIST, payload: newPoint });
    } else {
      dispatch({ type: types.ADD_TO_POINT_LIST, payload: newPoint });
    }

  }

  return {
    addToPointList
  };
};
