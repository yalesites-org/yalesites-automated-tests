import { expect as baseExpect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Result, NodeResult, AxeResults } from "axe-core";

/*
 * Output axe result violations in a format that is easier to read.
 *
 * @param {Result[]} violations - An array of violations
 *
 * @returns {string} - A string with the violations formatted for output.
 *
 */
const violationOutput = {
  outputViolations: (violations: Result[]) => {
    return violations
      .map((violation) => violationOutput._outputViolation(violation))
      .join("\n");
  },

  _outputViolation: (violation: Result) => {
    let { id, impact, description, nodes } = violation;

    let message = "";

    message += `\n`;
    message += `--------------------------------------------------------------------------------\n`;
    message += `Violation: ${id} (${impact})\n`;
    message += `Description: ${description}\n`;
    message += `Affected nodes:\n`;
    message += violationOutput._outputNodes(nodes);

    return message;
  },

  _outputNodes: (nodes: NodeResult[]) => {
    return nodes.map((node) => violationOutput._outputNode(node, 1)).join("\n");
  },

  _outputNode: (node: NodeResult, indention = 0) => {
    let { html, target } = node;

    let indentionString = "  ".repeat(indention);
    let message = "";

    message += `${indentionString}----------------------------------------\n`;
    message += `${indentionString}${target}\n`;
    message += `${indentionString}${html}\n`;
    message += `${indentionString}${node.failureSummary}\n`;

    return message;
  },
};

/*
 * Extend the expect object with a new matcher to check for accessibility.
 *
 * @param {Page} page - The page to test
 * @param {string[]} tags - An array of axe tags to test against
 *
 * @returns {object} - An object with the pass/fail results of the test.
 */
export const expect = baseExpect.extend({
  async toPassAxe(
    page: Page,
    tags: Array<string>,
    options?: { timeout?: number },
    outputBuffer: typeof violationOutput = violationOutput,
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

    const message = pass
      ? () => "True"
      : () => {
          return outputBuffer.outputViolations(results.violations);
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

/*
 * A wrapper around axe-core/playwright to make it easier to use.
 */
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
