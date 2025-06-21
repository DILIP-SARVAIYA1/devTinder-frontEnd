import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./appStore/store";
import SignUp from "./components/SignUp";
function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
