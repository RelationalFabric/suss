# Suss: Relational Propagators for Distributed Causal Logic

Reference TypeScript implementation of **RaCSTS** (Relational and Causal State Transition System).

## Overview

Suss implements the RaCSTS specification for serializable propagator networks. It enables networks to become first-class values that can be serialized, inspected, versioned, and transmitted across boundaries.

**Key Features:**
- ✅ Serializable propagator networks (pause/resume as values)
- ✅ Bidirectional constraints with automatic reconciliation
- ✅ Leader-free consensus via Sync operations
- ✅ Causal ordering with Hybrid Epoch Clock
- ✅ Six standard higher-order relations
- ✅ Template links for compact graph representation
- ✅ Full TypeScript type safety

## Installation

```bash
npm install @relational-fabric/suss immutable
```

**Dependencies:**
- `immutable` - Persistent data structures
- `vitest` - Testing framework (included)

**Peer Dependencies:**
- `typescript` >= 5.0.0
- `eslint` >= 9.0.0

## Quick Start

### Basic Network with Linear Relation

```typescript
import { createPREL, createNode, createLink } from '@relational-fabric/suss'
import { linear } from '@relational-fabric/suss'
import { createInitialT } from '@relational-fabric/suss'

// Create temperature converter: F = 32 + 1.8 * C
const t0 = createInitialT(0, 100)
const prel = createPREL(t0)

// Create nodes
const celsius = createNode({ temp: [['celsius', 25]] }, t0, 'observed')
const fahrenheit = createNode({ temp: [['fahrenheit', 77]] }, t0, 'derived')

// Create linear relation
const tempRelation = linear(32, 1.8)

// Add to network
const network = {
  ...prel,
  nodes: prel.nodes.set('celsius', celsius).set('fahrenheit', fahrenheit),
  relations: prel.relations.set('temp', tempRelation),
  links: prel.links.push(createLink('node:celsius', 'node:fahrenheit', 'temp')),
}

// Serialize network
import { pack } from '@relational-fabric/suss'
const json = pack(network)
```

### Serialization

```typescript
import { pack, unpack } from '@relational-fabric/suss'

// Serialize
const json = pack(network)

// Deserialize
const restored = unpack(json)
```

## Architecture

Suss provides four core operations:

1. **Monotonic Injector** - Add operations to change sets with T-ordering
2. **Log Aggregator** - Collapse redundant operations
3. **Execution Engine** - Materialize Values through interpretation
4. **Constraint Solver** - Align cells according to relations

## Standard Relations

Six higher-order relations provide common propagation patterns:

- **mark** - Directional truth propagation (status flags)
- **linear** - Bidirectional numeric (y = a + bx)
- **map** - Functional bridge with forward/backward functions
- **constrain** - Multi-variable constraint solver
- **reduce** - N→1 aggregation
- **join** - N→M relational knitting

## Documentation

For complete specification details, see the [RaCSTS Whitepaper](./docs/whitepapaers/Relational%20Causal%20State%20Transition%20System.md).

## License

MIT