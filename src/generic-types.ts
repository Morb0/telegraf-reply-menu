export type Body = string;
export type ConstOrPromise<T> = T | Promise<T>;
export type ContextFn<Context, ReturnType> = (ctx: Context) => ConstOrPromise<ReturnType>;
export type ConstOrContextFn<Context, ReturnType> = ReturnType | ContextFn<Context, ReturnType>;
