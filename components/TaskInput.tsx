"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addTask } from "@/redux/actions";
import { AppDispatch } from "@/redux/store";
import { Task } from "@/types/task";

const TaskInput: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [reminder, setReminder] = useState("");
  const [category, setCategory] = useState("indoor");
  const [priority, setPriority] = useState("low");
  const [location, setLocation] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(), // Unique ID based on timestamp
        title: title.trim(),
        reminder: reminder || null,
        completed: false, // Explicitly set to false
        category: category as "indoor" | "outdoor",
        priority: priority as "low" | "medium" | "high",
        location: category === "outdoor" ? location : "",
      };
      console.log("Adding new task:", newTask);
      dispatch(addTask(newTask));
      setTitle("");
      setReminder("");
      setCategory("indoor");
      setPriority("low");
      setLocation("");
      onClose();
    }
  };

  return (
    <div className="mb-6 bg-white dark:bg-[#242424] p-4 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full p-2 border rounded text-[#1b281b] dark:text-white bg-transparent"
        />
        <input
          type="datetime-local"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          className="w-full p-2 border rounded text-[#1b281b] dark:text-white bg-transparent"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded text-[#1b281b] dark:text-white bg-transparent dark:bg-[#2c2c2c] appearance-none"
        >
          <option value="indoor" className="bg-white dark:bg-[#2c2c2c] text-[#1b281b] dark:text-white">
            Indoor
          </option>
          <option value="outdoor" className="bg-white dark:bg-[#2c2c2c] text-[#1b281b] dark:text-white">
            Outdoor
          </option>
        </select>
        {category === "outdoor" && (
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 border rounded text-[#1b281b] dark:text-white bg-transparent"
          />
        )}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded text-[#1b281b] dark:text-white bg-transparent"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#3f9142] hover:bg-[#357937] text-white">
            <Plus size={16} className="mr-2" /> Add Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;