export const InputBox = ({ placeholder, onChange }) => {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
      className="border rounded-md border-lime-400 bg-black w-full p-[10px] mb-[15px] text-slate-300"
    ></input>
  );
};
