import {Table, UpdateSpec} from "dexie";
import {EMPTY, Observable} from "rxjs";
import {Database} from "./database";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {FIGEntity} from "../entities/entity";

export abstract class CrudRepository<T extends FIGEntity> {
  protected constructor(protected readonly db: Database) {
  }

  protected abstract get table(): Table<T, number>;

  public findAll(): Observable<T[]> {
    return fromPromise(this.table.toArray());
  }

  public findById(id: number): Observable<T | undefined> {
    return fromPromise(this.table.get(id));
  }

  public create(entity: T): Observable<number> {
    return fromPromise(this.table.add(entity));
  }

  public update(entity: T): Observable<number> {
    const id: number | undefined = entity.id;

    if (id === undefined) {
      return EMPTY;
    }
    entity = {...entity};
    delete entity.id;
    return fromPromise(this.table.update(id, entity as UpdateSpec<T>));
  }

  public delete(id: number): Observable<void> {
    return fromPromise(this.table.delete(id));
  }

}
