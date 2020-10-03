import { Context as TelegrafContext, Stage, Telegraf } from 'telegraf';
import { ReplyMenuScene } from '../src/reply-menu-scene';
import * as SceneContext from 'telegraf/typings/scenes/context';

const MAIN_MENU_ID = 'mainMenuId';

type TelegrafSceneContext = SceneContext.Extended<TelegrafContext>;

interface Context extends TelegrafSceneContext {
  session: {};
}

const mainMenuScene = new ReplyMenuScene(MAIN_MENU_ID, ctx => `Hi, ${ctx.from.username}`);

mainMenuScene.interact('First', {
  do: async ctx => {
    await ctx.reply('Foo');
  },
});

mainMenuScene.interact('Second', {
  do: async ctx => {
    await ctx.reply('Bar');
  },
  joinLeft: true,
});

mainMenuScene.interact('Third', {
  do: async ctx => {
    await ctx.reply('Baz');
  },
  hide: ctx => ctx.from.id === 1,
});

const bot = new Telegraf<Context>('');
const stage = new Stage([mainMenuScene]);

// In-Memory session
let session = {};
bot.use(async (ctx, next) => {
  Object.defineProperty(ctx, 'session', {
    get: () => session,
    set: newValue => {
      session = Object.assign({}, newValue);
    },
  });

  return next();
});
bot.use(stage);
bot.start(Stage.enter(MAIN_MENU_ID, null));
bot.launch()
  .then(() => console.log('Bot launched'));
