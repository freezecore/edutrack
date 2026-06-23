import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, MinusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CLASSES = ["9A", "9B", "9C", "10A", "10B", "10C", "11A", "11B", "11C", "12A", "12B", "12C"];

const classStats = [
  { class: "9A", present: 28, absent: 2, late: 1, rate: 96 },
  { class: "9B", present: 25, absent: 3, late: 2, rate: 91 },
  { class: "9C", present: 27, absent: 1, late: 1, rate: 97 },
  { class: "10A", present: 30, absent: 0, late: 0, rate: 100 },
  { class: "10B", present: 26, absent: 4, late: 1, rate: 88 },
  { class: "10C", present: 24, absent: 5, late: 2, rate: 83 },
  { class: "11A", present: 29, absent: 1, late: 0, rate: 97 },
  { class: "11B", present: 27, absent: 2, late: 1, rate: 93 },
  { class: "11C", present: 25, absent: 4, late: 2, rate: 87 },
  { class: "12A", present: 22, absent: 2, late: 1, rate: 92 },
  { class: "12B", present: 20, absent: 3, late: 1, rate: 88 },
  { class: "12C", present: 19, absent: 4, late: 2, rate: 83 },
];

const weeklyData = [
  { day: "Mon", present: 441, absent: 18, late: 12 },
  { day: "Tue", present: 448, absent: 12, late: 11 },
  { day: "Wed", present: 436, absent: 24, late: 11 },
  { day: "Thu", present: 451, absent: 11, late: 9 },
  { day: "Fri", present: 427, absent: 33, late: 11 },
];

const classRoster = [
  { id: 1, name: "Emma Wilson", status: "present" },
  { id: 2, name: "James Chen", status: "present" },
  { id: 3, name: "Sofia Martinez", status: "late" },
  { id: 4, name: "Noah Thompson", status: "present" },
  { id: 5, name: "Ava Johnson", status: "absent" },
  { id: 6, name: "Michael Torres", status: "absent" },
  { id: 7, name: "Isabella Davis", status: "present" },
  { id: 8, name: "Liam Anderson", status: "present" },
];

type AttendanceStatus = "present" | "absent" | "late" | "excused";

function StatusIcon({ status }: { status: AttendanceStatus }) {
  if (status === "present") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  if (status === "absent") return <XCircle className="w-5 h-5 text-red-500" />;
  if (status === "late") return <Clock className="w-5 h-5 text-orange-500" />;
  return <MinusCircle className="w-5 h-5 text-gray-400" />;
}

function statusLabel(s: string) {
  const map: Record<string, { label: string; color: string }> = {
    present: { label: "Present", color: "bg-green-100 text-green-700" },
    absent: { label: "Absent", color: "bg-red-100 text-red-700" },
    late: { label: "Late", color: "bg-orange-100 text-orange-700" },
    excused: { label: "Excused", color: "bg-gray-100 text-gray-700" },
  };
  return map[s] || map.excused;
}

export function Attendance() {
  const [selectedClass, setSelectedClass] = useState("10A");
  const [roster, setRoster] = useState<Record<number, AttendanceStatus>>(
    Object.fromEntries(classRoster.map((s) => [s.id, s.status as AttendanceStatus]))
  );

  const toggleStatus = (id: number) => {
    setRoster((prev) => {
      const order: AttendanceStatus[] = ["present", "absent", "late", "excused"];
      const cur = prev[id];
      const next = order[(order.indexOf(cur) + 1) % order.length];
      return { ...prev, [id]: next };
    });
  };

  const counts = {
    present: Object.values(roster).filter((s) => s === "present").length,
    absent: Object.values(roster).filter((s) => s === "absent").length,
    late: Object.values(roster).filter((s) => s === "late").length,
    excused: Object.values(roster).filter((s) => s === "excused").length,
  };
  const total = classRoster.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Attendance</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Monday, June 9, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-border hover:bg-accent transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-sm text-foreground px-2">Week 22</span>
          <button className="p-2 rounded-lg border border-border hover:bg-accent transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Present", count: 441, pct: "93.6%", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
          { label: "Absent", count: 18, pct: "3.8%", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
          { label: "Late", count: 12, pct: "2.5%", color: "text-orange-600", bg: "bg-orange-50", icon: Clock },
          { label: "Excused", count: 0, pct: "0.0%", color: "text-gray-600", bg: "bg-gray-50", icon: MinusCircle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="pt-4 pb-4 px-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className={`text-2xl ${stat.color}`}>{stat.count}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.pct} of students</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Mark Attendance */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Mark Attendance</CardTitle>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Mini summary */}
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-green-600">{counts.present} present</span>
              <span className="text-xs text-red-600">{counts.absent} absent</span>
              <span className="text-xs text-orange-600">{counts.late} late</span>
            </div>
            <Progress value={(counts.present / total) * 100} className="h-1.5 mt-1" />
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {classRoster.map((student) => {
              const s = roster[student.id];
              const { label, color } = statusLabel(s);
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm text-foreground">{student.name}</span>
                  </div>
                  <button
                    onClick={() => toggleStatus(student.id)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${color} transition-colors`}
                  >
                    <StatusIcon status={s} />
                    {label}
                  </button>
                </div>
              );
            })}
            <button className="w-full mt-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors">
              Save Attendance
            </button>
          </CardContent>
        </Card>

        {/* Weekly Chart */}
        <Card className="col-span-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Week's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barSize={18} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="present" fill="#22c55e" radius={[3, 3, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#ef4444" radius={[3, 3, 0, 0]} name="Absent" />
                <Bar dataKey="late" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Class Attendance Table */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Class Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Class", "Present", "Absent", "Late", "Rate", ""].map((h) => (
                    <th key={h} className="text-left text-xs text-muted-foreground px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStats.map((row) => (
                  <tr key={row.class} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3 text-sm text-foreground">Grade {row.class}</td>
                    <td className="px-5 py-3 text-sm text-green-600">{row.present}</td>
                    <td className="px-5 py-3 text-sm text-red-600">{row.absent}</td>
                    <td className="px-5 py-3 text-sm text-orange-600">{row.late}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={row.rate} className="h-1.5 w-20" />
                        <span className={`text-xs ${row.rate >= 90 ? "text-green-600" : row.rate >= 80 ? "text-orange-600" : "text-red-600"}`}>
                          {row.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-xs text-blue-600 hover:underline">Mark</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
