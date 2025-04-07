import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import masterReducer from "./masterfetch";
import userReducer from "./userdetail";


// Configuration for persisting Redux state
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "master",
    "user"

  ],
};

// Combining all reducers into a single persisted reducer
//slice mapped to reducers
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    master: masterReducer,
    user: userReducer,
    
  })
);

// Creating the Redux store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store); // Creating persistor linked to the store

export { store, persistor }; // Exporting store and persistor for use in the application
