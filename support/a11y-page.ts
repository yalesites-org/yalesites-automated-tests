import { expect as baseExpect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Result, NodeResult, AxeResults } from "axe-core";

const violationOutput = {
  outputViolations: (violations: Result[]) => {
    return violations.map((violation) => violationOutput._outputViolation(violation)).join('\n');
  },

  _outputViolation: (violation: Result) => {
    let { id, impact, description, nodes } = violation;

    let message = "";

    message += (`\n`);
    message += (`--------------------------------------------------------------------------------\n`);
    message += (`Violation: ${id} (${impact})\n`);
    message += (`Description: ${description}\n`);
    message += (`Affected nodes:\n`);
    message += violationOutput._outputNodes(nodes);

    return message;
  },

  _outputNodes: (nodes: NodeResult[]) => {
    return nodes.map((node) => violationOutput._outputNode(node, 1)).join('\n');
  },

  _outputNode: (node: NodeResult, indention = 0) => {
    let { html, target } = node;

    let indentionString = "  ".repeat(indention);
    let message = "";

    message +=(`${indentionString}----------------------------------------\n`);
    message +=(`${indentionString}${target}\n`);
    message +=(`${indentionString}${html}\n`);
    message +=(`${indentionString}${node.failureSummary}\n`);

    return message;
  },
}

export const expect = baseExpect.extend({
  async toPassAxe(
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
      return violationOutput.outputViolations(results.violations);
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
