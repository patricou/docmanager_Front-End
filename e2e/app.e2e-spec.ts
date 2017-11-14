import { DocmanagerPage } from './app.po';

describe('docmanager App', function() {
  let page: DocmanagerPage;

  beforeEach(() => {
    page = new DocmanagerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
