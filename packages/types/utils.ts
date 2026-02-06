import type { IsNever, UnionToTuple } from "type-fest";

type AllOfMissings<Missings extends string[], Text = ""> = Missings extends [
  infer H,
  ...infer T
]
  ? IsNever<T[number]> extends false
    ? AllOfMissings<
        T extends string[] ? T : [],
        Text extends "" ? `${H & string}` : `${Text & string}, ${H & string}`
      >
    : Text extends ""
    ? `${H & string}`
    : `${Text & string}, ${H & string}`
  : Text;

export type AllOf<
  U,
  A extends readonly string[],
  Missings extends any[] = [],
  AU = A[number],
  UT = UnionToTuple<U>
> = UT extends [infer H, ...string[]]
  ? IsNever<Extract<AU, H>> extends false
    ? AllOf<Exclude<U, H>, A, Missings>
    : AllOf<Exclude<U, H>, A, [...Missings, H]>
  : Missings["length"] extends 0
  ? A
  : `Missing items ${AllOfMissings<Missings>}`;
