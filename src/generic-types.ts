import { Context, Middleware } from 'telegraf';

export type Body = string;
export type ConstOrPromise<T> = T | Promise<T>;
export type ContextFn<Context, ReturnType> = (ctx: Context) => ConstOrPromise<ReturnType>;
export type ConstOrContextFn<Context, ReturnType> = ReturnType | ContextFn<Context, ReturnType>;
export type ActionTrigger<Context> = ConstOrContextFn<Context, string>;
export type ActionFn<TContext extends Context> = Middleware<TContext>;
