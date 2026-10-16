
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Carrito from "./Carrito";

describe("Pruebas del carrito de compras", () => {
  it("muestra un mensaje cuando el carrito está vacío", () => {
    const setCarrito = vi.fn();

    render(
      <MemoryRouter>
        <Carrito carrito={[]} setCarrito={setCarrito} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Tu carrito está vacío.")
    ).toBeInTheDocument();
  });

  
it("muestra el producto agregado al carrito", () => {
  const producto = {
    id: 1,
    nombre: "Guitarra eléctrica",
    precio: 150000,
    cantidad: 1,
    stock: 5
  };

  const setCarrito = vi.fn();


  render(
    <MemoryRouter>
      <Carrito carrito={[producto]} setCarrito={setCarrito} />
    </MemoryRouter>
  );

  expect(
    screen.getByText("Guitarra eléctrica")
  ).toBeInTheDocument();
});


it("permite eliminar un producto del carrito", async () => {
  const producto = {
    id: 1,
    nombre: "Guitarra eléctrica",
    precio: 150000,
    cantidad: 1,
    stock: 5
  };

  const setCarrito = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Carrito carrito={[producto]} setCarrito={setCarrito} />
    </MemoryRouter>
  );

  await user.click(
    screen.getByRole("button", { name: "Eliminar" })
  );

  expect(setCarrito).toHaveBeenCalledWith([]);
});


it("permite vaciar todos los productos del carrito", async () => {
  const producto = {
    id: 1,
    nombre: "Guitarra eléctrica",
    precio: 150000,
    cantidad: 2,
    stock: 5
  };

  const setCarrito = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Carrito carrito={[producto]} setCarrito={setCarrito} />
    </MemoryRouter>
  );

  await user.click(
    screen.getByRole("button", { name: "Vaciar carrito" })
  );

  expect(setCarrito).toHaveBeenCalledWith([]);
});
});
