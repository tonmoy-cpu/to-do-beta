"use client";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateTask } from "@/redux/actions"; // Updated import
import { AppDispatch } from "@/redux/store";
import { Task } from "@/types/task";
import calendarService from "@/services/calendarService";
import { cn } from "@/lib/utils"; // Import cn from lib/utils

const TaskOptions = ({ task }: { task: Task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleEdit = (field: keyof Task, value: string | null) => {
    // Dispatch updateTask with taskId and the updated field
    if (value !== null) {
      const updatedFields: Partial<Task> = { [field]: value };
      dispatch(updateTask(task.id, updatedFields));
    }
    setIsOpen(false);
  };

  const handleAddToCalendar = () => {
    const calendarUrl = calendarService.addToCalendar(task);
    if (calendarUrl) {
      window.open(calendarUrl, "_blank");
    } else {
      alert("Cannot add to calendar: No reminder set for this task.");
    }
    setIsOpen(false);
  };

  // Determine base color based on priority and theme
  const getIconColor = () => {
    switch (task.priority) {
      case "high":
        return "text-red-500 dark:text-red-400"; // Red for high priority, lighter in dark mode
      case "medium":
        return "text-yellow-500 dark:text-yellow-400"; // Yellow for medium priority
      case "low":
        return "text-gray-500 dark:text-gray-400"; // Gray for low priority
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("p-1 rounded-md hover:bg-gray-200 dark:hover:bg-[#2c2c2c]", getIconColor())}
      >
        <MoreHorizontal size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#2c2c2c] rounded shadow-lg z-10">
          <button
            onClick={() => handleEdit("reminder", prompt("Set reminder (YYYY-MM-DDTHH:MM)", task.reminder || ""))}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-[#1b281b] dark:text-white"
          >
            Set Reminder
          </button>
          <button
            onClick={() => handleEdit("reminder", prompt("Set due date (YYYY-MM-DDTHH:MM)", task.reminder || ""))}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-[#1b281b] dark:text-white"
          >
            Due Date
          </button>
          <button
            onClick={() =>
              handleEdit(
                "priority",
                prompt("Set priority (high, medium, low)", task.priority) as "low" | "medium" | "high" | null
              )
            }
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-[#1b281b] dark:text-white"
          >
            Set Priority
          </button>
          <button
            onClick={() => handleEdit("title", prompt("Edit task", task.title))}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-[#1b281b] dark:text-white"
          >
            Edit Task
          </button>
          <button
            onClick={handleAddToCalendar}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-[#1b281b] dark:text-white"
          >
            Add to Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskOptions;