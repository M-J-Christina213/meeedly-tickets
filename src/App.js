import MainRouter from "./Routes/MainRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Style/Main.css";
import "./Style/Mobile.css";
import "./Style/Desktop.css";
import "./Style/Tablet.css";

const App = () => {
  return (
    <>
      <MainRouter />
    </>
  );
};

export default App;