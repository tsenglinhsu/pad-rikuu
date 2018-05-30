import { padStart } from 'lodash';
import { action, observable } from 'mobx';
import { getIconSet, IconSize, renderIconSet } from 'src/renderer/CardIconRenderer';
import { BaseStore } from 'src/store/BaseStore';
import { AtlasImage, fetchImage, setImmediate, transformer } from 'src/utils';

interface DBEntry {
  readonly key: string;
  readonly isCards: boolean;
  readonly id: number;
  readonly width: number;
  readonly height: number;
  readonly lastUpdate: number;

  readonly frames: number;
  readonly files: string[];
}

export interface Entry {
  readonly basePath: string;
  readonly width: number;
  readonly height: number;
  readonly frames: number;
  readonly files: string[];
}

export class ImageStore extends BaseStore {
  @observable.shallow
  private readonly images = new Map<string, DBEntry>();

  @observable.shallow
  private readonly icons = new Map<number, false | HTMLImageElement>();

  public resolve(type: string, id: number): Entry {
    const realId = type === 'mons' ? id % 100000 : id;
    const key = `${type}_${padStart(realId.toString(), 3, '0')}`;
    const entry = this.images.get(key);
    if (!entry)
      throw new Error(`no image with id '${key}'`);

    return {
      basePath: `/data/images/${entry.isCards ? 'cards' : 'mons'}`,
      width: entry.width,
      height: entry.height,
      frames: entry.frames,
      files: entry.files
    };
  }

  public async fetchImage(entry: Entry, file?: string) {
    const path = `${entry.basePath}/${file || entry.files[0]}`;
    return await fetchImage(path);
  }

  public async fetchJson(entry: Entry, file?: string) {
    const path = `${entry.basePath}/${file || entry.files[0]}`;
    return await fetch(path).then(resp => resp.json());
  }

  @transformer
  public getIcon(id: number) {
    const realId = id % 100000;
    const { id: setId, col, row } = getIconSet(realId);

    if (!this.icons.has(setId))
      this.renderIcons(setId);

    const setTex = this.icons.get(setId);
    if (!setTex) return null;
    else return {
      image: setTex,
      x: col * IconSize,
      y: row * IconSize,
      width: IconSize,
      height: IconSize
    } as AtlasImage;
  }

  protected async doLoad() {
    const extlist = await fetch('/data/images/extlist.json').then(resp => resp.json());
    this.onLoaded(extlist);
  }

  @action
  private renderIcons(setId: number) {
    this.icons.set(setId, false);
    setImmediate(async () => {
      const data = await renderIconSet(this.root, setId);
      const img = await fetchImage(data);
      this.icons.set(setId, img);
    });
  }

  @action
  private onLoaded(entries: DBEntry[]) {
    this.images.clear();
    for (const entry of entries)
      this.images.set(entry.key, entry);
  }
}