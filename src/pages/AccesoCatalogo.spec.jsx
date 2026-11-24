import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { VendedorLayout } from "./Vendedor";

beforeEach(() => { sessionStorage.clear(); vi.stubGlobal("fetch", vi.fn()); });
afterEach(() => vi.unstubAllGlobals());

function panel() {
  return render(<MemoryRouter initialEntries={["/vendedor"]}><Routes><Route path="/vendedor" element={<VendedorLayout />}><Route index element={<p>Contenido administrativo</p>} /></Route></Routes></MemoryRouter>);
}

describe("acceso al panel mediante JWT", () => {
  it("abre el panel solamente después de que la API acepta el token", async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ correo: "admin@example.com", rol: "ADMIN" }) });
    const vista = panel();
    expect(screen.queryByText("Contenido administrativo")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("Token de acceso"), "jwt-admin");
    await user.click(screen.getByRole("button", { name: "Acceder al panel" }));
    expect(await screen.findByText("Contenido administrativo")).toBeInTheDocument();
    expect(sessionStorage.getItem("svApiToken")).toBe("jwt-admin");
    vista.unmount();
    panel();
    expect(await screen.findByText("Contenido administrativo")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("rechaza USER y muestra la explicación del permiso requerido", async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
    panel();
    await user.type(screen.getByLabelText("Token de acceso"), "jwt-user");
    await user.click(screen.getByRole("button", { name: "Acceder al panel" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("ADMIN");
    expect(screen.queryByText("Contenido administrativo")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("svApiToken")).toBeNull();
  });
});
