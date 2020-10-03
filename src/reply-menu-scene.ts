import { BaseScene, Context as TContext, Markup, Stage } from 'telegraf';
import { ReplyKeyboardMarkup } from 'typegram';
import { ConstOrContextFn, Body } from './generic-types';
import { ActionHandler, ActionOptions, Actions } from './actions';
import { KeyboardButton } from 'typegram/types';
import SceneContext from 'telegraf/typings/scenes/context';

type Hideable<B> = B & { hide: boolean; };
type ReplyKeyboard = Hideable<KeyboardButton>[][];
interface InteractionOptions<Context extends TContext> extends ActionOptions<Context> {
  do: ActionHandler<Context>;
}

export class ReplyMenuScene<Context extends SceneContext.Extended<TContext>> extends BaseScene<Context> {
  private actions = new Actions<Context>();

  constructor(
    id: string,
    private body: ConstOrContextFn<Context, string>,
  ) {
    super(id, null);
    this.enter(async ctx => {
      await this.setupSceneMessage(ctx);
      await this.setupHandlers(ctx);
    });
  }

  interact(text: ConstOrContextFn<Context, string>, options: InteractionOptions<Context>): void {
    this.actions.add(text, options.do, options);
  }

  navigate(text: ConstOrContextFn<Context, string>, sceneId: string, options: ActionOptions<Context>): void {
    this.actions.add(text, Stage.enter(sceneId, null), options);
  }

  private async setupSceneMessage(ctx: Context): Promise<void> {
    const body = await this.renderBody(ctx);
    const keyboard = await this.createMessageKeyboard(ctx);
    await ctx.reply(body, keyboard);
  }

  private async renderBody(ctx: Context): Promise<Body> {
    return this.resolveConstOrContextFn(ctx, this.body);
  }

  async renderKeyboard(ctx: Context): Promise<KeyboardButton[][]> {
    return (await this.createMessageKeyboard(ctx)).reply_markup.keyboard;
  }

  private async createMessageKeyboard(ctx: Context): Promise<Markup<ReplyKeyboardMarkup>> {
    const rows: ReplyKeyboard = [];

    for (const {trigger, options} of this.actions.getAll()) {
      const isHide = await options.hide?.(ctx);
      const triggerText = await this.resolveConstOrContextFn(ctx, trigger);
      const button = Markup.button(triggerText, isHide);

      const lastRow = rows[rows.length-1];
      if (options.joinLeft && Array.isArray(lastRow)) {
        lastRow.push(button);
        continue;
      }

      rows.push([button]);
    }

    return Markup.keyboard(rows).resize();
  }

  private async setupHandlers(ctx: Context): Promise<void> {
    for (const {trigger, handler, options} of this.actions.getAll()) {
      const isHide = await options.hide?.(ctx);
      if (isHide) return;

      const triggerText = await this.resolveConstOrContextFn(ctx, trigger);
      this.hears(triggerText, handler);
    }
  }

  async resolveConstOrContextFn<T extends string | boolean | number>(ctx: Context, data: ConstOrContextFn<Context, T>): Promise<T> {
    return typeof data === 'function' ? await data(ctx) : data;
  }
}
