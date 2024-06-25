export class Games {
  constructor(
    public _id: any = '',
    public name: string = '',
    public genero: string,
    public year: string,
    public engine: string,
    public descripcion: string,
    public trailer: string = '',
    public images: string[]
  ) {}
}
