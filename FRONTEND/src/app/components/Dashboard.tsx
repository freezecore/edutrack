import {
  Users,
  ClipboardCheck,
  TrendingUp,
  Award,
  ArrowUp,
  ArrowDown,
  Bell,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const attendanceData = [
  { month: "Sep", rate: 94 },
  { month: "Oct", rate: 91 },
  { month: "Nov", rate: 88 },
  { month: "Dec", rate: 85 },
  { month: "Jan", rate: 90 },
  { month: "Feb", rate: 93 },
  { month: "Mar", rate: 96 },
];

const gradeDistribution = [
  { grade: "A", count: 42 },
  { grade: "B", count: 67 },
  { grade: "C", count: 38 },
  { grade: "D", count: 18 },
  { grade: "F", count: 7 },
];

const subjectPerformance = [
  { subject: "Math", value: 78 },
  { subject: "Science", value: 85 },
  { subject: "English", value: 82 },
  { subject: "History", value: 74 },
  { subject: "Art", value: 91 },
];

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const enrollmentPie = [
  { name: "Grade 9", value: 120 },
  { name: "Grade 10", value: 135 },
  { name: "Grade 11", value: 118 },
  { name: "Grade 12", value: 98 },
];

const recentActivity = [
  { type: "grade", text: "Sarah J. received A in Math Exam", time: "2m ago", color: "bg-green-500" },
  { type: "attendance", text: "Period 3 attendance marked for 8B", time: "15m ago", color: "bg-blue-500" },
  { type: "assignment", text: "History Essay due tomorrow – 12 pending", time: "1h ago", color: "bg-orange-500" },
  { type: "alert", text: "Michael T. flagged – 3 absences this week", time: "2h ago", color: "bg-red-500" },
  { type: "grade", text: "Science quiz results published for 10A", time: "3h ago", color: "bg-purple-500" },
];

const topStudents = [
  { name: "Emma Wilson", gpa: 3.98, grade: "10A", trend: "up" },
  { name: "James Chen", gpa: 3.95, grade: "11B", trend: "up" },
  { name: "Sofia Martinez", gpa: 3.91, grade: "9C", trend: "stable" },
  { name: "Noah Thompson", gpa: 3.88, grade: "12A", trend: "down" },
];

const statCards = [
  {
    title: "Total Students",
    value: "471",
    change: "+12",
    changeLabel: "this semester",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Avg Attendance",
    value: "93.4%",
    change: "+1.2%",
    changeLabel: "vs last month",
    trend: "up",
    icon: ClipboardCheck,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Avg GPA",
    value: "3.21",
    change: "-0.04",
    changeLabel: "vs last quarter",
    trend: "down",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Passing Rate",
    value: "94.1%",
    change: "+2.3%",
    changeLabel: "vs last quarter",
    trend: "up",
    icon: Award,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Spring Semester 2026 – Week 22</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              AP
            </div>
            <div className="text-sm">
              <div className="text-foreground leading-tight">Admin Principal</div>
              <div className="text-muted-foreground text-xs">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-border">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{card.title}</span>
                  <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <div className="text-2xl text-foreground mb-1">{card.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {card.trend === "up" ? (
                    <ArrowUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {card.change}
                  </span>
                  <span className="text-muted-foreground">{card.changeLabel}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Attendance Trend */}
        <Card className="col-span-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}%`, "Attendance"]} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#attendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollment by Grade */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Enrollment by Grade</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={enrollmentPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {enrollmentPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full mt-1">
              {enrollmentPie.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs text-foreground ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Grade Distribution */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={gradeDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Subject Avg Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjectPerformance.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{s.subject}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <Progress value={s.value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Top Performing Students</CardTitle>
            <Badge variant="secondary" className="text-xs">This Quarter</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {topStudents.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.grade} · GPA {s.gpa}</p>
                </div>
                {s.trend === "up" ? (
                  <ArrowUp className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                ) : s.trend === "down" ? (
                  <ArrowDown className="w-4 h-4 text-red-500 ml-auto shrink-0" />
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
