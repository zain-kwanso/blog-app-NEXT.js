const Skeleton: React.FC = (): React.JSX.Element => {
  return (
    <div
      className="bg-white p-4 w-full max-w-sm rounded-lg shadow-lg h-auto flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-shadow animate-pulse"
      aria-live="polite"
    >
      <h2 className="text-xl font-bold mb-2 w-[60%] h-5 rounded-full bg-slate-200"></h2>
      <p className="w-full h-[5rem] rounded-lg bg-slate-200"></p>
      <p className="text-sm mt-2 w-[30%] h-5 rounded-full bg-slate-200"></p>
    </div>
  );
};

export default Skeleton;
