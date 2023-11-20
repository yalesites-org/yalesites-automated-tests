import { expect, type Page } from '@playwright/test'
import AxeBuilder from "@axe-core/playwright";
import type { Result, NodeResult, AxeResults } from "axe-core";

export class AxePage {
  private readonly axeBuilder: any
  public results: AxeResults

  constructor(public readonly page: Page, public readonly options = { tags: [] }) {
    let axeBuilder = new AxeBuilder({ page })
    if (options.tags && options.tags.length > 0) {
      axeBuilder.withTags(options.tags)
    }
    this.axeBuilder = axeBuilder
  }

  async evaluate() {
    this.results = await this.axeBuilder.analyze()
    if (this.results.violations.length > 0) {
      console.log(`Violations for ${this.page.url()}`)
      this._outputViolations(this.results.violations)
    }
    expect(this.results.violations.length).toBe(0)
    return this.results
  }

  private _outputViolations = (violations: Result[]) => {
    violations.forEach((violation) => this._outputViolation(violation))
  }

  private _outputViolation = (violation: Result) => {
    let { id, impact, description, nodes } = violation

    console.log(`\n`)
    console.log(`----------------------------------------`)
    console.log(`Violation: ${id} (${impact})`)
    console.log(`Description: ${description}`)
    console.log(`Affected nodes:`)
    this._outputNodes(nodes)
  }

  private _outputNodes = (nodes: NodeResult[]) => {
    nodes.forEach((node) => this._outputNode(node))
  }

  private _outputNode = (node: NodeResult) => {
    let { html, target } = node

    console.log(`  ----------------`)
    console.log(`  ${target}`)
    console.log(`  ${html}`)
    console.log(`  ${node.failureSummary}`)
  }
}
