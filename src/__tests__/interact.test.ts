import { ReplyMenuScene } from '../reply-menu-scene';

describe('ReplyMenuScene.interact', () => {
  it('should add button to keyboard', async () => {
    const btnText = 'Button';
    const resultKeyboard = [[btnText]];

    const menu = new ReplyMenuScene('id', 'body');

    menu.interact(btnText, {
      do: () => {
        throw new Error('not must be called');
      },
    });

    const keyboard = await menu.renderKeyboard(undefined);

    expect(keyboard).toEqual(resultKeyboard);
  });
});
