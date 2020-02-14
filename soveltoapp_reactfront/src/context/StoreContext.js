import React, { createContext, useReducer} from "react";
import { reducer, initialState } from "./reducers";
import { useActions } from "./actions";

//Tässä komponentissa luodaan store, jonka avulla säilötään globaalia tilaa
//Komponentin luomisessa on käytetty tätä lähdettä: https://itnext.io/replace-redux-state-with-react-hooks-and-context-7906e0fd5521

const StoreContext = createContext(initialState);

const StoreProvider = ({ children }) => {
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useActions(state, dispatch);

  return (
    <StoreContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
