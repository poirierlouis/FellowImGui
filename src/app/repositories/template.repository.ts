import {Injectable} from "@angular/core";
import type {Table} from "dexie";
import type {Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import type {FIGTemplateEntity} from "../entities/template.entity";
import {CrudRepository} from "./crud.repository";
// biome-ignore lint/style/useImportType: specific to Angular DI
import {Database} from "./database";

@Injectable({
  providedIn: "root",
})
export class TemplateRepository extends CrudRepository<FIGTemplateEntity> {
  // biome-ignore lint/complexity/noUselessConstructor: specific to Angular DI
  constructor(db: Database) {
    super(db);
  }

  protected override get table(): Table<FIGTemplateEntity, number> {
    return this.db.templates;
  }

  public findByTitle(title: string): Observable<FIGTemplateEntity | undefined> {
    return fromPromise(this.table.where({title: title}).first());
  }
}
