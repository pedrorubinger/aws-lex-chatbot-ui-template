import "./App.css";
import { Provider } from "./components/ui/provider";
import { Chat } from "./pages/chat";

export const App: React.FC = () => {
  return (
    <Provider>
      <Chat />
    </Provider>
  );
};

export default App;
