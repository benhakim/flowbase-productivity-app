"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  category?: string;
  color?: string; // Tailwind bg color class
};

function getMonthGrid(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const defaultDrafts: Task[] = [
  { id: "d-1", title: "Design review", category: "meeting", color: "bg-rose-500" },
  { id: "d-2", title: "Sprint notes", category: "notes", color: "bg-emerald-500" },
  { id: "d-3", title: "Whiteboard ideas", category: "ideas", color: "bg-amber-500" },
];

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week">("month");
  const [displayDate, setDisplayDate] = useState(new Date());
  const days = useMemo(() => getMonthGrid(displayDate), [displayDate]);

  const [drafts, setDrafts] = useState<Task[]>(defaultDrafts);
  const [scheduled, setScheduled] = useState<Record<string, Task[]>>({});
  const [creatingDate, setCreatingDate] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskColor, setNewTaskColor] = useState("bg-rose-500");

  const monthLabel = displayDate.toLocaleString(undefined, { month: "long", year: "numeric" });
  const todayKey = new Date().toISOString().slice(0, 10);

  function dateKey(d: Date) {
    return d.toISOString().slice(0, 10);
  }

  function prevMonth() {
    setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function onDragStartDraft(e: React.DragEvent, task: Task) {
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "draft", task }));
  }

  function onDragStartScheduled(e: React.DragEvent, task: Task, fromKey: string) {
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "scheduled", task, from: fromKey }));
  }

  function handleDropOnDate(e: React.DragEvent, targetKey: string) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;
    try {
      const payload = JSON.parse(raw);
      if (payload.type === "draft") {
        const task: Task = { ...payload.task, id: payload.task.id || String(Date.now()) };
        setScheduled((s) => ({ ...(s || {}), [targetKey]: [...(s[targetKey] || []), task] }));
        setDrafts((ds) => ds.filter((t) => t.id !== payload.task.id));
      } else if (payload.type === "scheduled") {
        const { task, from } = payload;
        setScheduled((s) => {
          const copy = { ...(s || {}) };
          copy[from] = (copy[from] || []).filter((t: Task) => t.id !== task.id);
          copy[targetKey] = [...(copy[targetKey] || []), task];
          return copy;
        });
      }
    } catch (err) {
      // ignore
    }
  }

  function handleAddTaskToDate(dateKey: string) {
    if (!newTaskTitle.trim()) return;
    const task: Task = { id: String(Date.now()), title: newTaskTitle.trim(), color: newTaskColor };
    setScheduled((s) => ({ ...(s || {}), [dateKey]: [...(s[dateKey] || []), task] }));
    setNewTaskTitle("");
    setCreatingDate(null);
  }

  function handleAddDraft() {
    if (!newTaskTitle.trim()) return;
    const task: Task = { id: String(Date.now()), title: newTaskTitle.trim(), color: newTaskColor };
    setDrafts((d) => [task, ...d]);
    setNewTaskTitle("");
  }

  return (
    <div className="space-y-6 w-full max-w-6xl">
      <header className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md p-2 bg-rose-500 text-white flex items-center justify-center">
            <Icons.Calendar className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <div className="font-semibold text-sm">Calendar</div>
            <div className="text-xs text-muted-foreground mt-0.5">Workspace</div>
          </div>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{monthLabel}</h1>
          <div className="text-sm text-slate-700 mt-1 font-semibold">Drop drafts or scheduled items onto any date.</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white border rounded-md px-3 py-1 shadow-sm">
            <button className={cn("text-sm px-3 py-1 rounded-md", view === 'month' ? 'bg-rose-100 text-rose-700' : 'text-muted-foreground')} onClick={() => setView('month')}>Month</button>
            <button className={cn("text-sm px-3 py-1 rounded-md", view === 'week' ? 'bg-rose-100 text-rose-700' : 'text-muted-foreground')} onClick={() => setView('week')}>Week</button>
            <button className="ml-2 text-sm px-3 py-1 rounded-md bg-white border" onClick={() => setDisplayDate(new Date())}>Today</button>
          </div>

          <div className="inline-flex items-center gap-2 bg-white border rounded-md px-2 py-1">
            <button className="p-1" onClick={prevMonth}><Icons.ChevronLeft className="w-4 h-4"/></button>
            <button className="p-1" onClick={nextMonth}><Icons.ChevronRight className="w-4 h-4"/></button>
          </div>

          <button className="bg-rose-600 text-white px-4 py-2 rounded-md">+ New task</button>
        </div>
      </header>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {WEEK_DAYS.map((d) => (
                  <div key={d} className="text-xs text-muted-foreground text-center">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const key = dateKey(day);
                  const isCurrentMonth = day.getMonth() === displayDate.getMonth();
                  const isToday = key === todayKey;
                  const tasks = scheduled[key] || [];
                  return (
                    <div key={key}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropOnDate(e, key)}
                      className={cn(
                        "rounded-md p-2 min-h-[80px] md:min-h-[96px] bg-white relative shadow-sm",
                        !isCurrentMonth && 'opacity-50',
                        isToday && 'ring-1 ring-rose-100'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-sm font-medium text-slate-700">{day.getDate()}</div>
                        <div className="text-xs text-muted-foreground">{isCurrentMonth ? '' : ''}</div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {tasks.map((t) => (
                          <div key={t.id}
                            draggable
                            onDragStart={(e) => onDragStartScheduled(e, t, key)}
                            className="flex items-center gap-2 text-sm rounded px-2 py-1 bg-slate-50"
                          >
                            <span className={cn('w-2 h-2 rounded-full shrink-0', t.color)} />
                            <span className="truncate">{t.title}</span>
                          </div>
                        ))}
                      </div>

                      {creatingDate === key ? (
                        <div className="absolute inset-2 bg-white p-2 rounded-md shadow-md">
                          <input autoFocus value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Task title" className="w-full border p-1 rounded mb-2" />
                          <div className="flex items-center gap-2">
                            <select value={newTaskColor} onChange={(e) => setNewTaskColor(e.target.value)} className="text-sm p-1 border rounded">
                              <option value="bg-rose-500">Red</option>
                              <option value="bg-emerald-500">Green</option>
                              <option value="bg-amber-500">Amber</option>
                              <option value="bg-sky-500">Sky</option>
                            </select>
                            <Button onClick={() => handleAddTaskToDate(key)}>Add</Button>
                            <Button variant="ghost" onClick={() => setCreatingDate(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute bottom-3 left-3">
                          <button className="text-xs text-muted-foreground" onClick={() => setCreatingDate(key)}>+ Add</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="w-80">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Draft Task Panel</CardTitle>
              <div className="flex items-center gap-2">
                <button className="text-sm px-3 py-1 rounded-md border bg-white" onClick={() => { /* open add draft UI */ }}>+ Add draft</button>
                <div className="rounded-full bg-rose-100 text-rose-700 px-2 py-1 text-xs">{drafts.length}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="New task title" className="flex-1 min-w-0 border p-2 rounded" />
                  <select value={newTaskColor} onChange={(e) => setNewTaskColor(e.target.value)} className="text-sm p-2 border rounded w-28 shrink-0">
                    <option value="bg-rose-500">Red</option>
                    <option value="bg-emerald-500">Green</option>
                    <option value="bg-amber-500">Amber</option>
                    <option value="bg-sky-500">Sky</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddDraft}>Save draft</Button>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-2">Drafts</div>
                  {drafts.length === 0 ? (
                    <div className="border-2 border-dashed border-muted rounded-md p-6 text-center text-sm text-muted-foreground">
                      <Icons.Inbox className="mx-auto mb-2 w-6 h-6 text-muted-foreground" />
                      No drafts waiting
                      <div className="text-xs text-muted-foreground mt-2">Save unscheduled tasks here, then drag them onto a date.</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {drafts.map((d) => (
                        <div key={d.id} draggable onDragStart={(e) => onDragStartDraft(e, d)} className="flex items-center gap-3 p-2 border rounded bg-white">
                          <div className={cn('w-8 h-8 rounded flex items-center justify-center text-white', d.color)}>
                            <Icons.FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-sm">{d.title}</div>
                          <button className="text-xs text-muted-foreground" onClick={() => setDrafts((s) => s.filter(x => x.id !== d.id))}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
