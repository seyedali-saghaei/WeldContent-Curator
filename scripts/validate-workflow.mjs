import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const projectRoot = path.resolve(import.meta.dirname, '..');
const workflowPath = path.join(
  projectRoot,
  'workflow',
  'welding-media-curator.template.json',
);

const source = fs.readFileSync(workflowPath, 'utf8');
const workflow = JSON.parse(source);
const errors = [];

const nodeNames = new Set(workflow.nodes?.map(node => node.name));
const connectionNames = new Set(Object.keys(workflow.connections || {}));

if (workflow.active !== false) {
  errors.push('The public workflow must remain inactive.');
}

if (workflow.id || workflow.versionId || workflow.meta) {
  errors.push('Workflow or instance metadata is present.');
}

for (const node of workflow.nodes || []) {
  if (node.credentials) {
    errors.push(`Credential binding found in node: ${node.name}`);
  }
}

for (const connectionName of connectionNames) {
  if (!nodeNames.has(connectionName)) {
    errors.push(`Connection key has no matching node: ${connectionName}`);
  }
}

for (const outputs of Object.values(workflow.connections || {})) {
  for (const group of outputs.main || []) {
    for (const connection of group || []) {
      if (!nodeNames.has(connection.node)) {
        errors.push(`Connection targets a missing node: ${connection.node}`);
      }
    }
  }
}

const secretPatterns = [
  /sk-[A-Za-z0-9_-]{16,}/,
  /AIza[A-Za-z0-9_-]{20,}/,
  /bot\d{8,}:[A-Za-z0-9_-]{20,}/,
  /\d{8,}:[A-Za-z0-9_-]{20,}/,
];

for (const pattern of secretPatterns) {
  if (pattern.test(source)) {
    errors.push(`Possible secret matched pattern: ${pattern}`);
  }
}

if (errors.length > 0) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(
  `Workflow validation passed: ${nodeNames.size} nodes, ` +
  `${connectionNames.size} connected node groups.`,
);
