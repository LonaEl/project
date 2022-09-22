import { combineReducers } from 'redux';

import posts from './posts';
import auth from './auth';
import claims from './claim';

export const reducers = combineReducers({ posts, auth, claims });