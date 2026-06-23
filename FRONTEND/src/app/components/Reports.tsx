import { Download, TrendingUp, Users, BookOpen, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const gpaByGrade = [
  { quarter: "Q1", grade9: 3.12, grade10: 3.28, grade11: 3.35, grade12: 3.41 },
  { quarter: "Q2", grade9: 3.18, grade10: 3.25, grade11: 3.30, grade12: 3.38 },
  { quarter: "Q3", grade9: 3.21, grade10: 3.31, grade11: 3.28, grade12: 3.44 },
];

const attendanceByMonth = [
  { month: "Sep", rate: 94.2 },
  { month: "Oct", rate: 91.8 },
  { month: "Nov", rate: 88.5 },
  { month: "Dec", rate: 85.1 },
  { month: "Jan", rate: 90.4 },
  { month: "Feb", rate: 93.1 },
  { month: "Mar", rate: 95.8 },
  { month: "Apr", rate: 94.7 },
  { month: "May", rate: 93.4 },
];

const subjectComparison = [
  { subject: "Math", q1: 82, q2: 84, q3: 88 },
  { subject: "Science", q1: 80, q2: 83, q3: 85 },
  { subject: "English", q1: 85, q2: 84, q3: 87 },
  { subject: "History", q1: 78, q2: 80, q3: 83 },
  { subject: "Art", q1: 88, q2: 90, q3: 91 },
];

const reportCards = [
  {
    title: "Semester Report",
    desc: "Full academic performance summary for Spring 2026",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    tag: "PDF",
  },
  {
    title: "Attendance Summary",
    desc: "Monthly attendance rates and patterns by class",
    icon: ClipboardCheck,
    color: "text-green-600",
    bg: "bg-green-50",
    tag: "PDF",
  },
  {
    title: "Grade Analytics",
    desc: "Subject averages, distributions, and trends",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
    tag: "XLSX",
  },
  {
    title: "Student Roster",
    desc: "Full student list with contact and status data",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-50",
    tag: "CSV",
  },
];

export function Reports() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Spring 2026 – Academic Year Overview</p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-4 gap-4">
        {reportCards.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.title} className="border-border hover:border-blue-300 transition-colors cursor-pointer group">
              <CardContent className="pt-4 pb-4 px-5">
                <div className={`w-10 h-10 rounded-lg ${r.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${r.color}`} />
                </div>
                <h4 className="text-foreground mb-1">{r.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{r.tag}</Badge>
                  <button className={`text-xs ${r.color} hover:underline flex items-center gap-1`}>
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* GPA Trends */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">GPA Trends by Grade Level</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={gpaByGrade}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[2.8, 3.6]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => v.toFixed(2)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey="grade9" name="Grade 9" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line dataKey="grade10" name="Grade 10" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line dataKey="grade11" name="Grade 11" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} />
              <Line dataKey="grade12" name="Grade 12" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Attendance Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Attendance Rate – Academic Year</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceByMonth}>
                <defs>
                  <linearGradient id="attendGradR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Rate"]} />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fill="url(#attendGradR)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Comparison */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Subject Performance by Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectComparison} barSize={14} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="q1" name="Q1" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                <Bar dataKey="q2" name="Q2" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                <Bar dataKey="q3" name="Q3" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Year-End Summary by Grade</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-0 pb-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Grade", "Enrollment", "Avg GPA", "Avg Attendance", "Pass Rate", "Honor Roll", "At Risk"].map((h) => (
                  <th key={h} className="text-left text-xs text-muted-foreground px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { grade: "Grade 9", enrollment: 120, gpa: 3.21, attendance: "94.2%", pass: "96.5%", honor: 14, risk: 5 },
                { grade: "Grade 10", enrollment: 135, gpa: 3.31, attendance: "93.8%", pass: "97.1%", honor: 18, risk: 4 },
                { grade: "Grade 11", enrollment: 118, gpa: 3.28, attendance: "92.7%", pass: "95.8%", honor: 16, risk: 6 },
                { grade: "Grade 12", enrollment: 98, gpa: 3.44, attendance: "91.5%", pass: "98.2%", honor: 22, risk: 2 },
              ].map((row) => (
                <tr key={row.grade} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-foreground">{row.grade}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.enrollment}</td>
                  <td className="px-5 py-3.5 text-sm text-blue-600">{row.gpa}</td>
                  <td className="px-5 py-3.5 text-sm text-green-600">{row.attendance}</td>
                  <td className="px-5 py-3.5 text-sm text-foreground">{row.pass}</td>
                  <td className="px-5 py-3.5">
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">{row.honor}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge className="bg-red-100 text-red-700 text-xs">{row.risk}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
