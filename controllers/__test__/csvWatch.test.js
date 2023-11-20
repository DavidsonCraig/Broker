const chokidar = require("chokidar");
const { startCsvWatch, stopWatching } = require("../csvWatch");

const CSVpath = "./controllers/__test__/CSV/";
const invalidCSVpath = "./controllers/__test__/CSV/invalidCSV/";

describe("CSVWatch callback should trigger only when a CSV file is added", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    stopWatching();
  });
  test("Callback should not trigger for a text file", async () => {
    const mockCallBack = jest.fn();
    startCsvWatch(invalidCSVpath, mockCallBack);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockCallBack).not.toHaveBeenCalled();
  });

  test("Callback should trigger for a CSV file", async () => {
    const mockCallBack = jest.fn();
    startCsvWatch(CSVpath, mockCallBack);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockCallBack).toHaveBeenCalled();
  });
});
