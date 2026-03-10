"use client";

import { useState } from "react";
import { categories } from "@/constants/categories";

export default function CategoriesPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="category-page">
      <h2 className="category-title">Danh mục sản phẩm</h2>

      <ul className="category-list">
        {categories.map((c) => (
          <li
            key={c.id}
            onClick={() => setSelected(c.name)}
            style={{
              cursor: "pointer",
              fontWeight: selected === c.name ? "bold" : "normal",
              color: selected === c.name ? "blue" : "black",
              marginBottom: "6px",
            }}
          >
            {c.name}
          </li>
        ))}
      </ul>
      {selected && <p className="category-selected">Đang xem danh mục: {selected}</p>}
    </div>
  );
}
