import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";


const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="pt-16">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
