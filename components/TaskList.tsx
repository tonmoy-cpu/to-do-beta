"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, fetchWeather, toggleTaskCompletion } from "@/redux/actions";
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
}

const TaskList: React.FC<TaskListProps> = ({
  activeTab,
  pendingReminders,
  setPendingReminders,
  playingReminders,
  setPlayingReminders,
}) => {
  const tasks = useSelector((state: RootState) => state.tasks);
  const weather = useSelector((state: RootState) => state.weather);
  const dispatch = useDispatch<AppDispatch>();

  // Remove localStorage sync, rely on redux-persist
  useEffect(() => {
    console.log("Tasks loaded from Redux state:", tasks.map(t => ({ id: t.id, title: t.title, completed: t.completed })));
    tasks.forEach((task: Task) => {
      if (task.category === "outdoor" && !weather[task.location]) {
        dispatch(fetchWeather(task.location));
      }
    });
  }, [dispatch, tasks, weather]);

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

  const filteredTasks = tasks.filter((task: Task) => {
    if (activeTab === "home" || activeTab === "inbox") return true;
    if (activeTab === "today") return task.reminder && new Date(task.reminder).toDateString() === new Date().toDateString();
    if (activeTab === "upcoming") return task.reminder && new Date(task.reminder) > new Date();
    if (activeTab === "important") return task.priority === "high";
    return false;
  });

  return (
    <ul>
      {filteredTasks.map((task: Task) => {
        const taskWeather: Weather | undefined = weather[task.location];
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
                {task.category === "outdoor" && taskWeather && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {taskWeather.error
                      ? "Weather unavailable"
                      : `Weather: ${taskWeather.main.temp}°C, ${taskWeather.weather[0].description}`}
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