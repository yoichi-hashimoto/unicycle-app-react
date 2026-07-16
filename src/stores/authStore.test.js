import { useAuthStore } from "./authStore";

describe("authStore", () => {
  afterEach(() => {
    useAuthStore.getState().logout();
  });

  test("setUser updates the login state", () => {
    const user = { id: 1, name: "テスト" };

    useAuthStore.getState().setUser(user);

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
  });

  test("logout clears the user", () => {
    useAuthStore.getState().setUser({ id: 1 });
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });
});
