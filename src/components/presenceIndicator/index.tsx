import { useAppContext } from "../../context/AppContext";

const PresenceIndicator = () => {
  const { connectedUsers, tasks } = useAppContext();
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-bold text-gray-700">Active Users</h3>
      <ul className="mt-4 space-y-2">
        {connectedUsers.map((user) => {
          const activeTask = tasks.find((task) => task.assignedTo === user.id);
          return (
            <li
              key={user.id}
              className="flex items-center gap-2 p-2 bg-white rounded-md shadow"
            >
              <span className="h-4 w-4 bg-green-500 rounded-full"></span>
              <span className="font-medium text-gray-800">
                {user.id.substring(0, 5)}...{" "}
                {user.status !== "none" ? user.status : ""}{" "}
                {user.taskId
                  ? tasks.find((task) => task.id === user.taskId)?.title
                  : ""}
              </span>
              {activeTask && (
                <span className="text-sm text-gray-500">
                  Editing: {activeTask.title}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PresenceIndicator;
