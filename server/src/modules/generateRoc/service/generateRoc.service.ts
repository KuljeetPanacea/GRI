import { Injectable } from "@nestjs/common";
import { RocDataFetcher } from "./rocDataFetcher";
import { TemplateContextBuilder } from "./templateContextBuilder";
import { WordDocumentRenderer } from "./wordDocumentRenderer";

@Injectable()
export class GenerateRocService {
  constructor(
    private readonly fetcher: RocDataFetcher,
    private readonly contextBuilder: TemplateContextBuilder,
    private readonly renderer: WordDocumentRenderer
  ) {}

  async generateRocDocument(projectId: string): Promise<Buffer> {
    const rocData = await this.fetcher.fetch(projectId);
    const context = this.contextBuilder.build(rocData);
    return this.renderer.render(context);
  }
}
