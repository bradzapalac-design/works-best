import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ActivityPage } from "./pages/ActivityPage";
import { Dashboard } from "./pages/Dashboard";
import { DataPage } from "./pages/DataPage";
import { ThemesPage } from "./pages/ThemesPage";
import { StoreProvider } from "./store";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
