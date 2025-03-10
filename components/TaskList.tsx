"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, toggleTaskCompletion } from "@/redux/actions";
import { RootState, AppDispatch } from "@/redux/store";
import TaskOptions from "@/components/TaskOptions";
import { Task } from "@/types/task";
import { Weather } from "@/types/weather";

interface TaskListProps {
  activeTab: string;
  pendingReminders: Set<string>;
  setPendingReminders: React.Dispatch<React.SetStateAction<Set<string>>>;
  playingReminders: Map<string, HTMLAudioElement>;
  setPlayingReminders: React.Dispatch<React.SetStateAction<Map<string, HTMLAudioElement>>>;
  filteredTasks: Task[]; // New prop for filtered tasks
}

const TaskList: React.FC<TaskListProps> = ({
  activeTab,
  pendingReminders,
  setPendingReminders,
  playingReminders,
  setPlayingReminders,
  filteredTasks, // Accept filtered tasks from parent
}) => {
  const tasks = useSelector((state: RootState) => state.tasks); // Still needed for weather reference
  const weather = useSelector((state: RootState) => state.weather);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("Tasks loaded from Redux state:", tasks.map(t => ({ id: t.id, title: t.title, completed: t.completed, location: t.location })));
    console.log("Current weather state:", weather);
    console.log("Filtered tasks received:", filteredTasks.map(t => ({ id: t.id, title: t.title })));
  }, [tasks, weather, filteredTasks]);

  const handleDeleteTask = (taskId: string) => {
    console.log("Deleting task with ID:", taskId);
    const audio = playingReminders.get(taskId);
    if (audio) {
      console.log("Stopping audio for deleted task ID:", taskId);
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
      setPlayingReminders((prev) => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        console.log("Updated playingReminders after delete:", Array.from(newMap.entries()));
        return newMap;
      });
    }
    setPendingReminders((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(taskId);
      console.log("Updated pendingReminders after delete:", Array.from(updatedSet));
      return updatedSet;
    });
    dispatch(deleteTask(taskId));
  };

  const handleToggleCompletion = (taskId: string) => {
    console.log("Toggling completion for task ID:", taskId);
    const audio = playingReminders.get(taskId);
    if (audio) {
      console.log("Stopping audio for completed task ID:", taskId);
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
      setPlayingReminders((prev) => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        console.log("Updated playingReminders after completion:", Array.from(newMap.entries()));
        return newMap;
      });
    }
    setPendingReminders((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(taskId);
      console.log("Updated pendingReminders after completion:", Array.from(updatedSet));
      return updatedSet;
    });
    dispatch(toggleTaskCompletion(taskId));
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain") || desc.includes("shower")) return "🌧️";
    if (desc.includes("thunder")) return "⛈️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
    return "🌡️";
  };

  return (
    <ul>
      {filteredTasks.map((task: Task) => {
        const taskWeather = task.location ? weather[task.location] : undefined;
        return (
          <li
            key={task.id}
            className={`flex justify-between items-center border-b p-2 task-${task.priority} ${
              task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
            }`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleCompletion(task.id)}
                className="mr-2"
              />
              <div>
                <span className="text-black dark:text-black">
                  {task.title} ({task.category})
                </span>
                {task.category === "outdoor" && task.location && (
                  <p className="text-sm mt-1">
                    {taskWeather ? (
                      "error" in taskWeather ? (
                        <span className="weather-highlight">
                          Weather: {taskWeather.error}
                        </span>
                      ) : (
                        <span className="weather-highlight">
                          {getWeatherIcon(taskWeather.weather[0].description)}{" "}
                          {taskWeather.main.temp}°C, {taskWeather.weather[0].description}
                        </span>
                      )
                    ) : (
                      <span className="weather-highlight">Fetching weather...</span>
                    )}
                  </p>
                )}
                {task.reminder && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: {new Date(task.reminder).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TaskOptions task={task} />
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TaskList;