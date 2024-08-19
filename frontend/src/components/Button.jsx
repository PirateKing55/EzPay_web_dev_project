export const Button = ({ label, onclick }) => {
  return (
    <button
      onClick={onclick}
      className="bg-lime-400 hover:bg-lime-500 border border-transparent focus:border-transparent focus:ring-0 active:border-white text-black font-medium rounded-md w-full p-[7px]"
    >
      {label}
    </button>
  );
};
