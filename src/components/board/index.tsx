import { useAppContext } from "../../context/AppContext";
import { Column } from "..";

const Board = () => {
  const { tasks } = useAppContext();

  const columns = ["To Do", "In Progress", "Done"] as const;

  return (
    <div className="flex w-full gap-4">
      {columns.map((column) => (
        <Column
          key={column}
          status={column}
          tasks={tasks.filter((task) => task.status === column)}
        />
      ))}
    </div>
  );
};

export default Board;
