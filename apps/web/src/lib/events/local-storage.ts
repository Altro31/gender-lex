export class LocalStorageEvent extends Event {
  readonly key: string;
  readonly value: string;
  constructor({ key, value }: { key: string; value: string }) {
    super("local-storage");
    this.key = key;
    this.value = value;
  }
}
