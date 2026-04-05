import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js';
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient} from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>,
)
