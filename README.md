# Telegraf Reply Menu

## Example
```typescript
import { ReplyMenuScene } from 'telegraf-reply-menu';

const mainMenuScene = new ReplyMenuScene('mainMenuId', ctx => `Hi, ${ctx.from.username}`);

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

// Register and use like default scene
stage.register(mainMenuScene);
```
