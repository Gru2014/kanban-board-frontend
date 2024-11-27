export type Task = {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  assignedTo?: string;
};

enum UserStatus {
  None = "none",
  Moving = "moving",
  Editing = "editing",
}

export type User = {
  id: string;
  status: UserStatus;
  taskId: string | null;
};

export type TaskForm = {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  assignedTo?: string;
};
