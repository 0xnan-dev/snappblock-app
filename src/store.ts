import {configureStore} from '@reduxjs/toolkit';
// import rootReducer from './reducers';
import walletReducer from './features/wallet/walletSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
