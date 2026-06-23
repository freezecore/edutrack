import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Students } from "./components/Students";
import { Attendance } from "./components/Attendance";
import { Grades } from "./components/Grades";
import { Assignments } from "./components/Assignments";
import { Reports } from "./components/Reports";
import { Toaster } from "sonner";

type View = "dashboard" | "students" | "attendance" | "grades" | "assignments" | "reports";

function renderView(view: View) {
  switch (view) {
    case "dashboard": return <Dashboard />;
    case "students": return <Students />;
    case "attendance": return <Attendance />;
    case "grades": return <Grades />;
    case "assignments": return <Assignments />;
    case "reports": return <Reports />;
  }
}

export default function App() {
  const [view, setView] = useState<View>("dashboard");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Toaster />
      <Sidebar activeView={view} onNavigate={(v) => setView(v as View)} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {renderView(view)}
        </div>
      </main>
    </div>
  );
}
