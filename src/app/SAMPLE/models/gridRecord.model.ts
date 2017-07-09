export class GridRecord {
  public recordNumber: number;
  public name: string;
  public description: string;
  public address: string;
  public role: string;
  public modified: boolean;

  constructor(record: any) {
    this.recordNumber = record.recordNumber || 0;
    this.name = record.name || 'Unknown';
    this.description = record.description || '';
    this.address = record.address || '';
    this.role = record.role || 'dev';
    this.modified = record.modified || true;
  }
}
