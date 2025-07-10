import { Route, Routes } from "react-router";
export default function App() {
  return (
     <Routes>
        <Route path="/" element={<>home</>} />
        <Route path="/about" element={<>about</>} />
        <Route path="/contact" element={<>contact</>} />
      </Routes>
  );
}
