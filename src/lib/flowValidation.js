export const validateFlow = (nodes, edges) => {
  const errors = [];
  const errorNodes = new Set();

  // 1. Exactly one Trigger node required
  const triggers = nodes.filter(n => n.type === 'trigger');
  if (triggers.length === 0) {
    errors.push("Your flow must have a Trigger node to start.");
  } else if (triggers.length > 1) {
    errors.push("Your flow can only have ONE Trigger node.");
    triggers.forEach(t => errorNodes.add(t.id));
  }

  // 2. Max 20 nodes per flow
  if (nodes.length > 20) {
    errors.push(`You have ${nodes.length} nodes. The maximum allowed is 20.`);
  }

  // 3. Check for orphans (nodes not reachable from trigger)
  if (triggers.length === 1) {
    const reachable = new Set();
    const stack = [triggers[0].id];
    
    while (stack.length > 0) {
      const current = stack.pop();
      if (!reachable.has(current)) {
        reachable.add(current);
        const outgoingEdges = edges.filter(e => e.source === current);
        outgoingEdges.forEach(e => stack.push(e.target));
      }
    }

    nodes.forEach(n => {
      if (!reachable.has(n.id)) {
        errors.push(`Node "${n.data.label}" is disconnected from the main flow.`);
        errorNodes.add(n.id);
      }
    });
  }

  // 4. Every Condition node must have both YES and NO handles connected
  const conditionNodes = nodes.filter(n => n.type === 'condition');
  conditionNodes.forEach(c => {
    const outgoingYes = edges.find(e => e.source === c.id && e.sourceHandle === 'yes');
    const outgoingNo = edges.find(e => e.source === c.id && e.sourceHandle === 'no');
    
    if (!outgoingYes || !outgoingNo) {
      errors.push(`Condition node "${c.data.label}" must have both YES and NO paths connected.`);
      errorNodes.add(c.id);
    }
  });

  // 5. Delay node must not be the last node
  const delayNodes = nodes.filter(n => n.type === 'delay');
  delayNodes.forEach(d => {
    const outgoing = edges.find(e => e.source === d.id);
    if (!outgoing) {
      errors.push(`Delay node "${d.data.label}" cannot be the end of the flow. Connect an action after it.`);
      errorNodes.add(d.id);
    }
  });

  return { isValid: errors.length === 0, errors, errorNodes: Array.from(errorNodes) };
};
