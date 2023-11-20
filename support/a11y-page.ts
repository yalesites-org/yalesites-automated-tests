import { expect as baseExpect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Result, NodeResult, AxeResults } from "axe-core";

export const expect = baseExpect.extend({
  async toBeAccessible(
    page: Page,
    tags: Array<string>,
    options?: { timeout?: number },
  ) {
    const axePage = new AxePage(page, { tags, ...options });
    let pass: boolean;
    let matcherResult: any;
    const expected = 0;

    const results = await axePage.evaluate();

    try {
      baseExpect(results.violations.length).toBe(0);
      pass = true;
    } catch (e: any) {
      pass = false;
      matcherResult = e.matcherResult;
    }

    const message = pass ? () => "True" : () => {
      let message = `Violations for ${page.url()}\n`;
      message += outputViolations(results.violations);

      return message;
    };

    return {
      message,
      pass,
      name: "toBeAccessible",
      expected,
      actual: matcherResult?.actual,
    };
  },
});

const outputViolations = (violations: Result[]) => {
  return violations.map((violation) => _outputViolation(violation)).join('\n');
};

const _outputViolation = (violation: Result) => {
  let { id, impact, description, nodes } = violation;

  let message = "";

  message += (`\n`);
  message += (`----------------------------------------\n`);
  message += (`Violation: ${id} (${impact})\n`);
  message += (`Description: ${description}\n`);
  message += (`Affected nodes:\n`);
  message += _outputNodes(nodes);

  return message;
};

const _outputNodes = (nodes: NodeResult[]) => {
  return nodes.map((node) => _outputNode(node)).join('\n');
};

const _outputNode = (node: NodeResult) => {
  let { html, target } = node;

  let message = "";

  message +=(`  ----------------\n`);
  message +=(`  ${target}\n`);
  message +=(`  ${html}\n`);
  message +=(`  ${node.failureSummary}\n`);

  return message;
};

export class AxePage {
  private readonly axeBuilder: any;
  public results: AxeResults;

  constructor(
    public readonly page: Page,
    public readonly options = { tags: [] },
  ) {
    let axeBuilder = new AxeBuilder({ page });
    if (options.tags && options.tags.length > 0) {
      axeBuilder.withTags(options.tags);
    }
    this.axeBuilder = axeBuilder;
  }

  async evaluate() {
    this.results = await this.axeBuilder.analyze();
    return this.results;
  }
}
