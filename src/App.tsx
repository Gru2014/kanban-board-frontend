import "./App.css";
import Header from "./components/header";
import HomePage from "./pages/homePage";
import { AppProvider } from "./context/AppContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <SocketProvider>
      <DndProvider backend={HTML5Backend}>
        <AppProvider>
          <Header />
          <HomePage />
        </AppProvider>
      </DndProvider>
    </SocketProvider>
  );
}

export default App;
