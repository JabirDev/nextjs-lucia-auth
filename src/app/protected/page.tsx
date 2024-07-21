export default function Page() {
  return (
    <div className="w-full font-sans flex-col min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold leading-tight">Protected Page</h1>
      <p>This page can access only by signed user</p>
    </div>
  );
}
