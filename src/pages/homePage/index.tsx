import { Board, PresenceIndicator } from "../../components";

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      <main className="flex flex-col items-center p-4 space-y-6">
        <PresenceIndicator />
        <Board />
      </main>
    </div>
  );
};

export default HomePage;
