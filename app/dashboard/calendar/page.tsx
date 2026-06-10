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
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Calendar</div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border rounded-md px-2 py-1">
            <Button variant="ghost" size="icon" onClick={prevMonth}><Icons.ChevronLeft className="w-4 h-4"/></Button>
            <div className="text-sm font-medium px-2">{monthLabel}</div>
            <Button variant="ghost" size="icon" onClick={nextMonth}><Icons.ChevronRight className="w-4 h-4"/></Button>
          </div>

          <div className="ml-4 inline-flex items-center gap-2 bg-white border rounded-md px-2 py-1">
            <button className={cn("px-2 py-1 rounded text-sm", view === 'month' ? 'bg-rose-100 text-rose-700' : 'text-muted-foreground')} onClick={() => setView('month')}>Month</button>
            <button className={cn("px-2 py-1 rounded text-sm", view === 'week' ? 'bg-rose-100 text-rose-700' : 'text-muted-foreground')} onClick={() => setView('week')}>Week</button>
          </div>
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
                  const tasks = scheduled[key] || [];
                  return (
                    <div key={key}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropOnDate(e, key)}
                      className={cn("border rounded-md p-2 min-h-[92px] bg-white relative", !isCurrentMonth && 'opacity-50')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-sm font-medium">{day.getDate()}</div>
                        <div className="text-xs text-muted-foreground">{isCurrentMonth ? '' : ''}</div>
                      </div>

                      <div className="mt-2 space-y-1">
                        {tasks.map((t) => (
                          <div key={t.id}
                            draggable
                            onDragStart={(e) => onDragStartScheduled(e, t, key)}
                            className="flex items-center gap-2 text-sm rounded px-2 py-1"
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
                        <div className="absolute bottom-2 left-2">
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
            <CardHeader>
              <CardTitle>Draft Task Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="New task title" className="flex-1 border p-2 rounded" />
                  <select value={newTaskColor} onChange={(e) => setNewTaskColor(e.target.value)} className="text-sm p-2 border rounded">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
