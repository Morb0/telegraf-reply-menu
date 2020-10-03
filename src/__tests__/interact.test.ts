import { Markup } from 'telegraf';
import { ReplyMenuScene } from '../reply-menu-scene';

describe('ReplyMenuScene.interact', () => {
  let menu: ReplyMenuScene<any>;

  beforeEach(() => {
    menu = new ReplyMenuScene<any>('id','body');
  });

  it('should add button to keyboard', async () => {
    const btnText = 'Button';
    const resultKeyboard = Markup.keyboard(
      [[Markup.button(btnText)]],
    ).reply_markup.keyboard;

    menu.interact(btnText, {
      do: () => {
        throw new Error('not must be called');
      },
    });

    const keyboard = await menu.renderKeyboard(undefined);

    expect(keyboard).toEqual(resultKeyboard);
  });

  it('should hide button', async () => {
    const btnText = 'Button';
    const resultKeyboard = Markup.keyboard(
      [[Markup.button(btnText, true)]],
    ).reply_markup.keyboard;

    menu.interact(btnText, {
      do: () => {
        throw new Error('not must be called');
      },
      hide: ctx => true,
    });

    const keyboard = await menu.renderKeyboard(undefined);

    expect(keyboard).toEqual(resultKeyboard);
  });
});
