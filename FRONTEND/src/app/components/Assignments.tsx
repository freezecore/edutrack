import { useState } from "react";
import { Plus, Clock, CheckCircle2, AlertCircle, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  status: "active" | "graded" | "overdue";
  submissions: number;
  total: number;
  maxScore: number;
  avgScore?: number;
  description: string;
}

const assignments: Assignment[] = [
  { id: 1, title: "Quadratic Equations Problem Set", subject: "Mathematics", class: "10A", dueDate: "2026-06-10", status: "active", submissions: 22, total: 30, maxScore: 100, description: "Solve problems 1-20 from Chapter 5. Show all work." },
  { id: 2, title: "History Essay – Industrial Revolution", subject: "History", class: "11B", dueDate: "2026-06-09", status: "overdue", submissions: 18, total: 28, maxScore: 50, description: "Write a 1500-word essay on the social impact of the Industrial Revolution." },
  { id: 3, title: "Biology Lab Report – Cell Division", subject: "Science", class: "9C", dueDate: "2026-06-12", status: "active", submissions: 8, total: 29, maxScore: 75, description: "Document your observations from the mitosis lab. Include diagrams." },
  { id: 4, title: "Literary Analysis – To Kill a Mockingbird", subject: "English", class: "11A", dueDate: "2026-06-05", status: "graded", submissions: 29, total: 29, maxScore: 100, avgScore: 84, description: "Analyze the themes of justice and morality in the novel." },
  { id: 5, title: "Art Portfolio Review", subject: "Art", class: "10B", dueDate: "2026-06-15", status: "active", submissions: 5, total: 26, maxScore: 100, description: "Submit your semester portfolio with 8 completed works." },
  { id: 6, title: "Physics Problem Set – Newton's Laws", subject: "Science", class: "12A", dueDate: "2026-06-08", status: "graded", submissions: 22, total: 22, maxScore: 80, avgScore: 71, description: "Problems from Chapter 4 on force and motion." },
];

function statusMeta(status: Assignment["status"]) {
  if (status === "active") return { label: "Active", color: "bg-blue-100 text-blue-700", icon: Clock };
  if (status === "graded") return { label: "Graded", color: "bg-green-100 text-green-700", icon: CheckCircle2 };
  return { label: "Overdue", color: "bg-red-100 text-red-700", icon: AlertCircle };
}

export function Assignments() {
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = assignments.filter(
    (a) => filter === "all" || a.status === filter
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Assignments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{assignments.length} total assignments</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", count: assignments.filter((a) => a.status === "active").length, color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
          { label: "Overdue", count: assignments.filter((a) => a.status === "overdue").length, color: "text-red-600", bg: "bg-red-50", icon: AlertCircle },
          { label: "Graded", count: assignments.filter((a) => a.status === "graded").length, color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="pt-4 pb-4 px-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className={`text-2xl ${stat.color}`}>{stat.count}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((a) => {
              const meta = statusMeta(a.status);
              const Icon = meta.icon;
              const submissionPct = Math.round((a.submissions / a.total) * 100);
              return (
                <Card
                  key={a.id}
                  className="border-border hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => setSelected(a)}
                >
                  <CardContent className="pt-4 pb-4 px-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-foreground truncate pr-2">{a.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-0">{a.subject}</Badge>
                          <span className="text-xs text-muted-foreground">Class {a.class}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full shrink-0 ${meta.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {meta.label}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{a.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Submissions</span>
                        <span className="text-foreground">{a.submissions}/{a.total} ({submissionPct}%)</span>
                      </div>
                      <Progress value={submissionPct} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Due: {a.dueDate}
                      </div>
                      {a.avgScore !== undefined && (
                        <span className="text-xs text-green-600">Avg: {a.avgScore}/{a.maxScore}</span>
                      )}
                      <span className="text-xs text-muted-foreground">Max: {a.maxScore}pts</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Assignment Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="secondary">{selected.subject}</Badge>
                <Badge variant="secondary">Class {selected.class}</Badge>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusMeta(selected.status).color}`}>
                  {statusMeta(selected.status).label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Due Date", value: selected.dueDate },
                  { label: "Max Score", value: `${selected.maxScore} pts` },
                  { label: "Submissions", value: `${selected.submissions} / ${selected.total}` },
                  { label: "Avg Score", value: selected.avgScore ? `${selected.avgScore} pts` : "Not graded" },
                ].map((f) => (
                  <div key={f.label} className="bg-accent/40 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">{f.label}</div>
                    <div className="text-sm text-foreground mt-0.5">{f.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Submission progress</span>
                  <span>{Math.round((selected.submissions / selected.total) * 100)}%</span>
                </div>
                <Progress value={(selected.submissions / selected.total) * 100} className="h-2" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm">Edit</Button>
                <Button size="sm">View Submissions</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Assignment Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Title</Label>
              <Input placeholder="Assignment title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mathematics", "Science", "English", "History", "Art", "PE"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {["9A","9B","9C","10A","10B","10C","11A","11B","11C","12A","12B","12C"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Due Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Max Score</Label>
                <Input type="number" placeholder="100" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
              <textarea
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                rows={3}
                placeholder="Assignment instructions..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddOpen(false)}>Create Assignment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
