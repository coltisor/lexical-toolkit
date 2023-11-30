import { RichTextEditor } from "@/components/RichTextEditor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center font-mono text-sm">
        <span>Welcome to the Lexical Toolkit playground!</span>
      </div>

      <div className="p-8">
        <RichTextEditor placeholder="Please enter your text" />
      </div>

      <div className="text-center  font-mono text-sm">
        <span>Lexical Toolkit @ 2023</span>
      </div>
    </main>
  );
}
