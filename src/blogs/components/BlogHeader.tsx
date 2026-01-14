import { JSX } from "react";
import { Button } from "../../style/ui/button";
import { PenSquare } from "lucide-react";

export default function BlogHeader({ searchQuery, onSearchChange, onWriteClick, user, onLogout }: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onWriteClick?: () => void;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}): JSX.Element {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Daily Blog</h1>
            <p className="text-gray-600">Thoughts, stories and ideas</p>
          </div>
          <div className="flex items-center gap-3">
            {user && onWriteClick && (
              <Button onClick={onWriteClick}>
                <PenSquare className="size-4 mr-2" />
                Write
              </Button>
            )}
            {user && onLogout && (
              <button
                onClick={onLogout}
                className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="relative max-w-md">
          <input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
}