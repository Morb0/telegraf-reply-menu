import { Middleware, Context as TContext } from 'telegraf';
import { ConstOrContextFn, ContextFn } from './generic-types';

export type ActionTrigger<Context> = ConstOrContextFn<Context, string>;
export type ActionHandler<Context extends TContext> = Middleware.Fn<Context>;
export interface ActionOptions<Context extends TContext> {
  readonly hide?: ContextFn<Context, boolean>;
  readonly joinLeft?: boolean;
}

export interface Action<Context extends TContext> {
  readonly trigger: ActionTrigger<Context>;
  readonly handler: ActionHandler<Context>;
  readonly options?: ActionOptions<Context>;
}

export class Actions<Context extends TContext> {
  private actions: Set<Action<Context>> = new Set();

  add(trigger: ActionTrigger<Context>, handler: ActionHandler<Context>, options?: ActionOptions<Context>): void {
    this.actions.add({
      trigger,
      handler,
      options,
    });
  }

  getAll(): ReadonlySet<Action<Context>> {
    return this.actions;
  }
}
