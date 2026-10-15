"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";

const categories = ["All", "Residential", "Commercial", "Industrial", "Solar"];

export default function ProjectsGrid({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (p) =>
            p.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-amber-500 text-white shadow-sm"
                : "border border-slate-300 text-slate-600 hover:border-amber-500 hover:text-amber-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-amber-500 dark:hover:text-amber-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered && filtered.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-slate-500 dark:text-slate-400">
          No projects found in this category.
        </p>
      )}
    </div>
  );
}
