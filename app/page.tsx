import Chat from "./components/Chat";
import Fileviewer from "./components/File-viewer";

export default function Home() {
  return (
    <main className="flex flex-row p-10 gap-10 min-h-dvh">
      <Fileviewer />
      <Chat />
    </main>
  );
}
