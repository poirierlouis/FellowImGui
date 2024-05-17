import Dexie, {Table} from "dexie";
import {FIGTemplateEntity} from "../entities/template.entity";

export class Database extends Dexie {
  readonly templates!: Table<FIGTemplateEntity, number>;

  constructor() {
    super('FIGDatabase');
    this.version(1).stores({
      templates: '++id'
    });
  }
}

export const db = new Database();
