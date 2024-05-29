import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Events from "./pages/Events.jsx";
import { SupabaseProvider } from "./integrations/supabase/index.js";

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
}

export default App;