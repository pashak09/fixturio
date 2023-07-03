export type DependencyNode = {
  readonly key: string;
  readonly dependencies: readonly string[];
};

export function dependencyResolver(input: readonly DependencyNode[]): readonly string[] {
  const keyMap: Record<string, DependencyNode> = {};
  const result: string[] = [];

  input.forEach((node: DependencyNode) => {
    if (keyMap[node.key]) {
      throw new Error(`Duplicate key found: ${node.key}`);
    }

    keyMap[node.key] = node;
  });

  const visit = (key: string, ancestors: Set<string>) => {
    if (ancestors.has(key) === true) {
      throw new Error(`Circular dependency detected: ${[...ancestors, key].join(' -> ')}`);
    }

    const node = keyMap[key];

    if (node === undefined) {
      throw new Error(`Dependency not found: ${key}`);
    }

    ancestors.add(key);

    if (new Set(node.dependencies).size !== node.dependencies.length) {
      throw new Error(`Dependencies are not unique for key: ${key}`);
    }

    for (const dependency of node.dependencies) {
      visit(dependency, ancestors);
    }

    ancestors.delete(key);

    if (result.includes(key) === false) {
      result.push(key);
    }
  };

  for (const key of Object.keys(keyMap)) {
    visit(key, new Set<string>());
  }

  return result;
}
