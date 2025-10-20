import {type FIGTemplateEntity, FIGTemplateSerializers} from "../entities/template.entity";
import {FIGJsonReader} from "./json/reader.json";
import {FIGJsonWriter} from "./json/writer.json";

export class FIGTemplateParser {
  public async read(file: File): Promise<FIGTemplateEntity> {
    const data: string = await file.text();
    const json: any = JSON.parse(data);

    return FIGJsonReader.readObject(json, FIGTemplateSerializers, 0);
  }

  public async write(template: FIGTemplateEntity): Promise<File> {
    const data: any = FIGJsonWriter.writeObject(template, FIGTemplateSerializers);
    const json: string = JSON.stringify(data);

    return new File([json], `${template.title}.figt`, {type: "application/json"});
  }
}
