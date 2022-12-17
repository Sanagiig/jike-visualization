declare type WithChildren<T,Res = T & { children: Res[] }> = Res

declare type MatrixList = number[16]
declare type PointList = [x: number, y: number]
declare type RGBAList = [r: number, g: number, b: number, a: number]

declare type PositionInfo = {
  x: number;
  y: number;
}
declare type SizeInfo = {
  width: number;
  height: number;
}
declare type ColorInfo = {
  r: number;
  g: number;
  b: number;
  a: number;
}
declare type TraverseInfo = PositionInfo & SizeInfo & ColorInfo & {
  index: number;
}