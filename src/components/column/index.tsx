import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { Task } from "../../types";
import { TaskCard } from "..";
import { useSocket } from "../../context/SocketContext";

interface ColumnProps {
  status: "To Do" | "In Progress" | "Done";
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ status, tasks }) => {
  const socket = useSocket();
  const funcRef = useRef<((id: string, status: Task["status"]) => void) | null>(
    null
  );

  useEffect(() => {
    socket?.on("connect", () => {
      funcRef.current = (id: string, status: Task["status"]) => {
        socket.emit("move-task", { id, newStatus: status });
      };
    });
  }, [socket]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string; status: Task["status"] }) => {
      if (item.status !== status) {
        if (funcRef.current) {
          funcRef.current(item.id, status);
        } else {
          console.error("Function is not initialized.");
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={`p-4 rounded-lg 
        ${
          isOver ? "bg-blue-50" : "bg-gray-100"
        } shadow-md flex-1 gap-2 flex flex-col`}
    >
      <h3 className="text-lg font-bold mb-4">{status}</h3>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default Column;
