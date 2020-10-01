import { BaseScene, Context, Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'typegram';
import { ActionFn, ActionTrigger, ConstOrContextFn, ContextFn, Body } from './generic-types';

type ReplyKeyboard = ReplyKeyboardMarkup['keyboard'];

interface ButtonOptions<Context> {
  readonly hide?: ContextFn<Context, boolean>;
  readonly joinLeft?: boolean;
}

interface InteractionOptions<TContext extends Context> extends ButtonOptions<TContext> {
  do: ActionFn<TContext>,
}

export class ReplyMenuScene<TContext extends Context> extends BaseScene<TContext> {
  private actions: Map<ActionTrigger<TContext>, ActionFn<TContext>> = new Map();
  private keyboard: Map<ActionTrigger<TContext>, ButtonOptions<TContext>> = new Map();

  constructor(
    id: string,
    private body: ConstOrContextFn<TContext, string>,
  ) {
    super(id, null);
    this.enter(async ctx => {
      await this.setupSceneMessage(ctx);
      await this.setupHandlers(ctx);
    });
  }

  interact(text: ConstOrContextFn<TContext, string>, options: InteractionOptions<TContext>): void {
    this.actions.set(text, options.do);
    this.keyboard.set(text, options);
  }

  private async setupSceneMessage(ctx: TContext): Promise<void> {
    const body = await this.renderBody(ctx);
    const keyboard = await this.createMessageKeyboard(ctx);
    await ctx.reply(body, keyboard);
  }

  private async renderBody(ctx: TContext): Promise<Body> {
    if (typeof this.body === 'function') {
      return Promise.resolve(this.body(ctx));
    } else {
      return this.body;
    }
  }

  async renderKeyboard(ctx: TContext): Promise<ReplyKeyboard> {
    return [];
  }

  private async createMessageKeyboard(ctx: TContext): Promise<Markup<ReplyKeyboardMarkup>> {
    const rows: { text: string; hide: boolean; }[][] = [];

    for (const [text, options] of this.keyboard.entries()) {
      const lastRow = rows[rows.length-1];
      const trigger = await this.resolveActionText(ctx, text);
      const button = Markup.button(trigger);

      if (options.joinLeft && Array.isArray(lastRow)) {
        lastRow.push(button);
        return;
      }

      rows.push([button]);
    }

    return Markup.keyboard(rows, null).resize();
  }

  private async setupHandlers(ctx: TContext): Promise<void> {
    for (const [text, action] of this.actions.entries()) {
      const trigger = await this.resolveActionText(ctx, text);
      this.hears(trigger, action);
    }
  }


  private async resolveActionText(ctx: TContext, text: ConstOrContextFn<TContext, string>): Promise<string> {
    if (typeof text === 'function') {
      return Promise.resolve(text(ctx));
    } else {
      return text;
    }
  }
}
