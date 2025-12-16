import { Outlet } from "react-router-dom";
import VendeurSidebar from "../components/VendeurSidebar";
import Navbar from "../components/Navbar";

export default function VendeurLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendeurSidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
