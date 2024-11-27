import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Task, User } from "../types";
import { useSocket } from "./SocketContext";

type AppContextType = {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  connectedUsers: User[];
  setConnectedUsers: Dispatch<SetStateAction<User[]>>;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  useEffect(() => {
    socket?.on("users-updated", (data) => {
      const { type, id, user } = data;
      switch (type) {
        case "added":
          setConnectedUsers((prevUsers) => [...prevUsers, user]);
          break;
        case "removed":
          setConnectedUsers((prevUsers) =>
            prevUsers.filter((u) => u.id !== id)
          );
          break;
        case "updated":
          setConnectedUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === id
                ? { ...u, status: user.status, taskId: user.taskId }
                : u
            )
          );
          break;
      }
    });
    // Load initial tasks from server
    socket?.on("first-message", (data: { users: User[]; tasks: Task[] }) => {
      const { users, tasks } = data;
      if (users) {
        setConnectedUsers(users);
      }
      if (tasks) {
        setTasks(tasks);
      }
    });

    socket?.on("task-added", (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });
    // Update task on real-time event
    socket?.on("task-updated", (updatedTask: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    });

    socket?.on(
      "task-moved",
      (data: {
        id: string;
        newStatus: "To Do" | "In Progress" | "Done";
        user: User;
      }) => {
        const { id, newStatus, user } = data;
        if (!id || !newStatus) return;
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
        if (user) {
          setConnectedUsers((prev) =>
            prev.map((u) => (u.id === user.id ? user : u))
          );
        }
      }
    );

    socket?.on("task-deleted", (id) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    });
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        connectedUsers,
        setConnectedUsers,
        setTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
