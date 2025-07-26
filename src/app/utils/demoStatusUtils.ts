import React from "react";
import { Clock, CheckCircle2, XCircle, Calendar, AlertCircle } from "lucide-react";

export type DemoStatus = "scheduled" | "rescheduled" | "cancelled" | "done" | "missed";

export const getStatusIcon = (status: DemoStatus) => {
  switch (status) {
    case "scheduled":
      return React.createElement(Clock, { className: "w-4 h-4 text-blue-500" });
    case "rescheduled":
      return React.createElement(Calendar, { className: "w-4 h-4 text-yellow-500" });
    case "cancelled":
      return React.createElement(AlertCircle, { className: "w-4 h-4 text-orange-500" });
    case "done":
      return React.createElement(CheckCircle2, { className: "w-4 h-4 text-green-500" });
    case "missed":
      return React.createElement(XCircle, { className: "w-4 h-4 text-red-500" });
  }
};

export const getStatusText = (status: DemoStatus) => {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "rescheduled":
      return "Rescheduled";
    case "cancelled":
      return "Cancelled";
    case "done":
      return "Done";
    case "missed":
      return "Missed";
  }
};
