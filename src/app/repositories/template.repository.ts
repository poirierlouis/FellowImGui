import {Database} from "./database";
import {Injectable} from "@angular/core";
import {FIGTemplateEntity} from "../entities/template.entity";
import {CrudRepository} from "./crud.repository";
import {Table} from "dexie";
import {Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

@Injectable({
  providedIn: 'root'
})
export class TemplateRepository extends CrudRepository<FIGTemplateEntity> {

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
