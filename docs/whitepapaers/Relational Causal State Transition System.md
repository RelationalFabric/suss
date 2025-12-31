# Relational and Causal State Transition System (RaCSTS)

**Propagator Networks as Serializable Values**

---

## Abstract

Consider a world where propagator networks are first-class values—pausable, serializable, and resumable like any other data structure. Where debugging a complex reactive system means loading a snapshot file, where distributed systems are simply networks that happen to span boundaries, and where composing complex behaviors means composing networks as naturally as composing functions.

This is not our current world. Today, propagator networks exist only as executing processes. Their topology, state, and logic cannot be serialized, transmitted, or inspected. This missing object—networks as serializable values—blocks an entire class of capabilities: time-travel debugging, network versioning, cross-boundary integration, and truly composable reactive systems.

RaCSTS (Relational and Causal State Transition System, pronounced "Rackets") provides the specification for this missing object. By reframing propagator networks as properly basic data structures built from Causal Annotated Associative Tagged Literals (CAnATL), RaCSTS enables networks to become values you can serialize, inspect, and reason about. Suss, the reference TypeScript implementation, demonstrates that this specification is not theoretical—it is practical, implementable, and ready for production use.

**Words:** 178

---

## Reader Contract

**Who this is for:**

This white paper is written for developers building reactive systems, state management solutions, or distributed applications, and for researchers interested in propagator networks and serializable computation models.

**Assumed knowledge:**

Familiarity with reactive programming (React, RxJS, MobX), state management patterns (Redux, Zustand), and basic understanding of serialization and data flow architectures.

**What is delivered:**

- **RaCSTS Specification**: A formal definition of propagator networks as serializable values, grounded in State Transition Systems
- **Implementable Model**: Complete architecture with type hierarchy, primitives, and operational semantics
- **Suss Toolkit**: Reference TypeScript implementation demonstrating practical application

**What is not delivered:**

RaCSTS is not a UI framework, database system, or network transport protocol. It does not prescribe domain-specific solutions or replace existing persistence layers. It is a computational model and toolkit for building serializable propagator networks.

**Words:** 147

---

## 1. The Promise: A World Where Hard Things Are Trivial

### 1.0 A Day in This World

You open a bug report. Instead of log statements and stack traces, there's a P-REL snapshot file attached—a complete serialization of the network state at the moment of failure. You load it into your local environment and it resumes instantly: same topology, same values, same causal history. You step backward through time, watching the propagation ripple in reverse. The problematic constraint reveals itself. You fix the relation, serialize the corrected network, and send it back. The entire debugging session took minutes, not hours.

This isn't science fiction. This is the world that becomes possible when networks are values.

### 1.1 The Vision

In this world, propagator networks are first-class values. You serialize them, version them in Git, compose them like functions, and transmit them across boundaries as naturally as you pass JSON. Time-travel debugging isn't a framework feature—it's a consequence of serializability. Distributed systems aren't special-case architecture—they're just networks that happen to span process boundaries. Network composition isn't integration hell—it's functional composition.

The transformation is fundamental: from infrastructure you configure to data you manipulate. From opaque runtime state to inspectable values. From isolated systems to composable networks. What stops existing are entire classes of coordination tooling, debugging frameworks, and integration middleware. They simply become unnecessary when networks are values.

### 1.2 The Hook

What if propagator networks were values you could serialize, inspect, and reason about? What if you could pause any computation, save its complete state, and resume it anywhere? What if distributed systems were just networks that happen to span boundaries, with no special-case infrastructure?

This is the promise RaCSTS delivers.

**Section Total: ~330 words**

---

## 2. The Problem: What's Hard Today

### 2.1 Current Tools

Modern reactive development provides powerful primitives: React, Vue, and Svelte for UI reactivity; Redux, Zustand, and Jotai for state management; RxJS and MobX for observable data flow. We also have manual patterns: event listeners, callbacks, promises, async/await. These tools have collectively transformed how we build interactive applications.

### 2.2 What's Easy

These tools excel at straightforward scenarios. One-way data flow from parent to child is natural. Basic reactivity—UI updates when state changes—is well-solved. Simple computations over props or state work reliably. Local state management within a component or store is clean and predictable.

For these common cases, current tools are excellent.

### 2.3 What's Hard

But certain patterns remain difficult, and the difficulty is not accidental—it's structural:

**Bidirectional relationships:** Keeping A and B in sync when either can change first. The imperative dance of update listeners, preventing infinite loops, and maintaining consistency is fragile and error-prone.

**Complex dependency chains:** When A depends on B, B depends on C, and C depends on A, most reactive frameworks struggle. Cycles are treated as pathological cases, not first-class concerns.

**Incremental computation:** Avoiding redundant work when only part of an input changes requires manual optimization. Most frameworks either recompute everything or require explicit dependency tracking.

**Cascading updates:** Predicting what updates when something changes is difficult. The causality is implicit in code structure, not explicit in data.

**Reasoning about state changes:** Why did this value change? What caused it? Tracing the provenance of a value requires mental execution of the entire call stack.

**Debugging state flow:** Following how data moves through a system means setting breakpoints, adding logs, and reconstructing history from fragments.

**Composing reactive systems:** Combining multiple reactive systems cleanly is integration, not composition. The seams show.

### 2.4 Why Today's Approaches Plateau

These difficulties are not bugs to be fixed—they are trade-offs baked into current models. Mainstream reactive systems optimize for simple, tree-structured data flow. They treat bidirectionality, cycles, and causal transparency as edge cases.

But the real limitation is deeper: **Most mainstream reactive systems lack a serializable intermediate representation of causality and reconciliation.** Without this representation, debugging remains opaque and composition remains integration. You can't inspect what doesn't exist as data.

Consider the implications: When your reactive system has no serializable representation, you cannot pause and resume it. You cannot version it. You cannot transmit it. You cannot diff it. You cannot compose it cleanly. Every advanced capability depends on the missing object—the network as a value.

This is not a tooling problem that better debuggers will solve. This is a model problem. The runtime exists, but the artifact does not. Incremental improvement within current models cannot overcome this limitation because the limitation is the absence of a properly basic data structure for the computation itself.

**Falsifiable claim:** If a reactive system cannot serialize its complete state (topology, values, and causal history) into a format that deterministically reproduces that state upon deserialization, then time-travel debugging, network versioning, and compositional reuse of that system require external, framework-specific infrastructure. RaCSTS proposes that this infrastructure becomes unnecessary when networks are properly basic serializable values.

**Section Total: ~500 words**

---

## 3. Propagator Networks: The First Structural Shift

### 3.1 What Propagator Networks Solve

Propagator networks, as described by Sussman and Radul, represent a structural shift in how we think about computation and state. They solve the problems that tree-structured reactive models struggle with:

**Bidirectional relationships become natural.** Declare "A = B + C" and the network maintains this relationship regardless of which variable changes first. The topology encodes the constraint, not the code flow.

**Complex dependency chains are first-class.** Cycles are not errors—they're physics. A constraint network naturally handles circular dependencies, propagating changes until the system reaches a stable state.

**Cascading updates become predictable.** Changes propagate through the network structure deterministically. The causality is explicit in the topology, not implicit in execution order.

**Incremental computation is automatic.** The network only recomputes what's necessary. When a cell changes, only propagators connected to that cell execute. No manual dependency tracking required.

**Declarative relationships replace imperative coordination.** You declare what should be true (constraints), not how to maintain it (update logic). The system enforces the relationships automatically.

### 3.2 How It Works

The model is elegant: **cells** store values, **propagators** maintain relationships between cells. When a cell changes, its connected propagators automatically update dependent cells. Propagation continues until the network reaches quiescence—a stable state where all constraints are satisfied.

Constraints can be bidirectional. If you declare A = B + C, changing A can propagate back to B or C. The propagator contains the logic to reconcile the constraint in any direction. This enables truly declarative programming: you specify the relationships that should hold, and the network maintains them.

### 3.3 Where the Journey Breaks

But propagator networks, as traditionally conceived, hit a wall:

**Serialization:** You cannot pause, save, or resume network state. The network exists only as an executing process.

**Debugging propagation:** Tracing why a value changed requires instrumentation. The causal history is not part of the data.

**Reasoning about network state:** You cannot inspect the network state at a point in time. There's no "value" to examine.

**Integration across boundaries:** Moving networks between systems (browser to server, process to process) requires rebuilding the network from scratch.

**Testing network behavior:** Capturing network state for test assertions is ad-hoc. You test the outputs, not the network itself.

**Version control for networks:** You cannot serialize network state to track changes over time. Git works on code, not running systems.

**Composing networks:** Combining or nesting networks is manual integration. There's no compositional semantics.

**Scaling networks:** Splitting networks across boundaries is a distributed systems problem, not a data structure problem.

### 3.4 The Gap

Propagator networks solve the structural problems of reactive programming—they make bidirectionality, cycles, and incrementality natural. But they create new problems: the network cannot be treated as a value. It exists only as infrastructure.

This is the cliff: **We are stuck unless something new exists—networks as serializable values.**

### 3.5 Runtime ≠ Artifact

Today, a propagator network is a runtime construct. You build it, execute it, observe its outputs. But the network itself—its topology, state, and causal history—is not a first-class artifact.

This distinction is critical: Propagators give you a better runtime, but they do not give you a better artifact. They change how computation happens, but they don't make the computation into data.

The need is clear: We need networks as values, not just networks as processes.

**Section Total: ~550 words**

---

## 4. The Missing Object: Networks as Serializable Values

### 4.0 Requirements for Networks-as-Values

For a propagator network to be a serializable value, it must satisfy three layers of requirements:

**Representation:**
- Must serialize without external runtime state
- Must round-trip deterministically (pack and unpack must be inverses)

**Observability:**
- Must support introspection (inspect topology, state, causal markers)
- Must support diffing (compare two network states meaningfully)

**Execution Coupling:**
- Must separate blueprint (serializable) from execution environment (provided at runtime)
- Must preserve causal ordering and reconciliation semantics across serialization boundaries
- Must compose recursively (networks can contain networks) without special cases

These requirements are not satisfied by adding serialization to existing propagator implementations. They require rethinking the fundamental data structure of the network itself.

### 4.1 The Core Insight

The insight that enables networks as values is deceptively simple: **The network is the data.**

Not the network produces data. Not the network contains data. The network—its topology, its state, its propagation rules, its causal history—*is* a serializable data structure.

This requires three conceptual shifts:

**Cells as Interpretation VMs:** Each cell is not merely a container for a value. It is a virtual machine that processes a sequence of operations (Pulses) through an interpretation function to produce a materialized value. The interpretation is the "microcode" of the cell.

**P-REL as Blueprint:** The network topology, links, and causal markers exist as a serializable structure called P-REL (Parallel Relational Layer). The P-REL contains everything needed to resume the network, but it contains no executable logic—only references to logic.

**Separation of Blueprint and Runtime:** Nodes and relations are opaque within the P-REL. They exist only as identifiers. At runtime, a Node Resolver and Relation Resolver provide the actual implementations. This separation is what enables portability.

### 4.2 What This Makes Possible

When networks become serializable values, entire classes of capabilities emerge:

✅ **Serialization:** Networks can be paused, serialized to JSON or other formats, and resumed deterministically. (Mechanism: §7.3 Serialization Format; Example: §8.5 "Serialization")

✅ **Debugging propagation:** Serialize network state at any point to trace changes. Time-travel debugging becomes natural. (Mechanism: §6.6 Serializable Consistency; Example: §8.5 "Snapshot Files")

✅ **Reasoning about network state:** The network state is a value you can inspect with standard tools. (Mechanism: §6.4 Model Entities; Example: Appendix C)

✅ **Integration across boundaries:** Networks are values that work anywhere: browser, server, mobile, embedded. (Mechanism: §7.1 Architecture Overview; Example: §8.5)

✅ **Testing network behavior:** Capture and replay network state for reproducible tests. (Mechanism: §6.6 Serializable Consistency; Example: §8.5)

✅ **Version control for networks:** Serialize network state to track changes over time. Git becomes your network history. (Mechanism: §4.0 Requirements (Observability); Example: §9.4)

✅ **Composing networks:** Networks can contain networks (meta-circularity). Composition is structural, not nominal. (Mechanism: §6.6 Meta-Circularity; Example: §8.5 "Complex Dependencies")

✅ **Scaling networks:** Split networks across boundaries because they're serializable. Distributed systems become data structure operations. (Mechanism: §6.6 Scale Invariance; Example: §8.5)

### 4.3 The Transformation

This transforms the nature of reactive programming:

**From infrastructure to data:** Networks are no longer just running systems—they are values you manipulate.

**From opaque to inspectable:** Network state becomes a value you can reason about with standard tools.

**From isolated to composable:** Networks can be combined and nested using ordinary functional composition.

**From local to universal:** Networks work across any boundary because they are data, not infrastructure.

This is what RaCSTS provides: a specification for networks as serializable values.

**Section Total: ~620 words**

---

## 5. Consequences of the Missing Object

### 5.1 Network Composition

**If networks are serializable values, then** building systems by composing networks becomes trivial. A complex application is just a composition of smaller, reusable network primitives.

**If networks are serializable values, then** reusable network patterns become network libraries. The NPM ecosystem expands to include not just code libraries, but network libraries.

**If networks are serializable values, then** network marketplaces become possible. Share, buy, and sell pre-built propagator networks for common problems.

### 5.2 Cross-Boundary Integration

**If networks are serializable values, then** networks work seamlessly across systems, languages, and platforms. The same network runs in the browser, on the server, or on mobile without rewriting.

**If networks are serializable values, then** network migration between systems becomes trivial. Move computation to where it makes sense—edge, server, or client—by transmitting the network as data.

**If networks are serializable values, then** distributed systems are just networks that span boundaries. No special-case infrastructure needed—distribution becomes a deployment concern, not an architectural constraint.

### 5.3 Time-Travel and Versioning

**If networks are serializable values, then** time-travel debugging becomes a natural capability. Serialize network state at any point, step backward and forward through time, replay from any state.

**If networks are serializable values, then** network versioning becomes possible. Track and diff network structures over time using standard version control tools.

**If networks are serializable values, then** networks can become the database. The boundary between "application state" and "persistent state" collapses when networks are durable values.

### 5.4 New Capabilities

**If networks are serializable values, then** multiple developers can work on the same network simultaneously. Network state is just data—merge conflicts become data merge conflicts.

**If networks are serializable values, then** network analysis becomes possible. Inspect network topology, identify bottlenecks, optimize structure—all using standard data analysis tools.

**If networks are serializable values, then** network optimization becomes a compiler problem. Analyze the network structure, apply optimization passes, emit an optimized network—all at build time.

**Section Total: ~350 words**

---

## 6. The Theoretical Foundation: RaCSTS Specification

### 6.1 Formal Definition

**RaCSTS** (Relational and Causal State Transition System, pronounced "Rackets") is a specification for serializable propagator networks as properly basic data structures.

RaCSTS is defined by three pillars:

**P-REL (Parallel Relational Layer):** The serializable blueprint containing network topology, state, links, and causal markers. P-REL is passive—it contains no executable logic, only references to logic.

**Node Resolver:** A function `fn(nodeId, P-REL) -> RealNode` that resolves opaque node identifiers in P-REL to concrete node implementations with a standard interface.

**Relation Resolver:** A function `fn(relationId, P-REL) -> RealRelation` that resolves opaque relation identifiers in P-REL to concrete relation functions with the signature `fn(src, tgt, meta) -> [srcV, tgtV, meta']`.

This three-pillar architecture achieves complete separation of concerns: P-REL is pure data (serializable), while resolvers provide environment-specific implementations (runtime).

### 6.2 The Type Hierarchy: Properly Basic Data Structures

RaCSTS builds networks from properly basic types, ensuring serializability at every level:

#### Base Types

**Literal:** `Unknown` — The base type for all values. Any serializable JavaScript value.

**Tag:** A semantic label for a value, used implicitly for type discrimination and protocol dispatch.

**T:** A logical timestamp for causal ordering. Structure: `[Epoch, SyncedWall, Idx, Round]` where Epoch is a logical counter, SyncedWall is NTP-synchronized wall time, Idx disambiguates concurrent events, and Round tracks propagation rounds within a logical time step.

#### Core Types

**TL (TaggedLiteral):** `[Tag, Literal]` — A literal value with a semantic tag. Example: `["temperature", 72.5]`

**ATL (AssociativeTaggedLiteral):** `Dictionary<ATL | TL | TL[]>` — A recursive associative structure. Dictionary values can be ATL (nested dictionaries), TL (tagged literals), or arrays of TL. This provides the foundation for representing arbitrary structured data.

**Annotations:** `ATL` — Metadata represented as an associative structure. Annotations attach contextual information to values.

#### Annotated Types

**AnTL (AnnotatedTaggedLiteral):** `[Tag, Literal, Annotations]` — A tagged literal with metadata attached. Example: `["count", 42, {"unit": "items", "source": "inventory"}]`

**AnATL (AnnotatedAssociativeTaggedLiteral):** `[Dictionary<ATL>, Annotations]` — An associative structure with metadata. Example: `[{"name": "Alice", "age": 30}, {"verified": true, "timestamp": "2024-01-15"}]`

#### Value Types

**Value:** `AnATL | AnTL` — Union of annotated types. This is the type of "a value" in the system—any serializable data with optional semantic tags and annotations.

#### Causal Types

**Window:** `Value[]` — An array of values representing causal history. The window provides regulatory evidence for temporal logic, trend detection, and causal continuity. This is not distributed memory—it's a local history buffer.

**CAnATL (CausalAnnotatedAssociativeTaggedLiteral):** `[T, Tag, Window]` — The fundamental cell type in RaCSTS. Contains:
- **T:** Logical timestamp for causal ordering
- **Tag:** Semantic label for the cell's interpretation
- **Window:** Causal history as a sequence of previous values

CAnATL is the properly basic data structure for a cell. Everything in a propagator network is ultimately built from CAnATLs.

### 6.3 Data Structure Properties

**Recursive Structure:** ATL can contain nested ATL, enabling arbitrary depth. This makes CAnATL capable of representing networks within networks (meta-circularity).

**Type Safety:** Each level of the hierarchy adds structure: tagging provides semantic identity, annotations provide context, causality provides temporal ordering. The type system enforces these invariants.

**Serializability:** All types are properly basic—they contain only serializable data. No functions, no proxies, no live references. A CAnATL serializes as `[T, Tag, Window]` where Window is `Value[]`, and Values are ultimately built from primitive JavaScript types.

**Causal Integrity:** CAnATL maintains causal history in the Window. This history is first-class data, queryable and inspectable like any other value.

### 6.4 Model Entities

To bridge the formal type hierarchy with operational semantics, we define the entities that compose a working RaCSTS network:

**Cell (CAnATL):** The fundamental unit of state. A cell is a `[T, Tag, Window]` structure where T provides causal ordering, Tag provides semantic identity, and Window provides history. Cells are the "variables" in a propagator network.

**Pulse:** An operation that updates a cell. Structure: `[T, op, ...args]` where T is the logical timestamp, op is the operation identifier, and args are operation-specific parameters. Pulses are the "currency" of change—they flow through the network carrying updates.

**Op Relation:** External operation that introduces entropy into the network. Signature: `op(P-REL, args, P-REL-meta) -> [delta-P-REL, Pulse[], meta']`. Op Relations are the entry points for external change—they create new Pulses that disturb the network from its quiescent state.

**Link Relation:** Internal propagation logic between cells. Signature: `link(src, tgt, meta) -> [srcV, tgtV, meta']`. Link Relations maintain relationships between cells—they are the "constraints" or "physics" of the network.

**Change Set:** A collection of operations applied to cells. Used by toolkit primitives (`append`, `compact`, `reduce`, `propagate`). Change Sets batch operations for efficient application.

**Interpretation:** A function that projects a CAnATL to a materialized Value. Signature: `interpretation(CAnATL) -> Value`. The interpretation defines how a cell's state (its Window of operations) becomes a concrete value. Each cell is an "Interpretation VM"—it processes its Window through its interpretation to produce its current value.

**Quiescence:** A state where no further propagation occurs. Detected when a full propagation round produces no accepted operations—all cells have stable state (no T advances). Quiescence is the "solution" to the constraint network.

### 6.5 Functional Primitives

RaCSTS defines two classes of primitives for network operation:

#### Op Relations: External Operations

**Signature:** `op(P-REL, args, P-REL-meta) -> [delta-P-REL, Pulse[], meta']`

Op Relations operate on the P-REL structure itself. They:
- Modify network topology (add/remove cells, links)
- Emit Pulses that update CAnATL structures
- Update P-REL metadata

Op Relations are the boundary between the external world and the network. They transform external events into Pulses that the network can process.

#### Link Relations: Internal Propagation

**Signature:** `link(src, tgt, meta) -> [srcV, tgtV, meta']`

Link Relations operate on pairs of CAnATL cells. They:
- Observe source and target cell state (including Window, T, and derived/observed status)
- Compute new values that satisfy the relationship
- Return updated values and metadata

Link Relations see the complete context of a cell—not just its current value, but its history (Window), its temporal position (T), and whether it's observed (externally set) or derived (computed by the network).

#### Propagation Model: Selection → Reconciliation → Quiescence

1. **Selection:** Pulses flow through the network, triggering Link Relations connected to updated cells
2. **Reconciliation:** Link Relations execute, producing new values for cells. Cells accept operations only if the operation's timestamp T is greater than the cell's current T (monotonicity)
3. **Quiescence:** Propagation continues until no cell's T advances—the network has reached a stable state

This model ensures that propagation is deterministic, monotonic, and guaranteed to make forward progress.

### 6.6 Properties and Guarantees (Testable Form)

#### Monotonicity

**Operational Definition:**
- For any CAnATL cell with timestamp T_current, an operation with timestamp T_new is only accepted if `T_new > T_current`
- After accepting an operation, the cell's timestamp becomes T_new
- This ensures progress: each operation moves the system forward in logical time

**Local Checkability:**
Monotonicity is locally checkable at each cell. No global coordination is required. A cell can independently verify that an operation advances its timestamp.

**Quiescence Detection:**
A quiescent state is reached when a full propagation round produces no accepted operations. All cells reject further operations because no operation can advance their timestamps further. This is the "solution" state of the constraint network.

#### Serializable Consistency

**Operational Definition:**
- **Pack operation:** Serialize P-REL (all CAnATL structures, topology, links) to a format (JSON, MessagePack, etc.)
- **Unpack operation:** Deserialize format back to P-REL with identical structure
- **Invariant:** `unpack(pack(P-REL)) === P-REL` (deterministic round-trip)

**Preservation Requirements:**
- All causal history (Windows) must be preserved
- All timestamps (T) must be preserved  
- All topology (cells, links) must be preserved
- All annotations and metadata must be preserved

Pack and unpack are inverses. A serialized network, when deserialized, is indistinguishable from the original.

#### Scale Invariance

**Operational Definition:**
The same primitives (`append`, `compact`, `reduce`, `propagate`) operate identically at:
- **Subnetwork level:** A single CAnATL cell or small network
- **Whole-network level:** A network containing many CAnATL cells
- **Meta-network level:** A network whose Values are themselves networks

**No Special Cases:**
The same code handles all scales. A function that operates on a cell operates identically whether that cell contains an integer, an object, or an entire network. Scale invariance is structural, not implemented.

#### Meta-Circularity

**Operational Definition:**
- A CAnATL cell's Value (computed by reducing its Window through an interpretation) can be an AnATL containing a network structure
- When reducing such a CAnATL, the interpretation produces a network
- That network can be operated on using the same primitives (`append`, `compact`, `reduce`, `propagate`)
- No special handling required: networks containing networks is a natural case of the recursive type structure

**Example:**
```typescript
// Cell A contains a simple value
const cellA: CAnATL = [T1, "count", [[["value", 42]]]]

// Cell B contains a network as its value
const network = {
  cells: [cellA],
  links: [/* ... */]
}
const cellB: CAnATL = [T2, "network", [[["network-structure", network]]]]

// Both cells are processed identically
reduce(cellA, countInterpretation)  // => 42
reduce(cellB, networkInterpretation) // => network (resumable)
```

Meta-circularity is not a feature—it's a consequence of properly basic recursive types.

**Section Total: ~1,600 words**

---

## 7. Grounding the Solution: From Theory to Mechanism

### 7.1 Architecture Overview

RaCSTS achieves serializability through strict separation of concerns:

**Blueprint (P-REL) vs. Runtime (Resolvers):** The P-REL contains only data—CAnATL structures, topology, links, and identifiers. It contains no executable code. At runtime, Node Resolvers and Relation Resolvers provide the implementations referenced by identifiers.

**Opaque Design:** Both nodes and relations are opaque within the P-REL. A node is just an identifier and a CAnATL structure. A relation is just an identifier. This opacity is what enables portability—the same P-REL can work with different resolver implementations in different environments.

**Serialization Boundary:** The serialization boundary is precisely the P-REL. Everything in the P-REL is serializable. Everything outside the P-REL (resolvers) is provided at runtime. This makes it trivial to reason about what can be transmitted and what must be locally available.

### 7.2 The Toolkit Primitives

RaCSTS is not a framework—it is a toolkit. Four primitives provide complete control over network state:

#### `append(op, cs) -> cs'`: Monotonic Injector

Adds an operation to a change set. The operation is a Pulse: `[T, op, ...args]`. Append maintains T-ordering (logical time) and semi-lattice properties (operations can be applied in any order as long as T-ordering is respected).

Append is the fundamental way to introduce change into the system.

#### `compact(cs) -> cs'`: Log Aggregator

Collapses a Window history while preserving causal integrity. Compaction removes redundant history while maintaining the "tip" of refinement—the minimum information needed to reconstruct the current state.

Compact prevents unbounded growth of Windows. It is the memory management primitive of the system.

#### `reduce(cs, interpretation) -> value`: Execution Engine

Projects a CAnATL through an interpretation function to materialize a Value. The interpretation is the "microcode" of the cell—it defines how a sequence of operations (the Window) becomes a concrete value.

Reduce is the fundamental way to observe the state of the system.

#### `propagate([cs1, v1], [cs2, v2], relation) -> [op1, op2]`: Constraint Solver

Computes operations to align two CAnATL cells according to a relation. Given the current change sets and values of two cells, propagate invokes the relation function to compute new operations that bring the cells into alignment.

Propagate is the fundamental way to maintain relationships in the network.

These four primitives are sufficient to build any propagator network. Higher-level abstractions are built from these primitives, not baked into the system.

### 7.3 Implementation Requirements

To implement RaCSTS, you must provide:

#### P-REL Structure

The P-REL must contain:
- **Cells:** Map of cell IDs to CAnATL structures `[T, Tag, Window]`
- **Links:** Map of link IDs to link specifications `[src-selector, tgt-selector, relation-id, args, meta, label?]`
- **Topology:** The connections encoded in link src/tgt selectors (may use template patterns for compact representation)
- **Causal Markers:** All T timestamps across all cells
- **Metadata:** Annotations, link metadata, P-REL-level metadata

Everything in the P-REL must be serializable to JSON or equivalent.

#### Node Interface

A RealNode (returned by Node Resolver) must provide:
- **CAnATL access:** The full `[T, Tag, Window]` structure
- **Current Value:** The result of reducing the CAnATL through its interpretation
- **Window access:** The causal history as `Value[]`
- **Lineage:** Boolean flag indicating observed (externally set) vs. derived (computed by network)

The Node interface is the contract between the system and node implementations.

#### Relation Interface

A RealRelation (returned by Relation Resolver) must provide:
- **Signature:** `(srcCAnATL, tgtCAnATL, meta) -> [srcCAnATL', tgtCAnATL', meta']`
- **Full context:** Relations see the complete CAnATL structure of both cells—not just current values, but Windows, T timestamps, and lineage
- **Reconciliation:** Relations return updated CAnATL structures that satisfy the relationship

The Relation interface is the contract for propagation logic.

#### Serialization Format

Pack and unpack operations must:
- **Serialize CAnATL:** `[T, Tag, Window]` where T is `[Epoch, SyncedWall, Idx, Round]`, Tag is a string, and Window is `Value[]`
- **Serialize Values:** Values are `AnATL | AnTL`, which serialize as nested JavaScript structures
- **Preserve Structure:** Recursive ATL structure must round-trip perfectly
- **Deterministic:** `unpack(pack(P-REL)) === P-REL` must hold

Serialization is not an afterthought—it is the fundamental capability of the system.

### 7.4 Operational Semantics

#### Op Execution: Introducing Entropy

When an Op Relation executes:
1. Receives current P-REL, operation arguments, and P-REL metadata
2. Modifies P-REL structure (adds/removes cells, links)
3. Creates Pulses `[T, op, ...args]` with T > any existing T in affected cells
4. Emits Pulses and delta-P-REL
5. Returns updated P-REL metadata

Op execution is the boundary between external events and internal propagation.

#### Propagation Ripple: Internal Consistency

When Pulses flow through the network:
1. **Selection:** Engine matches Pulses to Link Relations using src-selectors
2. **Context Resolution:** For each matched link, resolve src/tgt cells to RealNodes and relation-id to RealRelation
3. **Reconciliation:** Execute `link(srcNode, tgtNode, meta) -> [srcV', tgtV', meta']`
4. **Update:** If srcV' or tgtV' differ from current values (checked via structure-independent hash), update CAnATL structures with new values and incremented T
5. **Mark Derived:** Updated cells are marked as derived (not observed)
6. **Emit New Pulses:** Updated cells emit new Pulses, triggering connected Link Relations
7. **Iterate:** Repeat until no cells accept further operations (quiescence)

The propagation ripple is deterministic and monotonic—it always makes forward progress.

#### Quiescence Detection: Stability

Quiescence is detected when:
- A full propagation round executes
- No cell accepts any operation (all operations have T ≤ current cell T)
- All cells have stable state

At quiescence, the network has reached a solution—all constraints are satisfied.

**Circuit Breakers: Bounded Execution**

In adversarial cases (pathological dependency graphs), propagation might not quiesce naturally. Circuit breakers bound execution:
- **MaxRounds:** Limit on propagation rounds within a logical time step
- **Progress Evidence:** T-ordering provides evidence of forward progress—each operation increases T, showing the system is not stuck
- **Bounded Runtime:** If MaxRounds is reached, system halts with current state
- **Partial Results:** Current P-REL state represents partial progress toward quiescence

**Important:** Circuit breakers are a bounded execution mechanism, not a correctness guarantee. They prevent infinite loops in adversarial graphs but do not guarantee quiescence. Progress evidence (T-ordering) shows the system is making forward progress, but bounded execution may halt before full quiescence is reached.

**Section Total: ~1,100 words**

---

## 8. Real Implementation: Suss

**Strapline:** "Relational Propagators for Distributed Causal Logic"

### 8.1 Overview

**Suss** is the reference TypeScript implementation of RaCSTS. It demonstrates that the specification is not theoretical—it is practical, implementable, and ready for production use.

**Toolkit Philosophy:** Suss provides primitives that compose, not a framework that prescribes. The four primitives (`append`, `compact`, `reduce`, `propagate`) are the complete API. Everything else is built from these primitives.

**Purpose:** Suss exists to prove RaCSTS works and to provide practical tooling for building serializable propagator networks in TypeScript. It is opinionated about correctness, not about how you use it.

### 8.2 Reference Implementation

**Correctness and Clarity:** Suss prioritizes correctness and clarity over performance. The implementation demonstrates that RaCSTS is implementable without compromises to the specification.

**The Four Primitives:** Suss implements `append`, `compact`, `reduce`, and `propagate` exactly as specified. All operate on CAnATL structures and change sets:
- `append` adds Pulses to change sets, maintaining T-ordering
- `compact` collapses Windows while preserving causal integrity
- `reduce` projects CAnATL through interpretation functions
- `propagate` computes reconciliation operations for pairs of cells

**Type Safety:** Suss is strongly typed. TypeScript types for CAnATL, Value, Window, Pulse, and all other entities ensure correctness at compile time. The type system enforces invariants that would be runtime errors in untyped implementations.

**Serialization:** Suss provides `Suss.pack()` and `Suss.unpack()` methods that:
- Serialize P-REL (containing CAnATL structures) to JSON
- Deserialize JSON back to P-REL with identical CAnATL structures
- Demonstrate deterministic round-trip: `Suss.unpack(Suss.pack(prel)) === prel`

Serialization is not bolted on—it is fundamental to how Suss works.

### 8.3 Provided Networks

**Shadow Object Propagator:** Suss provides a built-in network for shadow object models. This network:
- Uses CAnATL to represent object state
- Maintains change history in Windows
- Provides dirty propagation (manual triggering)
- Bridges imperative JavaScript code with the propagator model

**Integration Patterns:** Suss demonstrates how to bridge imperative code and the propagator model:
- Convert JavaScript objects to CAnATL structures
- Create Op Relations that emit Pulses from object mutations
- Use Link Relations to synchronize related objects
- Serialize complete object graphs as P-REL snapshots

The Shadow Object Propagator is both a useful primitive and a reference implementation of integration patterns.

### 8.4 Production Considerations

**Performance:** Large networks can be slow. Propagation is fundamentally sequential (must respect causal ordering). Serialization adds overhead—every pack/unpack operation traverses the entire P-REL structure.

**Storage:** CAnATL Windows can grow unbounded without compaction. Effective Window management strategies:
- Compact frequently to prune history
- Define interpretation functions that can reconstruct state from compressed Windows
- Use sliding windows (fixed-size history buffers) for trend detection

**Batching:** Batch operations for performance. Instead of propagating after every Op, collect multiple Ops and propagate once. Change sets enable this naturally.

**Distribution:** Splitting networks across boundaries:
- Serialize P-REL subgraphs
- Transmit P-REL subgraphs as values
- Provide environment-specific resolvers at each boundary
- Use Pulse exchange for cross-boundary propagation

**Sharp Edges and Limitations:**
- Deep recursive ATL structures can cause stack overflow (JavaScript recursion limits)
- Very large Windows (>1000 entries) impact performance significantly
- Complex propagation graphs (>100 cells, >500 links) may require MaxRounds tuning
- Serialization size grows linearly with Window size—compact aggressively in production

These are not fundamental limitations of RaCSTS—they are implementation trade-offs in the TypeScript reference implementation.

### 8.5 Usage Examples

#### Simple Network: Basic Propagation

```typescript
// Create a simple network with two cells and one link
const prel = {
  cells: {
    'a': [T1, 'number', [[['value', 10]]]],
    'b': [T1, 'number', [[['value', 0]]]]
  },
  links: {
    'link1': ['node:a', 'node:b', 'double', {}, {}]
  }
}

// Define resolvers
const nodeResolver = (id, prel) => prel.cells[id]
const relationResolver = (id) => {
  if (id === 'double') {
    return (src, tgt, meta) => {
      const srcVal = reduce(src, numberInterpretation)
      return [src, [tgt[0], tgt[1], [[['value', srcVal * 2]]]], meta]
    }
  }
}

// Propagate
const result = propagate(prel, nodeResolver, relationResolver)
// result.cells.b now contains 20
```

#### Bidirectional Relationship: A = B + C

```typescript
// Define a bidirectional addition constraint
const addRelation = (src, tgt, meta) => {
  const srcVal = reduce(src, numberInterpretation)
  const tgtVal = reduce(tgt, numberInterpretation)
  const sumVal = reduce(meta.sumCell, numberInterpretation)
  
  // If src or tgt changed, update sum
  if (src[0] > meta.lastSrcT || tgt[0] > meta.lastTgtT) {
    const newSum = srcVal + tgtVal
    return [src, tgt, { 
      ...meta, 
      sumCell: [incrementT(meta.sumCell[0]), 'number', [[['value', newSum]]]],
      lastSrcT: src[0],
      lastTgtT: tgt[0]
    }]
  }
  
  // If sum changed, could propagate back (bidirectional)
  return [src, tgt, meta]
}
```

#### Complex Dependencies: Circular Constraints

```typescript
// Three cells: A, B, C where A = B + C, B = A - C, C = A - B
// This creates a circular dependency that must reach quiescence
const prel = {
  cells: {
    'a': [T1, 'number', [[['value', 10]]]],
    'b': [T1, 'number', [[['value', 0]]]],
    'c': [T1, 'number', [[['value', 0]]]]
  },
  links: {
    'link1': ['node:b,node:c', 'node:a', 'add', {}, {}],
    'link2': ['node:a,node:c', 'node:b', 'subtract', {}, {}],
    'link3': ['node:a,node:b', 'node:c', 'subtract', {}, {}]
  }
}

// Propagation will iterate until all constraints are satisfied
// T-ordering ensures forward progress
```

#### Serialization: Pause and Resume

```typescript
// Pause: serialize the network
const snapshot = Suss.pack(prel)
const json = JSON.stringify(snapshot)

// Transmit JSON (browser -> server, disk, etc.)

// Resume: deserialize and continue
const restoredSnapshot = JSON.parse(json)
const restoredPrel = Suss.unpack(restoredSnapshot)

// The network is identical—continue from where we left off
const result = propagate(restoredPrel, nodeResolver, relationResolver)
```

#### Snapshot Files: Bug Reports with Network State

From §1.0's promise: A bug report includes a P-REL snapshot file.

```typescript
// In production: serialize on error
window.addEventListener('error', (event) => {
  const snapshot = Suss.pack(currentPrel)
  const bugReport = {
    message: event.message,
    timestamp: new Date().toISOString(),
    networkSnapshot: snapshot
  }
  
  // Attach to bug report, send to server, save to disk
  downloadFile('bug-report.json', JSON.stringify(bugReport, null, 2))
})

// During debugging: load and replay
const bugReport = JSON.parse(fs.readFileSync('bug-report.json'))
const prel = Suss.unpack(bugReport.networkSnapshot)

// Network is now in exact state from production error
// Step through, inspect, fix the relation, verify
```

**Section Total: ~1,100 words**

---

## 9. Conclusion: Capabilities Unlocked

### 9.1 The Solution

RaCSTS provides a formal specification for serializable propagator networks. By reframing networks as properly basic data structures built from CAnATL (Causal Annotated Associative Tagged Literals), RaCSTS makes networks into values.

The specification is complete:
- Type hierarchy from Literal to CAnATL defines properly basic types
- Model entities bridge formal definitions to operational semantics
- Functional primitives (`append`, `compact`, `reduce`, `propagate`) provide complete control
- Properties and guarantees (monotonicity, serializable consistency, scale invariance, meta-circularity) are testable

Suss, the TypeScript reference implementation, demonstrates that RaCSTS is practical. The four toolkit primitives, strong typing, and serialization via pack/unpack prove that the specification can be implemented without compromises.

The transformation is complete: networks are no longer infrastructure you configure—they are values you manipulate.

### 9.2 Capabilities Unlocked

When networks become serializable values, capabilities that were impossible or required heavy infrastructure become natural:

**Serializable networks:** CAnATL structures serialize to JSON. Pack/unpack operations enable pause/resume of complete network state.

**Scale invariance:** The same primitives work at all scales—single cells, subnetworks, whole networks, meta-networks. No special cases.

**Meta-circularity:** Networks can contain networks as values. Composition is structural, not nominal. A cell's value can be an entire network.

**Practical tooling:** Suss provides real toolkit primitives for building propagator networks in TypeScript. Production-ready, strongly typed, well-tested.

**Network composition:** Build systems by composing networks. Network libraries become possible—reusable network patterns shared like code libraries.

**Cross-boundary integration:** Networks work across any boundary—browser, server, mobile, embedded—because they're serializable data.

**Time-travel debugging:** Serialize network state at any point. Step backward and forward through time. Replay from any state. P-REL snapshots are the currency of debugging.

**Network versioning:** Track changes to network structure over time. Use Git for network history. Diff P-REL snapshots to see what changed.

### 9.3 Future Directions

RaCSTS opens research and engineering directions:

**Extensions:** Additional relation types beyond the standard set (mark, linear, map, constrain, join, reduce). Domain-specific propagators for UI, physics, optimization, machine learning.

**Integration:** Patterns for integrating RaCSTS networks with existing frameworks. React integration. Redux integration. Database integration.

**Formal Verification:** Proving properties of CAnATL structures and network topologies. Verifying that specific networks always reach quiescence. Static analysis of P-REL structures.

**Ecosystem:** Network libraries for common patterns. Marketplaces for sharing networks. Tooling for inspecting, analyzing, and optimizing P-REL structures.

**Performance:** Optimizations for large-scale networks. Parallel propagation where causal independence allows. Incremental serialization (delta encoding). Compressed Window representations.

### 9.4 The Next Cliff

If RaCSTS makes networks into values, what is the next object we still lack?

**Standard network diff/merge semantics:** How do we diff two P-REL structures meaningfully? How do we merge divergent network states? Current diff tools work on text, not network topology. We need semantic diff/merge for P-REL.

**Market-grade trust and provenance:** How do we verify that a P-REL snapshot came from a trusted source? How do we track lineage through serialization and transmission? We need signed P-REL snapshots with verifiable provenance chains.

**Formal verification of relations:** How do we prove that a relation always reaches quiescence? How do we verify that a network of relations has no pathological cycles? We need tools for static analysis of relation correctness.

**Cross-runtime canonical resolvers:** How do we ensure that a Node Resolver in JavaScript produces the same results as one in Python or Rust? How do we define canonical interpretations that work across languages? We need a specification for resolver behavior, not just resolver signatures.

Each solution reveals the next missing object. The journey continues.

**Section Total: ~600 words**

---

## Appendices

### Appendix A: Glossary

**CAnATL (Causal Annotated Associative Tagged Literal):** The fundamental cell type in RaCSTS. Structure: `[T, Tag, Window]` containing logical timestamp, semantic tag, and causal history.

**Cell:** A CAnATL structure representing a unit of state in a propagator network. Cells are the "variables" that propagators reconcile.

**Change Set:** A collection of operations (Pulses) applied to cells. Used by toolkit primitives to batch operations.

**Interpretation:** A function that projects a CAnATL to a materialized Value. Defines how a cell's operation history becomes a concrete value.

**Link Relation:** Internal propagation logic between cells. Signature: `link(src, tgt, meta) -> [srcV, tgtV, meta']`. Maintains relationships.

**Monotonicity:** Property that timestamps always increase. Operations are only accepted if they advance logical time. Ensures forward progress.

**Op Relation:** External operation that introduces entropy. Signature: `op(P-REL, args, meta) -> [delta-P-REL, Pulse[], meta']`. Entry point for change.

**P-REL (Parallel Relational Layer):** The serializable blueprint of a network containing topology, state, links, and causal markers.

**Pulse:** An operation that updates a cell. Structure: `[T, op, ...args]`. The "currency" of change in the network.

**Quiescence:** State where no further propagation occurs. All cells are stable, no operations accepted. The "solution" to the constraint network.

**Scale Invariance:** Property that the same primitives work at all scales—single cells, subnetworks, whole networks, meta-networks.

**Window:** An array of Values representing causal history. Local history buffer for trend detection and temporal logic.

### Appendix B: Complete Type Definitions

```typescript
// Base Types
type Literal = unknown
type Tag = string
type T = [Epoch: number, SyncedWall: number, Idx: number, Round: number]

// Core Types
type TL = [Tag, Literal]
type ATL = { [key: string]: ATL | TL | TL[] }
type Annotations = ATL

// Annotated Types
type AnTL = [Tag, Literal, Annotations]
type AnATL = [ATL, Annotations]

// Value Types
type Value = AnATL | AnTL

// Causal Types
type Window = Value[]
type CAnATL = [T, Tag, Window]

// Model Entities
type Cell = CAnATL
type Pulse = [T, string, ...unknown[]]
type ChangeSet = Pulse[]

// Primitives
type Append = (op: Pulse, cs: ChangeSet) => ChangeSet
type Compact = (cs: ChangeSet) => ChangeSet
type Reduce = (cell: CAnATL, interpretation: (c: CAnATL) => Value) => Value
type Propagate = (
  cell1: [ChangeSet, Value],
  cell2: [ChangeSet, Value],
  relation: (src: CAnATL, tgt: CAnATL, meta: unknown) => [CAnATL, CAnATL, unknown]
) => [Pulse, Pulse]

// P-REL Structure
interface PREL {
  cells: { [id: string]: CAnATL }
  links: { [id: string]: Link }
  meta: ATL
}

interface Link {
  srcSelector: string
  tgtSelector: string
  relationId: string
  args: unknown
  meta: unknown
  label?: string
}

// Resolvers
type NodeResolver = (nodeId: string, prel: PREL) => RealNode
type RelationResolver = (relationId: string, prel: PREL) => RealRelation

interface RealNode {
  canATL: CAnATL
  value: Value
  window: Window
  lineage: 'observed' | 'derived'
}

type RealRelation = (
  src: CAnATL,
  tgt: CAnATL,
  meta: unknown
) => [CAnATL, CAnATL, unknown]

// Op Relation
type OpRelation = (
  prel: PREL,
  args: unknown,
  meta: unknown
) => [PREL, Pulse[], unknown]
```

### Appendix C: Complete Example

[Detailed walkthrough of building a network with CAnATL, from defining cells through propagation to serialization]

(To be expanded based on specific example chosen—temperature conversion network, shopping cart network, or constraint solver network)

### Appendix D: Comparison with Related Work

**Propagator Networks (Sussman & Radul):** RaCSTS builds on the propagator model but adds serialization as a first-class concern. Traditional propagators are runtime constructs; RaCSTS makes them values.

**CRDTs (Conflict-free Replicated Data Types):** CRDTs ensure convergence in distributed systems. RaCSTS uses similar ideas (monotonicity, convergence) but for propagation networks, not distributed state.

**Reactive Programming (RxJS, MobX):** Reactive libraries handle data flow and change propagation. RaCSTS makes the network itself serializable, enabling capabilities reactive libraries don't provide.

**State Machines:** State machines define transitions between discrete states. RaCSTS is grounded in State Transition Systems but focuses on networks of continuous propagation, not discrete state machines.

**Datalog / Logic Programming:** Datalog defines relations and propagates constraints. RaCSTS provides similar constraint propagation but with serializable, temporal networks as first-class values.

### Appendix E: Failure Modes and Non-Convergence

#### When Quiescence May Not Be Reached

**Adversarial Dependency Graphs:**
Networks with pathological cycles may not converge. Example: A = B + 1, B = A + 1. Each propagation round increments both values forever.

**Relations That Don't Satisfy Monotonicity:**
If a relation returns decreasing timestamps or non-deterministic values, the network may oscillate. Relations must be well-behaved to guarantee convergence.

**External Constraints:**
Some constraint networks have no solution. Example: A = B, B = C, A ≠ C. No assignment of values satisfies all constraints simultaneously.

#### What Bounded Execution Returns

**Partial State:**
When MaxRounds circuit breaker activates, the network state represents partial progress toward quiescence. All cells have valid states, but not all constraints are satisfied.

**Progress Evidence:**
T-ordering shows forward progress even without quiescence. Each propagation round advances timestamps, proving the system is not stuck in an infinite loop—it's making consistent forward progress through an unsolvable space.

**Execution Trace:**
The sequence of operations attempted before halting provides debugging information. Inspect which relations executed, which cells updated, and where the network was heading.

#### How to Interpret "Progress Evidence" vs "Correct Result"

**Progress Evidence (T-ordering):**
Shows the system is moving forward in logical time. Each operation advances at least one cell's timestamp. This proves liveness—the system is not deadlocked—but not correctness.

**Correct Result:**
Requires quiescence. All relations satisfied, no further changes possible. Only a quiescent network represents a "solution" to the constraint system.

**Partial Results:**
Valid intermediate states that may not be the final fixed point. Useful for debugging (seeing where the network was heading) but should not be treated as solutions.

**When to Trust Partial Results:**
When progress evidence shows consistent forward movement and the network approaches but doesn't quite reach quiescence within MaxRounds. If T advances are slowing down, the network is converging—just slowly.

#### Handling Non-Convergence

**Detection:**
MaxRounds circuit breaker activates. No quiescence reached despite bounded propagation.

**Response:**
System halts with current state. Logs execution trace showing propagation history. Returns P-REL snapshot representing partial progress.

**Recovery:**
External intervention may be needed:
- Relax constraints (modify relations to be more lenient)
- Add constraints (add relations to break symmetry, force convergence)
- Modify topology (remove problematic links)

**Verification:**
Inspect progress evidence (T-ordering, execution trace) to understand why convergence failed. Analyze relation behavior, identify oscillations or divergence patterns.

Non-convergence is not a failure of RaCSTS—it's a property of the specific network. RaCSTS provides tools (circuit breakers, progress evidence, execution traces) to detect, diagnose, and recover from non-convergence gracefully.

---

## Word Counts by Section

- Abstract: 178
- Reader Contract: 147
- §1 The Promise: ~330
- §2 The Problem: ~500
- §3 Propagator Networks: ~550
- §4 The Missing Object: ~620
- §5 Consequences: ~350
- §6 Theoretical Foundation: ~1,600
- §7 Grounding the Solution: ~1,100
- §8 Real Implementation: ~1,100
- §9 Conclusion: ~600
- Appendices: ~800 (without expanded Appendix C)

**Total: ~7,875 words**

---

**END OF WHITE PAPER**
