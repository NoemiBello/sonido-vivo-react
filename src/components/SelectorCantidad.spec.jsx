
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectorCantidad from "./SelectorCantidad";

describe("Pruebas del selector de cantidad", () => {
  it("permite aumentar la cantidad de un producto", async () => {
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
      <SelectorCantidad
        producto={producto}
        carrito={[producto]}
        setCarrito={setCarrito}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Aumentar cantidad"
      })
    );

    expect(setCarrito).toHaveBeenCalledWith([
      {
        ...producto,
        cantidad: 2
      }
    ]);
  });
  
it("permite disminuir la cantidad de un producto", async () => {
  const producto = {
    id: 1,
    nombre: "Guitarra eléctrica",
    precio: 150000,
    cantidad: 3,
    stock: 5
  };

  const setCarrito = vi.fn();
  const user = userEvent.setup();

  render(
    <SelectorCantidad
      producto={producto}
      carrito={[producto]}
      setCarrito={setCarrito}
    />
  );

  await user.click(
    screen.getByRole("button", {
      name: "Disminuir cantidad"
    })
  );

  expect(setCarrito).toHaveBeenCalledWith([
    {
      ...producto,
      cantidad: 2
    }
  ]);
});


it("no permite aumentar la cantidad cuando alcanza el stock", async () => {
  const producto = {
    id: 1,
    nombre: "Guitarra eléctrica",
    precio: 150000,
    cantidad: 5,
    stock: 5
  };

  const setCarrito = vi.fn();
  const user = userEvent.setup();

  render(
    <SelectorCantidad
      producto={producto}
      carrito={[producto]}
      setCarrito={setCarrito}
    />
  );

  const botonAumentar = screen.getByRole("button", {
    name: "Aumentar cantidad"
  });

  expect(botonAumentar).toBeDisabled();

  await user.click(botonAumentar);

  expect(setCarrito).not.toHaveBeenCalled();
});


it("restablece la cantidad cuando se escribe un valor inválido", async () => {
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
    <SelectorCantidad
      producto={producto}
      carrito={[producto]}
      setCarrito={setCarrito}
    />
  );

  const campoCantidad = screen.getByRole("spinbutton", {
    name: "Cantidad de Guitarra eléctrica"
  });

  await user.clear(campoCantidad);
  await user.type(campoCantidad, "0");
  await user.tab();

  expect(campoCantidad).toHaveValue(2);
  expect(setCarrito).not.toHaveBeenCalled();
});

it("no permite escribir una cantidad mayor al stock", async () => {
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
    <SelectorCantidad
      producto={producto}
      carrito={[producto]}
      setCarrito={setCarrito}
    />
  );

  const campoCantidad = screen.getByRole("spinbutton", {
    name: "Cantidad de Guitarra eléctrica"
  });

  await user.clear(campoCantidad);
  await user.type(campoCantidad, "10");
  await user.tab();

  expect(campoCantidad).toHaveValue(2);

  expect(setCarrito).toHaveBeenCalledWith([
    {
      ...producto,
      cantidad: 1
    }
  ]);

  expect(setCarrito).not.toHaveBeenCalledWith([
    {
      ...producto,
      cantidad: 10
    }
  ]);
});


it("rechaza una cantidad decimal y recupera la cantidad anterior", async () => {
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
    <SelectorCantidad
      producto={producto}
      carrito={[producto]}
      setCarrito={setCarrito}
    />
  );

  const campoCantidad = screen.getByRole("spinbutton", {
    name: "Cantidad de Guitarra eléctrica"
  });

  await user.clear(campoCantidad);
  await user.type(campoCantidad, "2.5");
  await user.tab();

  expect(campoCantidad).toHaveValue(2);

  expect(setCarrito).not.toHaveBeenCalledWith([
    {
      ...producto,
      cantidad: 2.5
    }
  ]);
});

});
