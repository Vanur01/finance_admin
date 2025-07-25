import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export type DemoStatus = "scheduled" | "done" | "missed";

export const getStatusIcon = (status: DemoStatus) => {
  switch (status) {
    case "scheduled":
      return React.createElement(Clock, { className: "w-4 h-4 text-blue-500" });
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
    case "done":
      return "Done";
    case "missed":
      return "Missed";
  }
};
