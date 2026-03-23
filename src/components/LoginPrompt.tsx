interface LoginPromptProps {
  message?: string;
}

export default function LoginPrompt({
  message = "Bitte melde dich an, um auf diesen Bereich zuzugreifen.",
}: LoginPromptProps) {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}
