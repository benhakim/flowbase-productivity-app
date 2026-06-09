"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label?: string;
  value: React.ReactNode;
  pillColor?: string; // tailwind classes for pill bg and text
  className?: string;
}

export default function StatCard({ label, value, pillColor = "bg-rose-50 text-rose-700", className = "" }: StatCardProps) {
  return (
    <Card>
      <CardContent className={`p-4 ${className}`}>
        <div className="flex flex-col">
          {label && (
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pillColor}`}>
              {label}
            </div>
          )}

          <div className="mt-3 text-3xl md:text-4xl font-extrabold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
