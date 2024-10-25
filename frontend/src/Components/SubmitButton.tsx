interface SubmitButtonProps {
  text: string;
}

export function SubmitButton({text}: SubmitButtonProps){
  return (
    <button
      type="submit"
      className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
    >
      {text}
    </button>
  );
};
