namespace Utils {
    export namespace Types {
        export type IfEquals<T, U, Y=unknown, N=never> =
                (<G>() => G extends T ? 1 : 2) extends (<G>() => G extends U ? 1 : 2)
                ? Y
                : N;

        export type Equals<A, B> = IfEquals<A, B, true, false>;

        export const exactType = <T, U>(
            draft: T & IfEquals<T, U>,
            expected: U & IfEquals<T, U>
        ): IfEquals<T, U> => draft;

        export type CombineWithPick<A, B, Key extends keyof B, _Int = A & Pick<B, Key>> = Pick<_Int, keyof _Int>;

        export type AnyFn = (...args: any[]) => any;
        export type UnknownFn = (...args: unknown[]) => unknown;

        export type Satisfies<Keys extends PropertyKey, Values, Specific extends Record<Keys, Values>> = Pick<Specific, Keys>;

        export interface StringUnion<Values extends string = string> {
            values: Values[];
            guard: (value: string) => value is Values;
            type: Values;
        }

        export const makeStringUnion = <Values extends string>(...values: Values[]) => {
            Object.freeze(values);

            const guard = (value: string): value is Values => {
                return values.includes(value as Values);
            };

            return Object.freeze({
                values,
                guard
            } as StringUnion<Values>);
        };

        export namespace Tuples {

            export type Concat<A extends unknown[], B extends unknown[]> = [...a: A, ...b: B];

        }
    }

    export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

    export const pick = <Obj, Keys extends keyof Obj>(obj: Obj, ...keys: Keys[]) => {
        const result = {} as Pick<Obj, Keys>;

        for (let key of keys)
            result[key] = obj[key];
        
        return result;
    };
}

export default Utils;