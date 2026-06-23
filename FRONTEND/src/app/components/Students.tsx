import { useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const students = [
  { id: 1, name: "Emma Wilson", grade: "10A", gpa: 3.98, attendance: 98, status: "active", email: "emma.w@school.edu", phone: "555-0101", dob: "2009-03-14", guardian: "Sarah Wilson" },
  { id: 2, name: "James Chen", grade: "11B", gpa: 3.95, attendance: 96, status: "active", email: "james.c@school.edu", phone: "555-0102", dob: "2008-07-22", guardian: "Wei Chen" },
  { id: 3, name: "Sofia Martinez", grade: "9C", gpa: 3.91, attendance: 94, status: "active", email: "sofia.m@school.edu", phone: "555-0103", dob: "2010-11-08", guardian: "Carlos Martinez" },
  { id: 4, name: "Noah Thompson", grade: "12A", gpa: 3.88, attendance: 91, status: "active", email: "noah.t@school.edu", phone: "555-0104", dob: "2007-05-30", guardian: "Mark Thompson" },
  { id: 5, name: "Ava Johnson", grade: "10B", gpa: 3.72, attendance: 89, status: "active", email: "ava.j@school.edu", phone: "555-0105", dob: "2009-09-17", guardian: "Lisa Johnson" },
  { id: 6, name: "Michael Torres", grade: "11A", gpa: 3.61, attendance: 78, status: "at-risk", email: "michael.t@school.edu", phone: "555-0106", dob: "2008-02-04", guardian: "Ana Torres" },
  { id: 7, name: "Isabella Davis", grade: "9A", gpa: 3.55, attendance: 92, status: "active", email: "isabella.d@school.edu", phone: "555-0107", dob: "2010-06-12", guardian: "John Davis" },
  { id: 8, name: "Liam Anderson", grade: "12B", gpa: 3.40, attendance: 85, status: "active", email: "liam.a@school.edu", phone: "555-0108", dob: "2007-12-01", guardian: "Robert Anderson" },
  { id: 9, name: "Mia Garcia", grade: "10C", gpa: 3.28, attendance: 72, status: "at-risk", email: "mia.g@school.edu", phone: "555-0109", dob: "2009-08-25", guardian: "Elena Garcia" },
  { id: 10, name: "Ethan Brown", grade: "9B", gpa: 2.95, attendance: 68, status: "suspended", email: "ethan.b@school.edu", phone: "555-0110", dob: "2010-04-19", guardian: "David Brown" },
  { id: 11, name: "Olivia Lee", grade: "11C", gpa: 3.80, attendance: 97, status: "active", email: "olivia.l@school.edu", phone: "555-0111", dob: "2008-10-07", guardian: "Kevin Lee" },
  { id: 12, name: "William Clark", grade: "12C", gpa: 3.15, attendance: 88, status: "active", email: "william.c@school.edu", phone: "555-0112", dob: "2007-01-28", guardian: "Patricia Clark" },
];

function statusColor(status: string) {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "at-risk") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

function gpaColor(gpa: number) {
  if (gpa >= 3.7) return "text-green-600";
  if (gpa >= 3.0) return "text-blue-600";
  if (gpa >= 2.0) return "text-orange-600";
  return "text-red-600";
}

function attendanceBadge(rate: number) {
  if (rate >= 90) return "text-green-600";
  if (rate >= 80) return "text-orange-500";
  return "text-red-600";
}

export function Students() {
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<(typeof students)[0] | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchGrade = filterGrade === "all" || s.grade.startsWith(filterGrade);
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchGrade && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Students</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} students found</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", count: students.filter((s) => s.status === "active").length, color: "text-green-600", bg: "bg-green-50" },
          { label: "At Risk", count: students.filter((s) => s.status === "at-risk").length, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Suspended", count: students.filter((s) => s.status === "suspended").length, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className={`pt-4 pb-4 px-5 ${stat.bg} rounded-lg`}>
              <div className={`text-2xl ${stat.color}`}>{stat.count}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{stat.label} Students</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border">
        <CardContent className="pt-0 px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground px-5 py-3">Student</th>
                  <th className="text-left text-xs text-muted-foreground px-4 py-3">Grade</th>
                  <th className="text-left text-xs text-muted-foreground px-4 py-3">GPA</th>
                  <th className="text-left text-xs text-muted-foreground px-4 py-3">Attendance</th>
                  <th className="text-left text-xs text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left text-xs text-muted-foreground px-4 py-3">Contact</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => setSelected(s)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {s.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm text-foreground">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-foreground">{s.grade}</td>
                    <td className={`px-4 py-3.5 text-sm font-medium ${gpaColor(s.gpa)}`}>{s.gpa}</td>
                    <td className={`px-4 py-3.5 text-sm font-medium ${attendanceBadge(s.attendance)}`}>
                      {s.attendance}%
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColor(s.status)}`}>
                        {s.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button
                          className="p-1.5 rounded hover:bg-accent transition-colors"
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-accent transition-colors"
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1.5 rounded hover:bg-accent transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelected(s)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Student</DropdownMenuItem>
                          <DropdownMenuItem>View Grades</DropdownMenuItem>
                          <DropdownMenuItem>View Attendance</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove Student</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                  {selected.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-foreground">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">Grade {selected.grade}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(selected.status)}`}>
                    {selected.status.replace("-", " ")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "GPA", value: selected.gpa.toString(), color: gpaColor(selected.gpa) },
                  { label: "Attendance", value: `${selected.attendance}%`, color: attendanceBadge(selected.attendance) },
                  { label: "Email", value: selected.email, color: "text-foreground" },
                  { label: "Phone", value: selected.phone, color: "text-foreground" },
                  { label: "Date of Birth", value: selected.dob, color: "text-foreground" },
                  { label: "Guardian", value: selected.guardian, color: "text-foreground" },
                ].map((field) => (
                  <div key={field.label} className="bg-accent/40 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-0.5">{field.label}</div>
                    <div className={`text-sm ${field.color}`}>{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">First Name</Label>
                <Input placeholder="First name" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Last Name</Label>
                <Input placeholder="Last name" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Email</Label>
              <Input placeholder="student@school.edu" type="email" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Grade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9A">9A</SelectItem>
                    <SelectItem value="9B">9B</SelectItem>
                    <SelectItem value="10A">10A</SelectItem>
                    <SelectItem value="10B">10B</SelectItem>
                    <SelectItem value="11A">11A</SelectItem>
                    <SelectItem value="12A">12A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Date of Birth</Label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Guardian Name</Label>
              <Input placeholder="Guardian name" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddOpen(false)}>Add Student</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
