import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Bell,
} from "lucide-react";
import { Badge } from "./ui/badge";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "grades", label: "Grades", icon: BookOpen },
  { id: "assignments", label: "Assignments", icon: FileText, badge: 3 },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`flex flex-col h-full bg-[#1a2744] text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-semibold text-sm leading-tight block">EduTrack</span>
            <span className="text-blue-300 text-xs">Learning Management</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-blue-100/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0 h-5">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1 border-t border-white/10 pt-4">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-100/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-100/70 hover:bg-white/10 hover:text-white transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
