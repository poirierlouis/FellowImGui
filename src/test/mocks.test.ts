/* eslint-disable @typescript-eslint/no-empty-function */

// @ts-expect-error ImGui type not defined
window.ImGui = {
  InputInt: () => {
  },
  InputInt2: () => {
  }
}

window.open = jest.fn();
