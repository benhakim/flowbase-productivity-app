import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div className="max-w-3xl">
          <div className="text-sm text-muted-foreground">Dashboard</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Plan, write, and map your work in one calm place.</h1>
          <p className="text-muted-foreground mt-3">A focused home for tasks, notes, whiteboards, pages, and AI-assisted workflows.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-white border rounded-md">Today</button>
          <button className="px-4 py-2 bg-rose-600 text-white rounded-md shadow">+ New space</button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Open tasks" value={24} pillColor="bg-rose-50 text-rose-700" />
        <StatCard label="Notes drafted" value={18} pillColor="bg-green-50 text-green-700" />
        <StatCard label="Spaces active" value={7} pillColor="bg-amber-50 text-amber-700" />
        <StatCard label="AI templates" value={12} pillColor="bg-violet-50 text-violet-700" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace pulse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-md border p-4">Design review<div className="text-xs text-muted-foreground mt-2">Today</div></div>
                <div className="rounded-md border p-4">Sprint notes<div className="text-xs text-muted-foreground mt-2">2 drafts</div></div>
                <div className="rounded-md border p-4">Whiteboard ideas<div className="text-xs text-muted-foreground mt-2">14 objects</div></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Product roadmap board updated</li>
                <li>AI summarized weekly planning notes</li>
                <li>Calendar focus block moved to 2:00 PM</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Product roadmap board updated</li>
                <li>AI summarized weekly planning notes</li>
                <li>Calendar focus block moved to 2:00 PM</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
