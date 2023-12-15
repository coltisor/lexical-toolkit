import { RichTextEditor } from "@/components/RichTextEditor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly gap-8 p-8">
      <div className="text-center font-mono text-sm">
        <span>Welcome to the Lexical Toolkit playground!</span>
      </div>

      <RichTextEditor placeholder="Please enter your text" />

      <div className="text-center font-mono text-sm">
        <span>Lexical Toolkit @ 2023</span>
      </div>
    </main>
  );
}
