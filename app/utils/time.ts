class TooManyRequestsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TooManyRequestsError";
  }
}
export async function getCurrentTimeOffset(): Promise<{
  offset: number;
  error: number;
} | null> {
  const url = "https://worldtimeapi.org/api/ip"; // Public time API

  const T1 = performance.now(); // Record time before sending request
  const time = Date.now();
  try {
    const response = await fetch(url);
    const T4 = performance.now(); // Record time after receiving response
    if (response.status === 429) {
      throw new TooManyRequestsError("Too many requests");
    }
    const data = await response.json();
    const serverTime = new Date(data.utc_datetime).getTime();
    const offset = serverTime - time;
    const latency = T4 - T1;
    const latencyOneWay = latency / 2;
    console.log(`Latency: ${offset} ms, One way latency: ${latencyOneWay} ms`);
    return {offset: offset + latencyOneWay, error: latencyOneWay};
  } catch (error) {
    if (error instanceof TooManyRequestsError) {
      console.warn("Too many requests, skipping this request.");
      return null;
    }
    console.error("Error fetching time:", error);
    return null;
  }
}
