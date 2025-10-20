import type {ComponentHarness, HarnessLoader, HarnessQuery} from "@angular/cdk/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import type {ComponentFixture} from "@angular/core/testing";

export function getHarness<T extends ComponentHarness>(
  fixture: ComponentFixture<unknown>,
  query: HarnessQuery<T>,
): Promise<T> {
  const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);

  return loader.getHarness(query);
}
