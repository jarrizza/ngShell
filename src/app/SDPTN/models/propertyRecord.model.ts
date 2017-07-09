export class PropertyRecord {
  public parcelNumber: number;
  public primaryOwner: string;
  public description: string;
  public situsAddress: string;
  public mailingAddress: string;
  public document: string;
  public modified: boolean;

  constructor(property: any) {
    this.parcelNumber = property.parcelNumber || 0;
    this.primaryOwner = property.primaryOwner || 'Unknown';
    this.description = property.description || '';
    this.situsAddress = property.situsAddress || '';
    this.mailingAddress = property.mailingAddress || '';
    this.document = property.document || '';
    this.modified = property.modified || true;
  }
}
