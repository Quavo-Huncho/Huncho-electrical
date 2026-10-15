"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const MaterialContext =
  createContext();

export function MaterialProvider({
  children,
}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "material-request"
      );

    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "material-request",
      JSON.stringify(items)
    );
  }, [items]);

  function addItem(material) {
    const existing = items.find(
      (item) => item.id === material.id
    );

    if (existing) {
      setItems(
        items.map((item) =>
          item.id === material.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          ...material,
          quantity: 1,
        },
      ]);
    }
  }

  function removeItem(id) {
    setItems(
      items.filter(
        (item) => item.id !== id
      )
    );
  }

  function updateQuantity(
    id,
    quantity
  ) {
    if (quantity < 1) return;

    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function clearItems() {
    setItems([]);

    localStorage.removeItem(
      "material-request"
    );
  }

  return (
    <MaterialContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearItems,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
}

export function useMaterials() {
  return useContext(MaterialContext);
}