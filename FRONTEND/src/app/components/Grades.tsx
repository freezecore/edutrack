import { useState } from "react";
import { Search, Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const subjects = ["Mathematics", "Science", "English", "History", "Art", "PE"];

const grades: Record<string, { score: number; letter: string; trend: "up" | "down" | "stable" }[]> = {
  "Emma Wilson":   [{ score: 98, letter: "A+", trend: "up" }, { score: 95, letter: "A", trend: "stable" }, { score: 97, letter: "A+", trend: "up" }, { score: 93, letter: "A", trend: "up" }, { score: 99, letter: "A+", trend: "stable" }, { score: 95, letter: "A", trend: "up" }],
  "James Chen":    [{ score: 96, letter: "A", trend: "up" }, { score: 94, letter: "A", trend: "up" }, { score: 91, letter: "A-", trend: "stable" }, { score: 95, letter: "A", trend: "up" }, { score: 98, letter: "A+", trend: "up" }, { score: 94, letter: "A", trend: "stable" }],
  "Sofia Martinez":[{ score: 92, letter: "A-", trend: "stable" }, { score: 89, letter: "B+", trend: "up" }, { score: 94, letter: "A", trend: "up" }, { score: 91, letter: "A-", trend: "stable" }, { score: 96, letter: "A", trend: "up" }, { score: 88, letter: "B+", trend: "stable" }],
  "Noah Thompson": [{ score: 88, letter: "B+", trend: "down" }, { score: 91, letter: "A-", trend: "stable" }, { score: 87, letter: "B+", trend: "down" }, { score: 85, letter: "B", trend: "down" }, { score: 90, letter: "A-", trend: "stable" }, { score: 86, letter: "B", trend: "down" }],
  "Ava Johnson":   [{ score: 83, letter: "B", trend: "up" }, { score: 86, letter: "B", trend: "up" }, { score: 80, letter: "B-", trend: "stable" }, { score: 82, letter: "B-", trend: "up" }, { score: 88, letter: "B+", trend: "up" }, { score: 84, letter: "B", trend: "stable" }],
  "Michael Torres":[{ score: 72, letter: "C", trend: "down" }, { score: 68, letter: "D+", trend: "down" }, { score: 75, letter: "C", trend: "stable" }, { score: 70, letter: "C-", trend: "down" }, { score: 78, letter: "C+", trend: "up" }, { score: 73, letter: "C", trend: "stable" }],
};

const studentNames = Object.keys(grades);

const subjectAverages = [
  { subject: "Math", avg: 88 },
  { subject: "Science", avg: 85 },
  { subject: "English", avg: 87 },
  { subject: "History", avg: 83 },
  { subject: "Art", avg: 91 },
  { subject: "PE", avg: 90 },
];

const letterDistribution = [
  { letter: "A+", count: 18, fill: "#22c55e" },
  { letter: "A", count: 32, fill: "#3b82f6" },
  { letter: "A-", count: 24, fill: "#60a5fa" },
  { letter: "B+", count: 28, fill: "#a78bfa" },
  { letter: "B", count: 19, fill: "#f59e0b" },
  { letter: "B-", count: 12, fill: "#fb923c" },
  { letter: "C", count: 8, fill: "#f87171" },
  { letter: "D", count: 3, fill: "#ef4444" },
  { letter: "F", count: 1, fill: "#dc2626" },
];

function letterColor(letter: string) {
  if (letter.startsWith("A")) return "text-green-600 bg-green-50";
  if (letter.startsWith("B")) return "text-blue-600 bg-blue-50";
  if (letter.startsWith("C")) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" />;
}

function scoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-orange-600";
  return "text-red-600";
}

export function Grades() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(studentNames[0]);

  const radarData = subjects.map((subject, i) => ({
    subject: subject.slice(0, 4),
    score: grades[selectedStudent]?.[i]?.score ?? 0,
    fullMark: 100,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Grades</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Spring 2026 – Q3 Report</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gradebook">Grade Book</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Class Averages */}
          <div className="grid grid-cols-6 gap-3">
            {subjectAverages.map((s) => (
              <Card key={s.subject} className="border-border">
                <CardContent className="pt-4 pb-4 text-center">
                  <div className={`text-xl ${scoreColor(s.avg)}`}>{s.avg}%</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.subject}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Letter Distribution */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={letterDistribution} barSize={22}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="letter" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {letterDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Student Radar */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Student Profile</CardTitle>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="w-40 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {studentNames.map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gradebook" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-muted-foreground px-5 py-3 sticky left-0 bg-card">Student</th>
                      {subjects.map((s) => (
                        <th key={s} className="text-center text-xs text-muted-foreground px-3 py-3 whitespace-nowrap">{s}</th>
                      ))}
                      <th className="text-center text-xs text-muted-foreground px-3 py-3">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentNames
                      .filter((n) => n.toLowerCase().includes(search.toLowerCase()))
                      .map((name) => {
                        const studentGrades = grades[name];
                        const avg = Math.round(studentGrades.reduce((s, g) => s + g.score, 0) / studentGrades.length);
                        return (
                          <tr key={name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                            <td className="px-5 py-3 sticky left-0 bg-card">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs shrink-0">
                                  {name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <span className="text-sm text-foreground whitespace-nowrap">{name}</span>
                              </div>
                            </td>
                            {studentGrades.map((g, i) => (
                              <td key={i} className="px-3 py-3 text-center">
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${letterColor(g.letter)}`}>
                                    {g.letter}
                                  </span>
                                  <div className="flex items-center gap-0.5">
                                    <span className={`text-xs ${scoreColor(g.score)}`}>{g.score}</span>
                                    <TrendIcon trend={g.trend} />
                                  </div>
                                </div>
                              </td>
                            ))}
                            <td className="px-3 py-3 text-center">
                              <span className={`text-sm font-medium ${scoreColor(avg)}`}>{avg}%</span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">At-Risk Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Michael Torres", issue: "Failing Science", score: 68, action: "Parent meeting scheduled" },
                  { name: "Ethan Brown", issue: "Missing assignments", score: 72, action: "Counselor referral" },
                  { name: "Mia Garcia", issue: "Low attendance impact", score: 74, action: "Attendance intervention" },
                ].map((s) => (
                  <div key={s.name} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs shrink-0">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{s.name}</span>
                        <span className="text-xs text-red-600">{s.score}%</span>
                      </div>
                      <p className="text-xs text-red-600 mt-0.5">{s.issue}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.action}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Honor Roll</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Emma Wilson", gpa: 3.98, distinction: "Principal's List" },
                  { name: "James Chen", gpa: 3.95, distinction: "Principal's List" },
                  { name: "Sofia Martinez", gpa: 3.91, distinction: "Honor Roll" },
                  { name: "Noah Thompson", gpa: 3.88, distinction: "Honor Roll" },
                  { name: "Olivia Lee", gpa: 3.80, distinction: "Honor Roll" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shrink-0">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{s.name}</span>
                        <span className="text-xs text-green-600">GPA {s.gpa}</span>
                      </div>
                      <span className="text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">{s.distinction}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
