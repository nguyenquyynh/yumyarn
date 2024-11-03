import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import auth from 'src/store/reducers/auth';
import setting from 'src/store/reducers/setting';
import search from 'src/store/reducers/search';
import fcm from 'reducers/fcm';
import home from 'reducers/home';

const persistConfig = {
  key: 'store',
  storage: AsyncStorage,
  whitelist: ['auth', 'setting', 'search','home'],
};
const rootReducer = combineReducers({
  auth: auth,
  setting: setting,
  search: search,
  fcm: fcm,
  home:home
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

const persistor = persistStore(store);
export {store, persistor};
