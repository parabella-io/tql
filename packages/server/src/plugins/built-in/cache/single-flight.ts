export class SingleFlight {
  private readonly flights = new Map<string, Promise<unknown>>();

  public get<T>(key: string): Promise<T> | undefined {
    return this.flights.get(key) as Promise<T> | undefined;
  }

  public set<T>(key: string, promise: Promise<T>): void {
    this.flights.set(
      key,
      promise.finally(() => {
        this.flights.delete(key);
      }),
    );
  }

  public run<T>(key: string, task: () => Promise<T>): Promise<T> {
    const existing = this.flights.get(key);

    if (existing) {
      return existing as Promise<T>;
    }

    const promise = task().finally(() => {
      this.flights.delete(key);
    });

    this.flights.set(key, promise);

    return promise;
  }
}
