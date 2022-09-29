export default interface IGestor<Type> {
  nuevo(obj: Type): boolean
  modificar(obj: Type): boolean
  buscar(obj: Type): Array<Type>
}
