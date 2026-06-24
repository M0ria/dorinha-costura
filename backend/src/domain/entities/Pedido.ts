export interface PedidoData {
  id?: string;
  cliente: string;
  tipo: string;
  descricao?: string | null;
  material: number;
  maoDeObra: number;
  total: number;
  data: Date;
  criadoEm?: Date;
}

export class Pedido {
  private _id?: string;
  private _cliente: string;
  private _tipo: string;
  private _descricao: string | null;
  private _material: number;
  private _maoDeObra: number;
  private _total: number;
  private _data: Date;
  private _criadoEm?: Date;

  private constructor(data: PedidoData) {
    this._id = data.id;
    this._cliente = data.cliente;
    this._tipo = data.tipo;
    this._descricao = data.descricao || null;
    this._material = data.material;
    this._maoDeObra = data.maoDeObra;
    this._total = data.total;
    this._data = data.data;
    this._criadoEm = data.criadoEm;
  }

  public static create(data: PedidoData): Pedido {
    return new Pedido(data);
  }

  // Getters
  public getId(): string | undefined { return this._id; }
  public getCliente(): string { return this._cliente; }
  public getTipo(): string { return this._tipo; }
  public getDescricao(): string | null { return this._descricao; }
  public getMaterial(): number { return this._material; }
  public getMaoDeObra(): number { return this._maoDeObra; }
  public getTotal(): number { return this._total; }
  public getData(): Date { return this._data; }
  public getCriadoEm(): Date | undefined { return this._criadoEm; }

  // Setters
  public setCliente(cliente: string) { this._cliente = cliente; return this; }
  public setTipo(tipo: string) { this._tipo = tipo; return this; }
  public setDescricao(descricao: string | null) { this._descricao = descricao; return this; }
  public setMaterial(material: number) { this._material = material; return this; }
  public setMaoDeObra(maoDeObra: number) { this._maoDeObra = maoDeObra; return this; }
  public setTotal(total: number) { this._total = total; return this; }
  public setData(data: Date) { this._data = data; return this; }
}
