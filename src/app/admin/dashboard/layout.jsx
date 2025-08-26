import Sidebar from "@/components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-44 md:w-64">
        <Sidebar />
      </div>

      {/* Content area with padding to account for sidebar */}
      <div className="flex-1 pl-44 md:pl-64 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}