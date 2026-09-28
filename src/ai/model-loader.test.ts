import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Mocks the @huggingface/transformers dynamic import. This is
 * necessary because this test environment has no network access to
 * download the actual ONNX model weights (huggingface.co is outside
 * this sandbox's allowlist) — these tests verify the LOADER'S OWN
 * caching/singleton/error-handling logic, not real model behavior.
 * Real model loading must be verified in an actual browser.
 */
const mockPipelineFn = vi.fn();
vi.mock("@huggingface/transformers", () => ({
  pipeline: mockPipelineFn,
}));

describe("model-loader", () => {
  beforeEach(() => {
    vi.resetModules();
    mockPipelineFn.mockReset();
  });

  it("calls pipeline() with the text2text-generation task and the configured model id on first use", async () => {
    const fakeGenerator = vi.fn();
    mockPipelineFn.mockResolvedValue(fakeGenerator);

    const { getGenerator } = await import("./model-loader");
    const generator = await getGenerator();

    expect(mockPipelineFn).toHaveBeenCalledTimes(1);
    expect(mockPipelineFn.mock.calls[0][0]).toBe("text2text-generation");
    expect(mockPipelineFn.mock.calls[0][1]).toBe("Xenova/LaMini-Flan-T5-77M");
    expect(generator).toBe(fakeGenerator);
  });

  it("caches the generator: a second call does not invoke pipeline() again", async () => {
    const fakeGenerator = vi.fn();
    mockPipelineFn.mockResolvedValue(fakeGenerator);

    const { getGenerator } = await import("./model-loader");
    await getGenerator();
    await getGenerator();

    expect(mockPipelineFn).toHaveBeenCalledTimes(1);
  });

  it("shares one in-flight load across concurrent callers rather than starting duplicate downloads", async () => {
    let resolvePipeline!: (value: unknown) => void;
    mockPipelineFn.mockReturnValue(
      new Promise((resolve) => {
        resolvePipeline = resolve;
      })
    );

    const { getGenerator } = await import("./model-loader");
    const firstCall = getGenerator();
    const secondCall = getGenerator();

    resolvePipeline(vi.fn());
    await Promise.all([firstCall, secondCall]);

    expect(mockPipelineFn).toHaveBeenCalledTimes(1);
  });

  it("reports 'loading' then 'ready' status via onStatusChange on a successful load", async () => {
    mockPipelineFn.mockResolvedValue(vi.fn());
    const statuses: string[] = [];

    const { getGenerator } = await import("./model-loader");
    await getGenerator((status) => statuses.push(status.state));

    expect(statuses[0]).toBe("loading");
    expect(statuses[statuses.length - 1]).toBe("ready");
  });

  it("reports progress updates during loading when the model provides them", async () => {
    mockPipelineFn.mockImplementation(async (_task: string, _model: string, options: any) => {
      options.progress_callback({ status: "progress", progress: 42 });
      return vi.fn();
    });

    const progressValues: (number | undefined)[] = [];
    const { getGenerator } = await import("./model-loader");
    await getGenerator((status) => {
      if (status.state === "loading") progressValues.push(status.progress);
    });

    expect(progressValues).toContain(42);
  });

  it("reports an 'error' status and rejects when pipeline() throws, without caching a broken generator", async () => {
    mockPipelineFn.mockRejectedValue(new Error("network unavailable"));
    const statuses: string[] = [];

    const { getGenerator, isModelReady } = await import("./model-loader");
    await expect(getGenerator((status) => statuses.push(status.state))).rejects.toThrow(
      "network unavailable"
    );

    expect(statuses).toContain("error");
    expect(isModelReady()).toBe(false);
  });

  it("allows retrying after a failed load (does not permanently cache the failure)", async () => {
    mockPipelineFn.mockRejectedValueOnce(new Error("first attempt fails"));
    const fakeGenerator = vi.fn();
    mockPipelineFn.mockResolvedValueOnce(fakeGenerator);

    const { getGenerator } = await import("./model-loader");
    await expect(getGenerator()).rejects.toThrow("first attempt fails");

    const generator = await getGenerator();
    expect(generator).toBe(fakeGenerator);
    expect(mockPipelineFn).toHaveBeenCalledTimes(2);
  });

  it("isModelReady() is false before load and true after a successful load", async () => {
    mockPipelineFn.mockResolvedValue(vi.fn());

    const { getGenerator, isModelReady } = await import("./model-loader");
    expect(isModelReady()).toBe(false);

    await getGenerator();
    expect(isModelReady()).toBe(true);
  });
});
