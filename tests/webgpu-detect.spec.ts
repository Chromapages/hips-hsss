import { describe, expect, it, vi } from "vitest";
import { checkWebGPUSupport } from "../apps/web/src/lib/webgpu-detect";

describe("WebGPU detection helper", () => {
  it("returns false if navigator is undefined", async () => {
    const origNavigator = globalThis.navigator;
    
    // @ts-ignore
    delete globalThis.navigator;
    
    const support = await checkWebGPUSupport();
    expect(support).toBe(false);
    
    // Restore
    globalThis.navigator = origNavigator;
  });

  it("returns false if navigator.gpu is undefined", async () => {
    const origNavigator = globalThis.navigator;
    
    // @ts-ignore
    globalThis.navigator = { gpu: undefined };
    
    const support = await checkWebGPUSupport();
    expect(support).toBe(false);
    
    globalThis.navigator = origNavigator;
  });

  it("returns true if navigator.gpu exists and requestAdapter resolves to an adapter", async () => {
    const origNavigator = globalThis.navigator;
    const origWindow = globalThis.window;
    
    const requestAdapterMock = vi.fn().mockResolvedValue({ name: "MockGPU" });
    // @ts-ignore
    globalThis.window = {};
    // @ts-ignore
    globalThis.navigator = {
      gpu: {
        requestAdapter: requestAdapterMock
      }
    } as any;
    
    const support = await checkWebGPUSupport();
    expect(support).toBe(true);
    expect(requestAdapterMock).toHaveBeenCalled();
    
    globalThis.navigator = origNavigator;
    globalThis.window = origWindow;
  });

  it("returns false if requestAdapter rejects or returns null", async () => {
    const origNavigator = globalThis.navigator;
    const origWindow = globalThis.window;
    
    const requestAdapterMock = vi.fn().mockResolvedValue(null);
    // @ts-ignore
    globalThis.window = {};
    globalThis.navigator = {
      gpu: {
        requestAdapter: requestAdapterMock
      }
    } as any;
    
    const support = await checkWebGPUSupport();
    expect(support).toBe(false);
    
    globalThis.navigator = origNavigator;
    globalThis.window = origWindow;
  });
});
