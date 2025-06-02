import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import UserInfo from "./components/userInfo";
import { Provider } from "react-redux";
import store from "./appStore/store";
import Feed from "./components/feed";
function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/profile" element={<UserInfo />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
