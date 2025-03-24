export default function Header({ title = "Default Title" }) {
  return (
    <header className="bg-red-600 text-white p-4 shadow-md">
      <h1 className="text-center text-lg font-semibold">{title}</h1>
    </header>
  );
}
