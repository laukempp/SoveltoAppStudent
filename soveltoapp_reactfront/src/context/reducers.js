const initialState = {
    pointList: []
  };
  
  const types = {
    SET_POINT_LIST: "SET_POINT_LIST",
    ADD_TO_POINT_LIST: "ADD_TO_POINT_LIST",
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case types.SET_POINT_LIST:
        return {
          ...state,
          pointList: action.payload
        };
      case types.ADD_TO_POINT_LIST:
        return {
          ...state,
          pointList: [...state.pointList, action.payload]
        };
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
  