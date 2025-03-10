"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Home,
  Inbox,
  Menu,
  Plus,
  Search,
  Settings,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { RootState, AppDispatch } from "@/redux/store";
import { updateTask, login } from "@/redux/actions";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";

export default function TaskManager() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const user = useSelector((state: RootState) => state.auth.user);
  const users = useSelector((state: RootState) => state.auth.users || []);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [pendingReminders, setPendingReminders] = useState<Set<string>>(new Set());
  const [playingReminders, setPlayingReminders] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentUser = users.find((u) => u.username === user);

  useEffect(() => {
    console.log("User state updated to:", user);
    if (!mounted || user === null) {
      console.log("User is null or not mounted, redirecting to login...");
      router.push("/login");
    }
  }, [user, router, mounted]);

  useEffect(() => {
    console.log("Theme changed to:", theme);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const newReminders: string[] = [];
    tasks.forEach((task) => {
      if (
        task.reminder &&
        new Date(task.reminder) <= new Date() &&
        !task.completed &&
        !pendingReminders.has(task.id)
      ) {
        console.log(`Reminder triggered for: ${task.title} with ID: ${task.id}`);
        newReminders.push(task.id);

        if (!playingReminders.has(task.id)) {
          const audio = new Audio("/sounds/alert.mp3");
          audio.loop = true;
          setPlayingReminders((prev) => {
            const newMap = new Map(prev);
            newMap.set(task.id, audio);
            console.log("Added audio to playingReminders for task ID:", task.id);
            return newMap;
          });
          audio.onerror = () => {
            console.error(`Failed to load audio for ${task.title}: File may be missing or unsupported. Ensure 'alert.mp3' is in public/sounds/`);
            setPlayingReminders((prev) => {
              const newMap = new Map(prev);
              newMap.delete(task.id);
              console.log("Removed audio from playingReminders due to error for task ID:", task.id);
              return newMap;
            });
          };
          audio.onloadeddata = () => {
            audio
              .play()
              .then(() => {
                console.log(`Playing reminder for ${task.title} with ID: ${task.id}`);
                if (Notification.permission === "granted") {
                  new Notification(`Reminder: ${task.title}`, {
                    body: `Due: ${new Date(task.reminder).toLocaleString()}\nSound is playing.`,
                  });
                } else if (Notification.permission !== "denied") {
                  Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                      new Notification(`Reminder: ${task.title}`, {
                        body: `Due: ${new Date(task.reminder).toLocaleString()}\nSound is playing.`,
                      });
                    }
                  });
                }
              })
              .catch((err) => {
                console.error(`Failed to play audio for ${task.title}:`, err);
                setPlayingReminders((prev) => {
                  const newMap = new Map(prev);
                  newMap.delete(task.id);
                  console.log("Removed audio from playingReminders due to play error for task ID:", task.id);
                  return newMap;
                });
              });
          };
        }
      }
    });

    if (newReminders.length > 0) {
      setPendingReminders((prev) => {
        const updatedSet = new Set(prev);
        newReminders.forEach((id) => updatedSet.add(id));
        console.log("Updated pendingReminders:", Array.from(updatedSet));
        return updatedSet;
      });
    }
  }, [tasks, pendingReminders, playingReminders]);

  useEffect(() => {
    tasks.forEach((task) => {
      if (task.completed && (pendingReminders.has(task.id) || playingReminders.has(task.id))) {
        console.log(`Task ${task.id} is completed, cleaning up reminder and audio`);
        const audio = playingReminders.get(task.id);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          audio.loop = false;
          setPlayingReminders((prev) => {
            const newMap = new Map(prev);
            newMap.delete(task.id);
            console.log("Updated playingReminders after completion:", Array.from(newMap.entries()));
            return newMap;
          });
        }
        setPendingReminders((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(task.id);
          console.log("Updated pendingReminders after completion:", Array.from(updatedSet));
          return updatedSet;
        });
      }
    });
  }, [tasks, pendingReminders, playingReminders]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setPendingReminders((prev) => {
        const updatedSet = new Set(prev);
        let updated = false;
        prev.forEach((taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (!task) {
            updatedSet.delete(taskId);
            updated = true;
            const audio = playingReminders.get(taskId);
            if (audio) {
              audio.pause();
              audio.currentTime = 0;
              audio.loop = false;
              setPlayingReminders((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.delete(taskId);
                console.log("Updated playingReminders after deletion:", Array.from(newMap.entries()));
                return newMap;
              });
            }
          } else if (task.reminder) {
            const reminderTime = new Date(task.reminder);
            if (task.completed || (now.getTime() - reminderTime.getTime() > 60 * 1000)) {
              updatedSet.delete(taskId);
              updated = true;
              const audio = playingReminders.get(taskId);
              if (audio) {
                audio.pause();
                audio.currentTime = 0;
                audio.loop = false;
                setPlayingReminders((prevMap) => {
                  const newMap = new Map(prevMap);
                  newMap.delete(taskId);
                  console.log("Updated playingReminders after expiration:", Array.from(newMap.entries()));
                  return newMap;
                });
              }
            }
          }
        });
        return updated ? updatedSet : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, playingReminders]);

  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "settings") setSidebarOpen(false);
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    console.log("Current user before logout:", user);
    dispatch(login(null));
    setShowProfileDropdown(false);
    console.log("Logout dispatched, waiting for re-render. Current user:", user);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const textColor = theme === "dark" ? "#bdbdbd" : "#1b281b";

  console.log("Rendering progress bar with theme:", theme);

  const handleDismiss = (taskId: string) => {
    console.log("Dismiss button clicked for task ID:", taskId);
    console.log("Current pendingReminders before dismiss:", Array.from(pendingReminders));
    console.log("Current playingReminders before dismiss:", Array.from(playingReminders.entries()));

    const audio = playingReminders.get(taskId);
    if (audio) {
      console.log("Found audio for task ID:", taskId);
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
      setPlayingReminders((prev) => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        console.log("Updated playingReminders after dismiss:", Array.from(newMap.entries()));
        return newMap;
      });
    } else {
      console.log("No audio found for task ID:", taskId);
    }

    setPendingReminders((prev) => {
      const updatedSet = new Set(prev);
      const wasDeleted = updatedSet.delete(taskId);
      console.log("Attempted to remove task ID from pendingReminders:", taskId, "Success:", wasDeleted);
      if (wasDeleted) {
        console.log("Successfully updated pendingReminders:", Array.from(updatedSet));
      } else {
        console.log("Task ID not found in pendingReminders:", taskId);
      }
      return updatedSet;
    });

    dispatch(updateTask(taskId, { reminder: null }));
    console.log("Dispatched updateTask to remove reminder for task ID:", taskId);

    console.log("Dismiss handler completed for task ID:", taskId);
  };

  const generateAvatarSvg = (seed: string) => {
    return createAvatar(style, { seed, size: 40 });
  };

  if (user === null) {
    console.log("User is null, should not render TaskManager");
    return null;
  }

  return (
    <div className="flex h-screen bg-[#fbfdfc] dark:bg-[#1e1e1e] text-[#1b281b] dark:text-white">
      {/* Left Sidebar */}
      <div
        className={cn(
          "flex flex-col border-r border-[#eef6ef] dark:border-[#2c2c2c] bg-[#fbfdfc] dark:bg-[#232323] transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        )}
      >
        <div className="flex items-center p-4 border-b border-[#eef6ef] dark:border-[#2c2c2c]">
          {sidebarOpen ? (
            <>
              <Avatar className="h-10 w-10 border border-[#eef6ef] dark:border-[#2c2c2c]">
                {currentUser ? (
                  <AvatarImage
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(generateAvatarSvg(currentUser.avatar.slice(-1)))}`}
                    alt="User Avatar"
                  />
                ) : (
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                )}
                <AvatarFallback className="bg-[#eef6ef] dark:bg-[#2c2c2c] text-[#3f9142] dark:text-[#98e19b]">
                  {user ? user[0].toUpperCase() : "JD"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Hey, {user || "Guest"}</p>
                <p className="text-xs text-[#4f4f4f] dark:text-[#bdbdbd]">Front End Developer</p>
              </div>
            </>
          ) : (
            <Avatar className="h-10 w-10 mx-auto border border-[#eef6ef] dark:border-[#2c2c2c]">
              {currentUser ? (
                <AvatarImage
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(generateAvatarSvg(currentUser.avatar.slice(-1)))}`}
                  alt="User Avatar"
                />
              ) : (
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              )}
              <AvatarFallback className="bg-[#eef6ef] dark:bg-[#2c2c2c] text-[#3f9142] dark:text-[#98e19b]">
                {user ? user[0].toUpperCase() : "JD"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {[
              { id: "home", icon: <Home size={18} />, label: "All Tasks" },
              { id: "inbox", icon: <Inbox size={18} />, label: "Today" },
              { id: "today", icon: <CheckCircle2 size={18} />, label: "Important" },
              { id: "upcoming", icon: <Clock size={18} />, label: "Planned" },
              { id: "important", icon: <Star size={18} />, label: "Assigned to me" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md text-sm",
                    activeTab === item.id
                      ? "bg-[#eef6ef] dark:bg-[#2f3630] text-[#3f9142] dark:text-[#98e19b]"
                      : "hover:bg-[#f6fff6] dark:hover:bg-[#2c2c2c]"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-[#eef6ef] dark:border-[#2c2c2c]">
            <div className="w-24 h-24 mx-auto mb-2 relative">
              <svg key={theme} className="w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  fill="none"
                  stroke="#4caf50"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={2 * Math.PI * 40 - (2 * Math.PI * 40 * progress) / 100}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  className={theme === "dark" ? "text-white" : "text-[#1b281b]"}
                  style={{ fontWeight: "bold", fill: theme === "dark" ? "white" : "#1b281b" }}
                >
                  {`${Math.round(progress)}%`}
                </text>
              </svg>
            </div>
            <div className="text-center text-sm text-[#4f4f4f] dark:text-[#bdbdbd]">
              <p>Remaining: {remainingTasks}</p>
              <p>Completed: {completedTasks}</p>
            </div>
            <button
              onClick={() => handleTabChange("settings")}
              className={cn(
                "flex items-center text-sm text-[#4f4f4f] dark:text-[#bdbdbd] hover:text-[#1b281b] dark:hover:text-white mt-4",
                !sidebarOpen && "justify-center"
              )}
            >
              <Settings size={18} />
              {sidebarOpen && <span className="ml-3">Settings</span>}
            </button>
          </div>
        )}
      </div>

      {/* Main Content and Right Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 border-b border-[#eef6ef] dark:border-[#2c2c2c] bg-[#3f9142] text-white">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-white hover:bg-[#357937]"
            >
              <Menu size={20} />
            </button>
            <h1 className="ml-4 text-xl font-medium">
              {activeTab === "inbox"
                ? "Inbox Tasks"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Tasks"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-1 focus:ring-[#3f9142]"
              />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-white hover:bg-[#357937]"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="p-2 rounded-md text-white hover:bg-[#357937]"
              >
                <User size={20} />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#2c2c2c] rounded shadow-lg z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-[#1b281b] dark:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 bg-[#fbfdfc] dark:bg-[#1e1e1e]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">
                {activeTab === "today"
                  ? "Today's Tasks"
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tasks`}
              </h2>
              <Button
                onClick={() => setShowTaskInput(true)}
                className="bg-[#3f9142] hover:bg-[#357937] text-white"
              >
                <Plus size={16} className="mr-2" /> Add Task
              </Button>
            </div>

            {showTaskInput && <TaskInput onClose={() => setShowTaskInput(false)} />}
            <TaskList
              activeTab={activeTab}
              pendingReminders={pendingReminders}
              setPendingReminders={setPendingReminders}
              playingReminders={playingReminders}
              setPlayingReminders={setPlayingReminders}
            />
          </main>

          <div className="w-72 bg-gray-100 dark:bg-[#2c2c2c] p-4 border-l border-[#eef6ef] dark:border-[#2c2c2c] h-[calc(100vh-4rem)] overflow-y-auto">
            <h2 className="text-lg font-semibold text-[#1b281b] dark:text-white mb-4">
              Reminders
            </h2>
            {pendingReminders.size > 0 ? (
              Array.from(pendingReminders).map((taskId) => {
                const task = tasks.find((t) => t.id === taskId);
                if (!task) return null;
                return (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#2c2c2c] rounded-lg shadow-lg p-4 mb-2 flex items-center justify-between max-w-xs"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1b281b] dark:text-white">
                        Reminder: {task.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Due: {task.reminder ? new Date(task.reminder).toLocaleString() : "N/A"}
                      </p>
                      {playingReminders.has(task.id) && (
                        <p className="text-xs text-green-500">Sound is playing...</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDismiss(taskId)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        onClickCapture={(e) => {
                          console.log("Dismiss button click captured for task ID:", taskId);
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No active reminders.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}