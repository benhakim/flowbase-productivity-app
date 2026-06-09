"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  color?: string;
};

const MENU: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "Home", href: "/dashboard", color: "bg-sky-500" },
  { id: "ai", label: "AI Assistant", icon: "Cpu", href: "/dashboard/ai", color: "bg-violet-500" },
  { id: "calendar", label: "Calendar", icon: "Calendar", href: "/dashboard/calendar", color: "bg-rose-500" },
  { id: "tasks", label: "Task / Kanban", icon: "CheckSquare", href: "/dashboard/tasks", color: "bg-amber-500" },
  { id: "notes", label: "Notes", icon: "FileText", href: "/dashboard/notes", color: "bg-green-500" },
  { id: "whiteboard", label: "Whiteboard", icon: "Layout", href: "/dashboard/whiteboard", color: "bg-fuchsia-500" },
  { id: "pages", label: "Pages / Spaces", icon: "Layers", href: "/dashboard/pages", color: "bg-indigo-500" },
  { id: "templates", label: "AI Template Builder", icon: "Zap", href: "/dashboard/templates", color: "bg-pink-500" },
  { id: "settings", label: "Settings", icon: "Settings", href: "/dashboard/settings", color: "bg-gray-600" },
];

const FallbackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("sidebar-collapsed");
      setCollapsed(v === "true");
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    } catch (e) {
      // ignore
    }
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-background border-r border-border transition-all duration-200",
        collapsed ? "w-20" : "w-64"
      )}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="flex items-center gap-2">
            <div className="rounded-md p-2 bg-primary text-primary-foreground flex items-center justify-center">
              <span className="font-extrabold text-sm">FB</span>
            </div>
            {!collapsed && <span className="font-semibold text-sm">FlowBase</span>}
          </div>
        </div>

        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((s) => !s)}
          className="p-1 rounded hover:bg-accent"
        >
          {(() => {
            const Icon = (Icons as any)[collapsed ? "ChevronRight" : "ChevronLeft"] ?? FallbackIcon;
            return <Icon className="w-5 h-5 text-muted-foreground" />;
          })()}
        </button>
      </div>

      <nav className="flex-1 overflow-auto">
        <ul className="space-y-1 p-2">
          {MENU.map((item) => {
            const IconComp = (Icons as any)[item.icon] ?? FallbackIcon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href || '#'}
                  className={cn(
                    "group flex items-center gap-3 p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <div className={cn("w-8 h-8 flex items-center justify-center rounded-md", item.color)}>
                    <IconComp className="w-4 h-4 text-white" />
                  </div>
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="text-sm text-muted-foreground">
            <div>Signed in as</div>
            <div className="font-semibold">Your Name</div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center">© FB</div>
        )}
      </div>
    </aside>
  );
}
