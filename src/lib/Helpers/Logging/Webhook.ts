/* eslint-disable @typescript-eslint/indent */
import { Logger } from './Logger';

export class Embed {
  private title: string;
  private url: string;
  private description: string;
  private color: number;
  private author: Author;
  private fields: Field[];
  private thumbnail: Thumbnail;
  private image: Image;
  private footer: Footer;

  constructor();
  constructor(options: EmbedOptions);
  constructor(options?: EmbedOptions) {
    this.title = options?.title ?? '';
    this.url = options?.url ?? '';
    this.description = options?.description ?? '';
    this.color = options?.color ?? 0x000000;
    this.author = options?.author ?? { name: '', icon_url: '' };
    this.fields = options?.fields ?? [];
    this.thumbnail = options?.thumbnail ?? { url: '' };
    this.image = options?.image ?? { url: '' };
    this.footer = options?.footer ?? { text: '', icon_url: '' };
  }

  public setTitle(title: string): Embed {
    this.title = title;
    return this;
  }

  public setUrl(url: string): Embed {
    this.url = url;
    return this;
  }

  public setDescription(description: string): Embed {
    this.description = description;
    return this;
  }

  public setColor(color: number): Embed {
    this.color = color;
    return this;
  }

  public setAuthor(author: Author): Embed {
    this.author = author;
    return this;
  }

  public addField(field: Field): Embed {
    this.fields.push(field);
    return this;
  }

  public addFields(fields: Field[]): Embed {
    this.fields.push(...fields);
    return this;
  }

  public setThumbnail(thumbnail: Thumbnail): Embed {
    this.thumbnail = thumbnail;
    return this;
  }

  public setImage(image: Image): Embed {
    this.image = image;
    return this;
  }

  public setFooter(footer: Footer): Embed {
    this.footer = footer;
    return this;
  }

  public resetFields(): Embed {
    this.fields = [];
    return this;
  }
}

type Modes = 'info' | 'error' | 'warning';

export class Webhook {
  private url: string;
  private logger: Logger;
  constructor(url: string, logger?: Logger) {
    this.url = url;
    logger !== undefined
      ? (this.logger = logger)
      : (this.logger = new Logger('LOGGING/WEBHOOK'));
  }

  public async send(embed: Embed, mode: Modes = 'info'): Promise<void> {
    embed
      .setColor(
        mode === 'info' ? 0x1fde34 : mode === 'error' ? 0xde1f1f : 0xf5ba0f,
      )
      .setAuthor({
        name: mode[0].toUpperCase() + mode.slice(1),
      })
      .setFooter({
        text: 'Power Gym',
      });
    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });
      embed.resetFields();
      if (res.ok) this.logger.info('Embed was sent successfully.');
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error.message : 'Failed to send embed.',
      );
    }
  }
}

interface EmbedOptions {
  title: string;
  url: string;
  description: string;
  color: number;
  author: Author;
  fields: Field[];
  thumbnail: Thumbnail;
  image: Image;
  footer: Footer;
}

interface Author {
  name: string;
  icon_url?: string;
}

interface Field {
  name: string;
  value: string;
  inline: boolean;
}

interface Thumbnail {
  url: string;
}

interface Image {
  url: string;
}

interface Footer {
  text: string;
  icon_url?: string;
}
