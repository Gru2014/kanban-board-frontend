import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { Task } from "../../types";
import { useSocket } from "../../context/SocketContext";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const socket = useSocket();

  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isEditing) {
      socket?.emit("focus-task", { status: "editing", taskId: task.id });
    } else {
      socket?.emit("focus-task", { status: "none", taskId: null });
    }
    if (isDragging) {
      socket?.emit("focus-task", { status: "moving", taskId: task.id });
    }
  }, [isDragging, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    socket?.emit("update-task", {
      ...task,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const handleDeleteTask = () => {
    socket?.emit("delete-task", task.id);
  };

  return (
    <div
      ref={dragRef}
      className={`p-4 bg-white rounded-lg shadow ${
        isDragging ? "opacity-50" : ""
      }`}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-1 border rounded"
          />
        ) : (
          <h3 className="text-md font-bold text-gray-800">{task.title}</h3>
        )}
        {!isEditing && (
          <button
            onClick={handleDeleteTask}
            className="text-2xl cursor-pointer"
          >
            &times;
          </button>
        )}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-1 mt-2 border rounded"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">{task.description}</p>
      )}
    </div>
  );
};

export default TaskCard;
