import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {MainNAvigator} from './NavigationHub/NavigationData';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import AllMoviesReducer from './store/reducer/AllMovies';
import totalReducer from './store/reducer/TotalMovies';
import bookmarkReducer from './store/reducer/BookmarksData';
import titleReducer from './store/reducer/Title';
import labelReducer from './store/reducer/OttLabels';
import ottTitleReducer from './store/reducer/OttTitleNames';
import homeReducer from './store/reducer/ForHomeTitle';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';

const rootReducer = combineReducers({
  fullMovie: AllMoviesReducer,
  total: totalReducer,
  bookmark: bookmarkReducer,
  title: titleReducer,
  label: labelReducer,
  ottt: ottTitleReducer,
  htitle: homeReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = () => {
  SplashScreen.hide();

  useEffect(() => {
    codePush.sync({installMode: codePush.InstallMode.IMMEDIATE});
  }, []);

  return (
    <Provider store={store}>
      <MainNAvigator />
    </Provider>
  );
};

const CODE_PUSH_OPTIONS = {
  chackFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

let exportApp = App;

exportApp = codePush(CODE_PUSH_OPTIONS)(App);

export default exportApp;
