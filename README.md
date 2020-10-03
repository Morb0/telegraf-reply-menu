# Telegraf Reply Menu

## ⚠️ Warning
Work only with a [custom version of Telegraf](https://github.com/Morb0/telegraf) (fork of develop branch)

## Example
```typescript
import { ReplyMenuScene } from 'telegraf-reply-menu';

// --- Main Menu ---
const mainMenuScene = new ReplyMenuScene(MAIN_MENU_ID, ctx => `Hi, ${ctx.from.username}`);

// Basic interact
mainMenuScene.interact('First', {
  do: async ctx => {
    await ctx.reply('Foo');
  },
});

// Join left button row
mainMenuScene.interact('Second', {
  do: async ctx => {
    await ctx.reply('Bar');
  },
  joinLeft: true,
});

// Hide button if by condition
mainMenuScene.interact('Third', {
  do: async ctx => {
    await ctx.reply('Baz');
  },
  hide: ctx => ctx.from.id === 1,
});

// Enter another scene after click
mainMenuScene.navigate('Submenu', SUB_MENU_ID);

// --- Sub menu ---
const subMenuScene = new ReplyMenuScene(SUB_MENU_ID, 'This is sub menu');

subMenuScene.interact('Click', {
  do: async ctx => {
    await ctx.reply('Hey');
  },
});

subMenuScene.navigate('Back', MAIN_MENU_ID);

// Register and use like default scene
stage.register(mainMenuScene, subMenuScene);
```
