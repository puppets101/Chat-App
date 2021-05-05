import NetworkProvider from "./context/NetworkContext";
import Router from "./navigation/Router";

function App() {
  return (
    <NetworkProvider>
      <Router />
    </NetworkProvider>
  );
}

export default App;
