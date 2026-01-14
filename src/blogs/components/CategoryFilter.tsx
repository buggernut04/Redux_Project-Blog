import { JSX } from "react";
import { Button } from "../../style/ui/button";

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}): JSX.Element {
  return (
   <div className="flex gap-2 overflow-x-auto pb-2">
      <Button
        variant={selectedCategory === "All" ? "default" : "outline"}
        onClick={() => onCategoryChange("All")}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}