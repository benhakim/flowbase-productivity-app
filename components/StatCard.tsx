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
    <Card className="shadow-md">
      <CardContent className={`p-5 min-h-[92px] ${className}`}>
        <div className="flex flex-col">
          {label && (
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pillColor} whitespace-nowrap`}>{label}</div>
          )}

          <div className="mt-3 text-3xl md:text-4xl font-extrabold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
