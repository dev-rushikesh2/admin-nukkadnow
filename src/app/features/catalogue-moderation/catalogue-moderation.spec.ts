import { CatalogueModerationStore } from './state/catalogue-moderation.store';
import { CatalogueModerationRepository } from './data-access/catalogue-moderation.repository';

describe('CatalogueModeration Feature', () => {
  it('should be defined', () => {
    expect(CatalogueModerationStore).toBeDefined();
    expect(CatalogueModerationRepository).toBeDefined();
  });
});
