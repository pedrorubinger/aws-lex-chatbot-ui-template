import "./App.css";
import { Demo } from "@/components/ui/demo";
import { Provider } from "@/components/ui/provider";
import { Chat } from "@/pages/chat";

export const App: React.FC = () => {
  return (
    <Provider>
      <Demo />
      <Chat />
    </Provider>
  );
};

export default App;
