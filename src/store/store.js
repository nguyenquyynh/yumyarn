import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer, persistStore } from 'redux-persist'
import auth from 'src/store/reducers/auth'
import setting from 'src/store/reducers/setting'
const persistConfig = {
    key: 'store',
    storage: AsyncStorage,
    whitelist: ['auth', 'setting'],
}
const rootReducer = combineReducers({
    auth: auth,
    setting: setting
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

const persistor = persistStore(store);
export {store, persistor}