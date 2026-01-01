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

**T:** A logical timestamp for causal ordering. Structure: `[Epoch, SyncedWall, Idx]` where Epoch is a logical counter, SyncedWall is NTP-synchronized wall time, and Idx disambiguates concurrent events. The Idx component uses fractional refinement `Idx = BaseIdx + Round / MaxRounds` to track propagation rounds within a logical time step, making the system linearizable even outside individual P-RELs.

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

**CAnATL (CausalAnnotatedAssociativeTaggedLiteral):** `[T, Tag, Value, Meta?]` — The fundamental cell type in RaCSTS. Contains:
- **T:** Logical timestamp for causal ordering
- **Tag:** Semantic label for the cell's interpretation
- **Value:** The current authoritative state (materialized through interpretation)
- **Meta:** Optional metadata (no preservation guarantees through serialization)

CAnATL is the properly basic data structure for a cell. Everything in a propagator network is ultimately built from CAnATLs. Cells contain only authoritative state—there is no node-level history, window, frame, or context. Any operation that requires prior knowledge must reify that requirement explicitly in the Pulse. Any relation that requires smoothing, debouncing, or temporal context maintains its own private, non-authoritative state.

### 6.3 Data Structure Properties

**Recursive Structure:** ATL can contain nested ATL, enabling arbitrary depth. This makes CAnATL capable of representing networks within networks (meta-circularity).

**Type Safety:** Each level of the hierarchy adds structure: tagging provides semantic identity, annotations provide context, causality provides temporal ordering. The type system enforces these invariants.

**Serializability:** All types are properly basic—they contain only serializable data. No functions, no proxies, no live references. A CAnATL serializes as `[T, Tag, Value, Meta?]` where Value is the current authoritative state, and Values are ultimately built from primitive JavaScript types.

**No Node-Level History:** Cells contain only authoritative state. There is no node-level history, window, frame, or context. Causality lives exclusively in T. Any operation that requires prior knowledge must reify that requirement explicitly in the Pulse. Relations that require temporal context (smoothing, debouncing, moving averages) maintain their own private, non-authoritative state separate from the cell.

### 6.4 Model Entities

To bridge the formal type hierarchy with operational semantics, we define the entities that compose a working RaCSTS network:

**Cell (CAnATL):** The fundamental unit of state. A cell is a `[T, Tag, Value, Meta?]` structure where T provides causal ordering, Tag provides semantic identity, and Value is the current authoritative state. Cells are the "variables" in a propagator network. Cells contain only authoritative state—no history, window, or context at the node level.

**Pulse:** An operation that updates a cell. Structure: `[T, Tag, Args, Meta?]` where T is the logical timestamp, Tag is the operation identifier, Args are operation-specific parameters, and Meta is optional metadata. Pulses are the "currency" of change—they flow through the network carrying updates.

**ObservePulse:** The fundamental operation for introducing external entropy. Structure: `[T, ObserveTag, [Path, Old, New], Meta?]`. This single construct is both the event (what was observed) and the operation (what is proposed). Compare-and-swap semantics are intrinsic—the Pulse is accepted only if the cell's current value equals Old, otherwise it triggers an amnesiac event or refinement (e.g., Sync). There is no generic "Set" operation—all external entropy enters as Observe operations.

**Op Relation:** External operation that introduces entropy into the network. Signature: `op(P-REL, args, P-REL-meta) -> [delta-P-REL, Pulse[], meta']`. Op Relations are the entry points for external change—they create new Pulses that disturb the network from its quiescent state.

**Link Relation:** Internal propagation logic between cells. Signature: `link(src, tgt, meta) -> [srcV, tgtV, meta']`. Link Relations maintain relationships between cells—they are the "constraints" or "physics" of the network.

**Change Set:** A collection of operations applied to cells. Used by toolkit primitives for adding operations, collapsing redundant operations, materializing values, and computing constraint alignments. Change Sets batch operations for efficient application.

**Interpretation:** A function that projects a CAnATL to a materialized Value. Signature: `interpretation(CAnATL) -> Value`. The interpretation defines how a cell's CAnATL structure becomes a concrete value. Each cell is an "Interpretation VM"—it processes operations through its interpretation to produce its current value.

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

#### Observe: The Fundamental Operation

**There is no generic "Set" operation.** All external entropy enters the system as **Observe** operations with intrinsic compare-and-swap semantics.

**ObservePulse Structure:** `[T, ObserveTag, [Path, Old, New], Meta?]`

This single construct is both the event (what was observed) and the operation (what is proposed). Compare-and-swap semantics are intrinsic, not layered on.

**Acceptance Logic:**
1. Resolve Path to the target cell
2. Materialize the cell to its current value Cur (through interpretation)
3. Accept iff Cur == Old, advancing T and applying New
4. Reject otherwise, triggering an amnesiac event (lineage becomes `stale`) or refinement (e.g., Sync)

This eliminates the need for any node-level sequence of past values. What was previously called a "window" was doing two unrelated jobs (CAS support and relation enhancement) and belonged in neither the core state nor the cell model.

**Result:**
- State is minimal and serializable
- Causality lives exclusively in T
- CAS semantics are explicit and auditable
- No structure resembles history unless the model explicitly defines one

There is no operation in RaCSTS that reads a prior value implicitly. Any operation that depends on a previous value must receive it explicitly as part of its Pulse arguments. This makes it impossible for a future reader to justify reintroducing a "window-like" structure under another name.

#### Link Relations: Internal Propagation

**Signature:** `link(srcNode: RealNode, tgtNode: RealNode, meta) -> [srcValue, tgtValue, meta']`

**Input:** Full Node objects (RealNode) and link metadata
**Output:** Values and metadata

Link Relations operate on pairs of cells. They:
- Receive the complete **node** objects (not just values) as input
- Observe full node state: value, state, meta, and asOf (timestamp)
- Compute new **values** that satisfy the relationship
- Return values (not nodes) and updated metadata

The relation sees the full context of each node—value, state, meta, and asOf—but returns only the values. The system then uses these returned values to update the nodes, marking them as derived if the value changed. Relations that require temporal context (trend detection, debouncing, moving averages) maintain their own private, non-authoritative state separate from the cells.

#### Higher-Order Relations: Standard Toolkit Primitives

RaCSTS defines six standard higher-order relations that provide common propagation patterns. These are not optional extensions—they are core primitives of the toolkit:

| Relation | Arity | Direction | Purpose |
|----------|-------|-----------|---------|
| **mark** | 1→1 | Directional | Propagate status flags (e.g., dirty flags, validity state) |
| **linear** | 1↔1 | Bidirectional | Numeric constraints with linear relationships (e.g., unit conversion, y=mx+b) |
| **map** | 1↔1 | Bidirectional | Functional transformation with forward/backward functions and conflict resolver |
| **constrain** | N↔N | Bidirectional | Multi-variable constraint solver enforcing f(src, tgt, args) = 0 |
| **reduce** | N→1 | Directional | Aggregation from multiple sources (e.g., hash, sum, count, validation summary) |
| **join** | N→M | Multi-way | Relational knitting connecting multiple sources to multiple targets by shared keys |

**mark (Directional Truth):**
- Propagates status from source to target without moving data literals
- Use case: Dirty flags, validity state, sync status
- When source is updated, target receives the status update

**linear (Bidirectional Numeric):**
- Solves linear relationships (e.g., y = mx + b)
- If source changes, solves for target; if target changes, performs inverse to update source
- Use case: Unit conversions (Celsius ↔ Fahrenheit), layout engines (width ↔ column span)

**map (Functional Bridge):**
- Takes three functions: forward (src → tgt), backward (tgt → src), and conflict resolver
- Handles cases where both nodes change in the same time-step
- Use case: Serializing complex objects to strings, mapping UI state to domain state

**constrain (Bidirectional Solver):**
- Enforces multi-variable constraints (e.g., Balance = Credits - Debits)
- Checks which node is observed to decide which to "repair"
- Use case: Financial ledgers, physics simulations, constraint satisfaction

**reduce (N→1 Aggregation):**
- Requires **Gather Links** (multi-source primitive) to collect from multiple nodes
- Aggregates information from source array into compact target
- Inherently directional—cannot "un-reduce" without extra information
- Use case: Computing hash of object from all fields, total of shopping cart, validity of form

**join (N→M Relational Knitting):**
- Requires **Gather Links** for multi-source collection
- Connects nodes by shared keys or references
- Preserves relational structure while maintaining integrity
- Use case: Foreign-key-like integrity between collections, maintaining joined views

**Gather Links:**
- Extend standard 1→1 links to support N→1 and N→M relations
- Structure: `([src₁, src₂, ..., srcₙ], tgt, args, meta)`
- Relation signature: `Relation(src_nodes[], tgt_node, args, meta) -> [src_updates[], tgt_update, meta']`
- Triggered when any source node in the collection is updated
- Enables reduce and join to operate over sets of nodes

These standard relations make the P-REL predictable and analyzable—a host receiving a value knows exactly what a `linear` or `reduce` link does without inspecting code, enabling potential hardware-level or optimized runtime execution.

**Link Relation Return Patterns:**

A relation's behavior is defined by what it returns—the "repair" it suggests to bring cells into alignment. The relation receives full nodes but returns values:

1. **Fixed Point (No Change):** `[old-src-value, old-tgt-value, old-meta]`
   - The relation is satisfied—cells are already in alignment
   - Returns the current values unchanged
   - No propagation energy is released
   - Example: Target already equals source * 2

2. **Directional Constraint:** `[old-src-value, maybe-new-tgt-value, maybe-new-meta]`
   - Source cell acts as "anchor," target adjusts to satisfy the relationship
   - Returns source value unchanged, computes new target value
   - Most common pattern: source drives target (e.g., B = A × 2)
   - Observed/consensus values typically act as anchors
   - For inverse direction: `[maybe-new-src-value, old-tgt-value, maybe-new-meta]`
   - Example: When source changes, compute and return new target value

3. **Bidirectional Constraint:** `[maybe-new-src-value, maybe-new-tgt-value, maybe-new-meta]`
   - Both cells may adjust to satisfy the relationship
   - Computes new values for both nodes
   - Example: A + B = 10 (if A changes, adjust B; if B changes, adjust A)
   - Both cells marked as derived if values change
   - Useful when both cells have equal authority

**The "maybe-new" prefix** indicates the relation is suggesting a value that may result in an update. The system checks if the suggested value differs from the current value (via structure-independent hash) before applying it.

**Value Update Mechanics:**

Relations don't emit Observe operations because they don't observe new values—they compute them. When a node receives a new value from a relation:
- The node's value is updated to the new value
- The state changes to `'derived'` if it was previously `'observed'` or `'consensus'`
- The asOf timestamp is updated to current time
- If the value changed (checked via structure-independent hash), the round count increments and propagation continues

Relations that require temporal context (e.g., sliding average, trend detection) maintain their own private state separate from the cells. The cell itself contains only authoritative state—no history or temporal context.

#### Value Lineage: Observed, Consensus, Stale, and Derived

A node's value has **state** (also referred to as lineage in conceptual discussions) indicating its provenance and authority. The authority hierarchy:

**observed** > **consensus** > **stale** > **derived**

**1. Observed (Op always wins)**
- Set when **Observe Pulse accepted** (compare-and-swap succeeded: Cur == Old)
- Absolute authority—external observations override everything
- When an Observe Pulse successfully updates a node, state becomes `observed`
- Example: User input, sensor reading, external API response

**2. Consensus (Sync completed)**
- Set by **Sync Op Relations** when consensus reaches quorum
- Second-highest authority—agreed upon by multiple nodes
- Result of successful distributed consensus after detecting staleness
- Example: Configuration parameter agreed by quorum, recovered state

**3. Stale (Observe rejected, seeking consensus)**
- Set when **Observe rejection detected** (incoming Observe Pulse's Old doesn't match node's current value)
- Indicates value is potentially outdated, seeking consensus
- Sync Op can update values with `stale` lineage
- Acts as gate: only stale values participate in consensus
- Example: Node's value=10 but incoming Observe Pulse expects Old=5

**4. Derived (Link computed)**
- Set by **Link Relations** (internal propagation)
- Lowest authority—computed consequences
- Relations return `[maybe-new-src-value, maybe-new-tgt-value, meta]` to suggest updates
- If relation returns new value and it differs (via structure-independent hash), node updates with state `derived`
- Example: Computed sum, derived validity flag, propagated constraint

**Node State:**

| Field | Type | Purpose |
|-------|------|---------|
| `value` | Value | Current value (opaque in RaCSTS, ATL in Suss) |
| `state` | `'observed' \| 'consensus' \| 'stale' \| 'derived'` | Provenance and authority level |
| `meta` | ATL | Metadata |
| `asOf` | [Epoch, SyncedWall, Idx] | Timestamp of last update |

**Authority Rules:**

| Relation Type | Can Update When | Sets State To | Notes |
|---------------|-----------------|---------------|-------|
| Op Relation | Always | `observed` | Absolute authority |
| Sync Op Relation | `state = stale` | `consensus` | Only for stale values |
| Link Relation | `state = derived` | `derived` | Lowest authority |
| Observe Rejection | Any state | `stale` | Old ≠ current triggers this |

**State Transitions:**

- Any state + Observe acceptance (Cur == Old) → `observed`
- Any state + Observe rejection (Old ≠ current) → `stale`
- `stale` + Sync Op completes → `consensus`
- `derived` + Link Relation updates → `derived`
- `consensus`/`observed` + Link Relation attempts update → no change (authority too high)

This four-state model makes authority explicit: external observations win, consensus resolves staleness, stale values seek agreement, and derived values are lowest priority.

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
- All cell values must be preserved
- All timestamps (T) must be preserved  
- All topology (cells, links) must be preserved
- Core P-REL structure (cells, links, causal markers) must round-trip identically

**Metadata Guarantees:**
- Metadata has zero guarantees regarding preservation during serialization cycles
- Implementations may discard, modify, or ignore metadata
- Metadata can be used for optimization (e.g., caching serialized representations) but must not be relied upon for correctness

Pack and unpack are inverses for the core P-REL structure. A serialized network, when deserialized, is indistinguishable from the original in terms of cells, links, and causal markers. Metadata may differ.

#### Scale Invariance

**Operational Definition:**
The same core operations (adding operations to change sets, collapsing redundant operations, materializing values through interpretation, computing constraint alignments) operate identically at:
- **Subnetwork level:** A single CAnATL cell or small network
- **Whole-network level:** A network containing many CAnATL cells
- **Meta-network level:** A network whose Values are themselves networks

**No Special Cases:**
The same code handles all scales. A function that operates on a cell operates identically whether that cell contains an integer, an object, or an entire network. Scale invariance is structural, not implemented.

#### Meta-Circularity

**Operational Definition:**
- A CAnATL cell's Value (the current authoritative state) can be an AnATL containing a network structure
- When materializing such a CAnATL, the interpretation produces a network
- That network can be operated on using the same core operations (adding operations, collapsing redundant operations, materializing values, computing constraint alignments)
- No special handling required: networks containing networks is a natural case of the recursive type structure

**Example:** Cell A contains a simple literal value (42). Cell B contains an entire network as its value. When materialized through their respective interpretations, Cell A produces the number 42, Cell B produces a resumable network structure. Both cells are processed identically by the propagation mechanics—the interpretation determines what the CAnATL "means," not the propagation system.

Meta-circularity is not a feature—it's a consequence of properly basic recursive types.

**Note:** When using persistent immutable data structures (like Immutable.js or structural sharing), the recursive type system naturally preserves history at each level. The structure itself becomes the history.

**Section Total: ~1,600 words**

---

## 7. Grounding the Solution: From Theory to Mechanism

### 7.1 Architecture Overview

RaCSTS achieves serializability through strict separation of concerns:

**Blueprint (P-REL) vs. Runtime (Resolvers):** The P-REL contains only data—CAnATL structures, topology, links, and identifiers. It contains no executable code. At runtime, Node Resolvers and Relation Resolvers provide the implementations referenced by identifiers.

**Opaque Design:** Both nodes and relations are opaque within the P-REL. P-REL stores CAnATL structures for cells, and Node Resolvers convert these to Node objects `{ value, state, meta, asOf }` at runtime. A relation is just an identifier. This opacity is what enables portability—the same P-REL can work with different resolver implementations in different environments.

**Serialization Boundary:** The serialization boundary is precisely the P-REL. Everything in the P-REL is serializable. Everything outside the P-REL (resolvers) is provided at runtime. This makes it trivial to reason about what can be transmitted and what must be locally available.

### 7.2 The Toolkit Primitives

RaCSTS is not a framework—it is a toolkit. Four core operations provide complete control over network state:

#### Monotonic Injector

Adds an operation to a change set. The operation is a Pulse: `[T, Tag, Args, Meta?]`. This operation maintains T-ordering (logical time) and semi-lattice properties (operations can be applied in any order as long as T-ordering is respected).

This is the fundamental way to introduce change into the system.

#### Log Aggregator

Collapses a change set while preserving necessary context. This operation removes redundant operations by performing identity folding—if a value changes 1→2→3, it can be collapsed to 1→3. If a value changes 1→2→1 (circular mutation), it can be collapsed to a no-op.

This is the memory management operation of the system, reducing the size of change sets while maintaining causal integrity.

#### Execution Engine

Projects a CAnATL through an interpretation function to materialize a Value. The interpretation is the "microcode" of the cell—it defines how the CAnATL structure becomes a concrete value.

This is the fundamental way to observe the state of the system.

#### Constraint Solver

Computes operations to align two CAnATL cells according to a relation. Given the current change sets and values of two cells, this operation invokes the relation function to compute new operations that bring the cells into alignment.

This is the fundamental way to maintain relationships in the network.

These four operations are sufficient to build any propagator network. Higher-level abstractions are built from these operations, not baked into the system.

### 7.3 Implementation Requirements

To implement RaCSTS, you must provide:

#### P-REL Structure

The P-REL must contain:
- **Cells:** Map of cell IDs to CAnATL structures `[T, Tag, Value, Meta?]` where Value is the current authoritative state
- **Links:** Map of link IDs to link specifications `[src-selector, tgt-selector, relation-id, args, meta, label?]`
- **Topology:** The connections encoded in link src/tgt selectors (may use template patterns for compact representation)
- **Causal Markers:** All T timestamps across all cells
- **Metadata:** Annotations, link metadata, P-REL-level metadata

Everything in the P-REL must be serializable to JSON or equivalent.

#### Link Selector Syntax

Links use **selectors** to specify source and target cells, enabling pattern-based matching and template expansion. Selectors use the format `type:identifier` or `type:constraint`.

**Selector Format:**
- **Pattern:** `type:id` or `type:constraint`
- **Type Domain:** `node`, `link`, `rel`
- **Identifier:** Exact ID string or constraint expression

**Node Selectors:**
- `node:someId` — Target specific node by ID
- `node:sensor:*` — Wildcard pattern matching all nodes with IDs starting with "sensor:"
- `node:meta.dirty` — Constraint matching nodes where metadata has `dirty` flag set
- `node:type="sensor-reading"` — Constraint matching nodes by type property

**Link Selectors:**
- `link:label="child"` — Target output of any link with label "child"
- `link:label="price-calc"` — Target output of any link with label "price-calc"
- Enables hierarchical propagation: if any child changes, parent's reduce relation triggers

**Relation Selectors:**
- `rel:type="linear"` — Target nodes connected by specific relation type (if applicable)

**Constraint Syntax:**
- **Wildcards:** `*` matches any suffix (e.g., `node:sensor:*` matches `node:sensor:temp`, `node:sensor:humidity`)
- **Metadata paths:** `meta.dirty`, `meta.type`, etc. access node metadata properties
- **Equality:** `type="value"` matches nodes where type property equals value
- **Template variables:** `{{id}}` in target selectors allows dynamic node creation/finding

**Selector Examples:**

| Selector | Matches |
|----------|---------|
| `node:user:123` | Specific node with ID "user:123" |
| `node:item:*` | All nodes with IDs starting with "item:" |
| `node:meta.dirty` | Nodes where metadata has dirty flag |
| `link:label="accumulator"` | Output of any link labeled "accumulator" |
| `node:type="sensor-reading"` | Nodes with type property = "sensor-reading" |

**Propagation Matching:**
1. When node X is updated, engine finds all links where `src-selector` matches X
2. Matching considers: exact ID, wildcard patterns, metadata constraints
3. Also matches links targeting labels of relations that were just triggered (recursive matching)
4. All matched relations execute in current round

#### Template Links

Template links use pattern-based selectors to define propagation rules for entire families of nodes, enabling compact graph representation.

**Template Link Structure:**
- Uses pattern selectors (wildcards, constraints) instead of exact IDs
- Structure: `[src-pattern, tgt-pattern, relation-id, args, meta, label]`
- Expands to concrete links on-demand during propagation

**Template Expansion:**
- **On-demand:** Templates expand when propagation encounters matching nodes
- **Pattern matching:** Engine matches template patterns against node IDs, types, metadata
- **Dynamic discovery:** As network grows (new nodes added), templates automatically apply

**Benefits:**
- **Compact representation:** One template link governs many nodes without serializing individual links
- **Schema of propagation:** Serialize propagation rules, not instance connections
- **Self-organizing:** Network structure resolves dynamically as values change

**Common Template Patterns:**

| Pattern | Template Link | Behavior |
|---------|---------------|----------|
| **Collector (N→1)** | `[node:item:*, node:total-summary, reduce, args, meta, "accumulator"]` | Any node with `item:*` prefix automatically piped into `total-summary` |
| **Shadow (1→1 Map)** | `[node:real:*, node:shadow:{{id}}, map, args, meta, "mirror"]` | `{{id}}` variable creates counterpart shadow node dynamically |
| **Relational Join (M→N)** | `[node:post:*, node:user:{{authorId}}, join, args, meta, "attribution"]` | Knits posts to users based on internal `authorId` field |

**Template Variables:**
- `{{id}}` — Extracts ID from source pattern (e.g., `node:real:123` → `{{id}}` = `123`)
- `{{field}}` — Extracts field value from source node metadata or value
- Enables dynamic target node creation/finding based on source properties

**Example: Collector Pattern**
```
Template: [node:item:*, node:cart-total, reduce, {op: "sum"}, {}, "accumulator"]
Expands to:
  - node:item:apple → node:cart-total
  - node:item:banana → node:cart-total
  - node:item:orange → node:cart-total
  (all automatically, without explicit links)
```

Template links transform the P-REL from a static graph into a **generative graph architecture**—the value size stays constant even as the number of nodes grows.

#### Node Interface

A RealNode (returned by Node Resolver) must provide:
- **value:** The current value (opaque in RaCSTS, ATL in Suss implementation)
- **state:** One of `'observed'` (Observe accepted), `'consensus'` (Sync completed), `'stale'` (Observe rejected, seeking consensus), or `'derived'` (Link computed)
- **meta:** Metadata (ATL)
- **asOf:** Timestamp (T) of last update

Nodes are not CAnATL structures. In RaCSTS, nodes are `{ value, state, meta, asOf }` where value is opaque. In Suss, the value is ATL.

The Node interface is the contract between the system and node implementations.

#### Relation Interface

A RealRelation (returned by Relation Resolver) must provide:
- **Signature:** `(srcNode: RealNode, tgtNode: RealNode, meta) -> [srcValue, tgtValue, meta']`
- **Input:** Full RealNode objects (not just values) and link metadata
- **Output:** Values (not nodes) and updated metadata
- **Full context:** Relations see the complete node state—value, state, meta, and asOf (timestamp)
- **Temporal context:** Relations that require temporal context (trend detection, debouncing, moving averages) maintain their own private, non-authoritative state separate from the cells
- **Reconciliation:** Relations return values that satisfy the relationship. The system applies these values to the nodes.

The Relation interface is the contract for propagation logic.

#### Serialization Format

Pack and unpack operations must:
- **Serialize CAnATL:** `[T, Tag, Value, Meta?]` where T is `[Epoch, SyncedWall, Idx]` (with fractional Idx), Tag is a string, Value is the current authoritative state, and Meta is optional metadata (no preservation guarantees)
- **Serialize Values:** Values are `AnATL | AnTL`, which serialize as nested JavaScript structures
- **Preserve Structure:** Recursive ATL structure must round-trip perfectly
- **Deterministic:** Core P-REL structure (cells, links, causal markers) must round-trip identically. Metadata has zero guarantees and may differ.

Serialization is not an afterthought—it is the fundamental capability of the system.

### 7.4 Operational Semantics

#### Op Execution: Introducing Entropy

When an Op Relation executes:
1. Receives current P-REL, operation arguments, and P-REL metadata
2. Modifies P-REL structure (adds/removes cells, links)
3. Creates Pulses `[T, op, ...args]` with T > any existing T in affected cells
4. Emits Pulses and delta-P-REL
5. Returns updated P-REL metadata

Observe Pulse acceptance is the boundary between external events and internal propagation.

#### Propagation Ripple: Internal Consistency

When Pulses flow through the network:
1. **Selection:** Engine matches Pulses to Link Relations using src-selectors
2. **Context Resolution:** For each matched link, resolve src/tgt cell IDs to RealNode objects and relation-id to RealRelation function
3. **Reconciliation:** Execute `link(srcNode, tgtNode, meta) -> [srcValue, tgtValue, meta']`
   - Relation receives full node objects as input
   - Relation returns values (not nodes) as output
4. **Value Comparison:** Check if returned values differ from current node values using structure-independent hash (Canon)
5. **Update:** If values changed:
   - Update node's value with new value
   - Update node's asOf timestamp
   - Change state to `'derived'` if it was `'observed'` or `'consensus'`
6. **Emit New Pulses:** Updated cells emit new Pulses, triggering connected Link Relations
7. **Iterate:** Increment round count and repeat until no cells accept further operations (quiescence)

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

### 7.5 Serialisability and Linearity in Distributed Systems

While RaCSTS is designed to make networks serializable values, the T structure ensures that these values maintain causal ordering across distributed boundaries. This section describes how the Hybrid Epoch Clock enables both local serialisability and distributed linearity.

#### The Hybrid Epoch Clock

The T structure is always `[Epoch, SyncedWall, Idx]`. The system achieves internal linearizability through fractional refinement of the Idx component.

**Component Roles:**
- **Epoch:** Logical counter that provides the primary causal ordering. This is the "most significant bit" of the timestamp
- **SyncedWall:** NTP-synchronized wall clock time, providing physical time reference
- **Idx:** Disambiguates concurrent events at the same wall time. Uses fractional refinement `Idx = BaseIdx + Round / MaxRounds` to encode internal propagation rounds

This structure makes the system linearizable not just within a single P-REL, but across P-RELs—enabling distributed coordination while maintaining serializability.

#### The Sway Rule: Ensuring Linearizability

When a node receives a remote timestamp T_remote, it must update its local timestamp T_local to maintain strict monotonicity:

```
Sway Rule:
  T_local = [Epoch_local, Wall_local, Idx_local]
  T_remote = [Epoch_remote, Wall_remote, Idx_remote]
  
  if T_local < T_remote:
    Epoch_local ← Epoch_remote + 1
  else:
    Epoch_local ← max(Epoch_local, Epoch_remote) + 1
```

This "Sway Rule" ensures:
- **Strict monotonicity:** Timestamps always advance, never regress
- **Total ordering:** Any two timestamps can be compared unambiguously
- **Clock-drift resilience:** System remains causal even if physical clocks are hours apart

The Epoch carries causality forward, making physical clock synchronization an optimization rather than a requirement.

#### Clock Synchronization via Gossip

While the Sway Rule ensures correctness, clock gossip provides optimization. The system implements vector clock gossip for NTP-style synchronization. Each transmission bundle contains a synchronization timestamp (T_Sync), a dictionary of clocks (Clocks), and an array of pulses (Pulse[]):

Where:
- `T_Sync` is the sender's current `[Epoch, SyncedWall, Idx]` (with Idx containing fractional round if mid-propagation)
- `Clocks` is `Dictionary<NodeId, WallClock>` containing observed timestamps from other nodes
- `Pulse[]` is the array of state transitions being transmitted

**Clock Op as Pulse:**
The Clocks Op is itself a Pulse in the relations index. It:
- Responds to incoming external Clocks
- Computes `Max(Time)` across all observed node clocks
- Emits updated Clocks as a new Pulse
- Provides the data for background NTP-style clock refinement

**Gossip Convergence:**
Over time, clocks converge despite local drift:
1. Each node maintains observed timestamps from other nodes in its Clocks dictionary
2. Transmission bundles carry clock witnesses (subset of recently updated clocks)
3. Receivers merge observed clocks using Max
4. The SyncedWall component gradually aligns across the network

This is an **optional optimization**—the Epoch-based Sway Rule ensures correctness regardless of clock synchronization quality.

#### Internal Linearizability: Fractional Idx Refinement

The Idx component uses fractional refinement to enable strict ordering of internal propagation cycles without advancing physical time. The Idx value equals BaseIdx plus Round divided by MaxRounds. This fractional refinement provides linearizability **even outside individual P-RELs**—when multiple P-RELs are coordinating or when splitting a P-REL across distributed boundaries, the fractional Idx ensures unambiguous ordering.

**Behavior:**
- **External input (Observe Pulse):** Increments BaseIdx, Round starts at 0
- **Internal propagation (Link Relation):** Increments Round, Idx becomes fractional
- **Bounded rounds:** Round ∈ [0, MaxRounds), preventing unbounded fractional growth
- **Serialization:** The computed fractional Idx value is part of T, serialized as a single number

**Example:** When an external Observe Pulse arrives, T might be [5, 1704067200, 42.00] (BaseIdx=42, Round=0). As links propagate, the Round increments: 42.01, 42.02, etc. When quiescence is reached at Round=5, T is [5, 1704067200, 42.05]. The next external Observe Pulse increments BaseIdx to 43 and resets Round to 0, yielding [5, 1704067200, 43.00].

The fractional Idx allows strict ordering of the propagation wavefront without requiring wall clock advancement for each internal step. Critically, this makes timestamps from different P-RELs directly comparable—if P-REL A is at T=[5, 1704067200, 42.03] and P-REL B is at T=[5, 1704067200, 42.07], we can unambiguously order them even though they're separate networks.

#### Implications for Serialisability

This architecture ensures that P-REL serialization preserves causal order across distributed boundaries:

**When packing a P-REL:**
- All T timestamps are serialized as `[Epoch, SyncedWall, Idx]` where Idx contains the fractional refinement
- The Clocks dictionary (if present) is serialized as metadata
- Causal relationships are preserved in the Epoch ordering
- Fractional Idx values are preserved exactly, maintaining internal propagation ordering

**When unpacking a P-REL:**
- Timestamps are restored exactly, including fractional Idx values
- The receiving node applies the Sway Rule to its local clock based on the unpacked Epochs
- Propagation can resume from the exact state where it was serialized
- The fractional Idx allows the receiving node to correctly order unpacked operations relative to its own ongoing propagation

**Cross-P-REL linearizability:**
- A P-REL serialized on Node A can be deserialized on Node B
- Node B's local clock may be completely different
- The Epoch-based ordering ensures Node B correctly orders all operations relative to its local state
- The fractional Idx ensures operations from the unpacked P-REL interleave correctly with Node B's local propagation
- Clock gossip (if enabled) allows Node B to gradually align its SyncedWall with the network

This makes RaCSTS networks truly portable across distributed boundaries—serialization and deserialization are inverses that preserve all causal structure. The fractional Idx refinement is what enables linearizability **outside individual P-RELs**, allowing multiple P-RELs to coordinate or merge while maintaining strict causal ordering.

### 7.6 Leader-Free Consensus via Sync Op: Fixed-Point Gossip

RaCSTS provides a natural mechanism for distributed consensus without request-response protocols, heavyweight locking, or leader election. The Sync Op leverages the propagator network itself to achieve consensus through "rolling snowball" accumulation.

**Why Leader-Free:**

The system achieves consensus without a leader through three foundational properties:

1. **The Sway Rule ensures global linearizability without a central master clock**: When nodes receive remote timestamps, the Epoch-based Sway Rule advances their local clock to maintain total ordering. No central coordinator is needed—each node independently maintains causal correctness through local logic.

2. **Semilattice join operations guarantee convergence without coordination**: The change set model is a join-semilattice. When two nodes have divergent states, they join their states using `NewState = CurrentState ∨ ProposedState`. Because the data model is a semilattice (like CRDTs), both sides are guaranteed to converge on the same result without a central coordinator.

3. **Any node can initiate consensus for any path**: There is no designated leader node that coordinates consensus. Every node has equal authority to emit a Sync Op for any state path. If multiple nodes initiate competing Syncs, they merge naturally through the accumulator dictionary or resolve through Epoch-based ordering.

#### Observe Rejection: The Transition to Stale

An **Observe rejection** occurs when an Observe Pulse arrives at a node but the `Old` value in the Pulse doesn't match the node's current state (Cur ≠ Old). This can happen when:
- A node has been partitioned and rejoins the network
- A P-REL is deserialized in a new environment
- Concurrent updates have diverged
- A node speculatively committed a value that conflicts with network consensus

When an Observe rejection is detected:
1. The node's state transitions to `stale` (regardless of previous state)
2. The stale state acts as a signal: "this value is potentially outdated"
3. This enables Sync Op Relations to update the value
4. The node emits a Sync Op to seek consensus

The transition to `stale` is the trigger for consensus coordination—it opens the gate for distributed agreement.

#### Sync Op Structure

The Sync Op is a specialized Op Relation that emits a consensus accumulator. It takes a count (target threshold for consensus, such as quorum size or node count), a path (state path being decided, like "config" or "LeaderID"), and a dictionary (accumulator mapping nodeId to value).

The Sync Op is not a request-response—it's a **propagating constraint** that accumulates witnesses as it flows through the gossip fabric.

#### The Rolling Snowball Protocol

When RECV processes a Sync Pulse, it follows the accumulation logic:

**1. Identity Check:**
- If `localNodeId` is already in the dictionary: Node has already contributed, do nothing (prevents infinite cycles)

**2. Append:**
- If `localNodeId` is missing: Append `{localNodeId: localValue}` to the dictionary

**3. Threshold Check:**
- If `size(dictionary) < count`: Node emits a new Pulse via Op Relation containing the updated dictionary. This "re-injects" the consensus into the gossip stream
- If `size(dictionary) >= count`: Consensus reached. Mark as **Complete**

**4. Return to Sender (Implicit Loopback):**
- Every node re-emits the message to its connected nodes
- The fully-populated dictionary eventually "washes back" over the entire network
- When any node receives a Sync where `size >= count`, it stops emitting and executes the result
- The result is marked with **consensus lineage**—stronger than derived, weaker than observed

#### Valuation Functions

The final value used is determined by a reduction of the dictionary:
- `Mean(values)`: Average of all witnessed values
- `Mode(values)`: Most common witnessed value
- `Max(values)`: Maximum witnessed value
- `Quorum(values)`: Value from majority of witnesses

#### Consensus as Refinement

The Sync Op leverages the propagator network's fundamental property: **local consistency, global convergence**. This is leader-free consensus because convergence is guaranteed by the mathematical properties of the underlying data structure, not by coordinator logic.

**Semilattice Foundation:**
- The change set model is a join-semilattice (foundation of CRDTs)
- When two nodes receive different Sync dictionaries, they join: `NewState = CurrentState ∨ RemoteState`
- The join operation is:
  - **Commutative**: `A ∨ B = B ∨ A` (order doesn't matter)
  - **Associative**: `(A ∨ B) ∨ C = A ∨ (B ∨ C)` (grouping doesn't matter)
  - **Idempotent**: `A ∨ A = A` (applying twice has no effect)
- These properties guarantee convergence without any central coordinator
- If a network splits and both sides modify the Sync dictionary, they simply join when they reconnect

**Local Network Behavior:**
- Every node is always "correct" relative to its current state
- There is no "invalid" local state—only partial information
- A node doesn't wait for global truth to act; it produces the best possible output based on current local knowledge
- When a remote value arrives, it acts as a **refinement** of local state, triggering new transitions

**Global Convergence:**
- The Sync message isn't a "vote"—it's a **causal wavefront** accumulating witnesses
- Within high-frequency connectivity clusters, `count` reaches threshold almost instantly
- Distant or partitioned nodes are simply "lagging propagators"
- When they receive the Sync message, they provide their refinement and push the snowball further

**Handling Late Arrivals:**
- If a node receives a Sync for a path it has already decided (saw `size >= count` previously), it compares the incoming version
- **Monotonic Refinement:** If incoming message has higher Epoch or more signatures, node updates its belief
- If it's a "ghost" of an older consensus, it's discarded
- The local network remains consistent throughout

#### Advantages

**Non-Blocking:**
- Nodes don't wait for consensus to complete
- They continue processing other Pulses
- Consensus happens "in the background" of normal propagation

**Partition Tolerant:**
- If network splits, the snowball stops growing
- Once partition heals, next gossip exchange merges dictionaries
- Count continues toward threshold after merge

**Leader-Free (No Master):**
- Any node can initiate a Sync Op for any path—no leader election required
- No designated coordinator node
- Multiple concurrent Syncs are handled through:
  - Dictionary merging (semilattice join operation)
  - Epoch-based tie-breaking when paths conflict
  - First to reach `count` wins, or merge dictionaries if compatible
- The propagator network itself IS the coordinator—consensus emerges from local interactions

**Fixed-Point Gossip:**
- The RECV operation naturally supports this pattern
- No special-case consensus protocol needed
- Uses the same propagation mechanics as all other operations
- The gossip fabric itself becomes a distributed computer

#### Example Scenario

Node A detects an Observe rejection when its local value is 10 but an incoming Observe Pulse expects Old=5. Its state transitions to `stale`. It emits a SyncOp with count=3, path="config", and dictionary={A: 10}. Node B receives the Sync, adds itself to the dictionary {A: 10, B: 8}, and re-emits. Node C receives it, adds itself {A: 10, B: 8, C: 9}, and sees that count has been reached (3 nodes). It computes the valuation function (Mode of [10, 8, 9]—no clear mode, so uses Max = 10) and emits the completed Sync. The consensus washes back through the network. All nodes receive the completed Sync (size >= count) and adopt value = 10 with state = `consensus`. The `stale` → `consensus` transition completes. Only a new observed value (external Observe Pulse) can override consensus.

This mechanism treats consensus not as heavyweight coordination, but as a natural consequence of the propagator network's fundamental mechanics. The RECV refinement ensures that fixed-point gossip emerges naturally from the system's core operation.

**The Leader-Free Property:**

Consensus in RaCSTS is leader-free because:
- **No election needed**: The Sway Rule and semilattice properties eliminate the need for leader election protocols
- **No single point of failure**: Any node can initiate consensus; no designated coordinator
- **Partition tolerance**: Network splits don't break consensus—they pause it. Reconnection triggers automatic merge through join operations
- **Zero-Knowledge verification**: Each node independently verifies causal correctness through local Epoch comparison and OLD value matching (transitions to `stale` on mismatch)
- **The network IS the coordinator**: Consensus emerges from the local interactions of propagator cells, not from centralized logic

This is not bolt-on leader-free consensus—it's an emergent property of the propagator network's mathematical foundation.


---

## 8. Real Implementation: Suss

**Strapline:** "Relational Propagators for Distributed Causal Logic"

### 8.1 Overview

**Suss** is the reference TypeScript implementation of RaCSTS. It demonstrates that the specification is not theoretical—it is practical, implementable, and ready for production use.

**Toolkit Philosophy:** Suss provides primitives that compose, not a framework that prescribes. The four core operations (adding operations to change sets, collapsing redundant operations, materializing values through interpretation, computing constraint alignments) are the complete toolkit. Everything else is built from these primitives.

**Purpose:** Suss exists to prove RaCSTS works and to provide practical tooling for building serializable propagator networks in TypeScript. It is opinionated about correctness, not about how you use it.

### 8.2 Reference Implementation

**Correctness and Clarity:** Suss prioritizes correctness and clarity over performance. The implementation demonstrates that RaCSTS is implementable without compromises to the specification.

**The Four Core Operations:** Suss implements the four core operations exactly as specified in the RaCSTS specification. All operate on CAnATL structures and change sets:
- Adding Pulses to change sets while maintaining T-ordering
- Collapsing redundant operations in change sets while preserving causal integrity
- Projecting CAnATL through interpretation functions to materialize values
- Computing reconciliation operations for pairs of cells according to relations

**Type Safety:** Suss is strongly typed. TypeScript types for CAnATL, Value, Pulse, and all other entities ensure correctness at compile time. The type system enforces invariants that would be runtime errors in untyped implementations.

**Serialization:** Suss can serialize P-REL (containing CAnATL structures) to JSON and deserialize JSON back to P-REL with identical CAnATL structures. The implementation demonstrates deterministic round-trip—serializing and deserializing a network produces an identical network.

Serialization is not bolted on—it is fundamental to how Suss works.

### 8.3 Provided Networks

**Shadow Object Propagator:** Suss provides a built-in network for shadow object models. This network:
- Uses CAnATL to represent object state
- Maintains private state for dirty propagation logic (relations maintain their own temporal context)
- Provides dirty propagation (manual triggering)
- Bridges imperative JavaScript code with the propagator model

**Integration Patterns:** Suss demonstrates how to bridge imperative code and the propagator model:
- Convert JavaScript objects to CAnATL structures
- Create Op Relations that emit Pulses from object mutations
- Use Link Relations to synchronize related objects
- Serialize complete object graphs as P-REL snapshots

The Shadow Object Propagator is both a useful primitive and a reference implementation of integration patterns.

### 8.4 Production Considerations

**Performance:** Performance is a function of connectivity, not network size. Networks with high connectivity (many links per cell) require more propagation rounds to reach quiescence. Propagation respects causal ordering across rounds (T-ordering), but within a single round, many nodes can update in parallel as long as they're not causally dependent. Highly connected cells create bottlenecks because they require more rounds to reach quiescence. Sparse networks with low connectivity can be very fast even with many cells.

**Serialization:** Serialization can be optimized by caching serialized representations in metadata. However, metadata has zero guarantees regarding preservation during serialization cycles—implementations may discard, modify, or ignore metadata. Only the core P-REL structure (cells, links, causal markers) is guaranteed to round-trip.

**Storage:** CAnATL cells contain only authoritative state—no history, window, or context at the node level. Relations that require temporal context (smoothing, debouncing, moving averages) maintain their own private, non-authoritative state separate from the cells.

**History Preservation:** Cells do not preserve history. If you need complete history:
- Use persistent immutable data structures (structural sharing preserves history naturally)
- Maintain a separate pulse log to record all operations
- Store snapshots at key points (serialize P-REL periodically)

**Batching:** Batch operations for performance. Instead of computing constraint alignments after every Op, collect multiple Ops and compute alignments once. Change sets enable this naturally.

**Distribution:** Splitting networks across boundaries:
- Serialize P-REL subgraphs
- Transmit P-REL subgraphs as values
- Provide environment-specific resolvers at each boundary
- Use Pulse exchange for cross-boundary propagation

**Sharp Edges and Limitations:**
- Deep recursive ATL structures can cause stack overflow (JavaScript recursion limits)
- Complex propagation graphs (>100 cells, >500 links) may require MaxRounds tuning
- Relations that maintain large private state for temporal context may impact performance

These are not fundamental limitations of RaCSTS—they are implementation trade-offs in the TypeScript reference implementation.

### 8.5 Usage Patterns

#### Simple Network: Basic Propagation

Suss enables building simple networks with two cells connected by a directional relation. For example, a network where cell A contains the value 10 and cell B should always be double that value. The relation observes cell A's value and computes cell B's value. When propagation runs, cell B updates to 20. The network maintains this relationship automatically—if cell A changes, cell B updates accordingly.

#### Bidirectional Relationships

Suss supports bidirectional constraints where multiple cells maintain relationships in both directions. For example, three cells where A = B + C, B = A - C, and C = A - B. When any cell changes, the network propagates updates until all constraints are satisfied. The relation inspects which cells are observed versus derived to determine which values act as anchors and which should be computed.

#### Complex Dependencies: Circular Constraints

Suss handles circular dependencies naturally. Networks with cycles propagate until reaching quiescence—a stable state where all constraints are satisfied. T-ordering ensures forward progress even in complex circular graphs. The system iterates through propagation rounds, with each round advancing logical time, until no further updates occur.

#### Serialization: Pause and Resume

Suss can serialize a network's complete state (P-REL) to JSON at any point. This serialized network can be transmitted across boundaries (browser to server, saved to disk, sent over network) and then deserialized to resume exactly where it left off. The network's topology, cell states, and causal history are preserved. Metadata may or may not be preserved (zero guarantees). This enables true pause-and-resume semantics—a network can be stopped, saved, moved, and continued without loss of core state.

#### Snapshot Files: Bug Reports with Network State

From §1.0's promise: A bug report includes a P-REL snapshot file. In production, when an error occurs, Suss can capture the complete network state at that moment. This snapshot includes all cell values, the propagation graph, and causal history. Metadata may be included but is not guaranteed to be preserved. During debugging, this snapshot can be loaded into a development environment, recreating the exact network state from production. Developers can step through propagation, inspect cell values, modify relations, and verify fixes—all without needing production logs or trying to reproduce the error state manually.

**Section Total: ~1,100 words**

---

## 9. Conclusion: Capabilities Unlocked

### 9.1 The Solution

RaCSTS provides a formal specification for serializable propagator networks. By reframing networks as properly basic data structures built from CAnATL (Causal Annotated Associative Tagged Literals), RaCSTS makes networks into values.

The specification is complete:
- Type hierarchy from Literal to CAnATL defines properly basic types
- Model entities bridge formal definitions to operational semantics
- Core operations (adding operations, collapsing redundant operations, materializing values, computing constraint alignments) provide complete control
- Properties and guarantees (monotonicity, serializable consistency, scale invariance, meta-circularity) are testable

Suss, the TypeScript reference implementation, demonstrates that RaCSTS is practical. The four core operations, strong typing, and serialization capabilities prove that the specification can be implemented without compromises.

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

**Extensions:** Domain-specific propagators for UI, physics, optimization, machine learning. Custom higher-order relations beyond the standard toolkit (mark, linear, map, constrain, join, reduce).

**Integration:** Patterns for integrating RaCSTS networks with existing frameworks. React integration. Redux integration. Database integration.

**Formal Verification:** Proving properties of CAnATL structures and network topologies. Verifying that specific networks always reach quiescence. Static analysis of P-REL structures.

**Ecosystem:** Network libraries for common patterns. Marketplaces for sharing networks. Tooling for inspecting, analyzing, and optimizing P-REL structures.

**Performance:** Optimizations for large-scale networks. Parallel propagation where causal independence allows. Incremental serialization (delta encoding). Persistent immutable data structures for efficient history preservation through structural sharing.

**History and Replay:** Pulse log systems for recording complete operation history. Replay mechanisms for time-travel debugging. Integration with persistent data structures for zero-copy history preservation.

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

**CAnATL (Causal Annotated Associative Tagged Literal):** The fundamental cell type in RaCSTS. Structure: `[T, Tag, Value, Meta?]` containing logical timestamp, semantic tag, current authoritative value, and optional metadata (no preservation guarantees). Cells contain only authoritative state—no history, window, or context at the node level.

**Cell:** A CAnATL structure representing a unit of state in a propagator network. Cells are the "variables" that propagators reconcile.

**Change Set:** A collection of operations (Pulses) applied to cells. Used by toolkit primitives to batch operations.

**Interpretation:** A function that projects a CAnATL to a materialized Value. Defines how a cell's operation history becomes a concrete value.

**Lineage:** The provenance and authority level of a cell's value. Four types in hierarchy: `'observed'` (Op set—always wins), `'consensus'` (Sync completed—beats stale and derived), `'stale'` (Op mismatch detected, seeking consensus—beats derived), `'derived'` (Link computed—lowest authority). Authority: observed > consensus > stale > derived.

**Link Relation:** Internal propagation logic between cells. Signature: `link(srcNode: RealNode, tgtNode: RealNode, meta) -> [srcValue, tgtValue, meta']`. Receives full node objects as input, returns values as output. Maintains relationships.

**Link Selector:** Pattern-based specification for source/target cells in links. Format: `type:id` or `type:constraint`. Supports wildcards (`node:sensor:*`), metadata paths (`node:meta.dirty`), and template variables (`{{id}}`). Enables template links and dynamic graph assembly.

**Monotonicity:** Property that timestamps always increase. Operations are only accepted if they advance logical time. Ensures forward progress.

**Op Relation:** External operation that introduces entropy. Signature: `op(P-REL, args, meta) -> [delta-P-REL, Pulse[], meta']`. Entry point for change.

**P-REL (Parallel Relational Layer):** The serializable blueprint of a network containing topology, state, links, and causal markers.

**Pulse:** An operation that updates a cell. Structure: `[T, op, ...args]`. The "currency" of change in the network.

**Standard Higher-Order Relations:** Six core toolkit primitives: `mark` (directional truth propagation), `linear` (bidirectional numeric constraints), `map` (functional transformation with conflict resolution), `constrain` (bidirectional constraint solver), `reduce` (N→1 aggregation), `join` (N→M relational knitting). These are standard primitives, not optional extensions.

**Template Link:** Link using pattern-based selectors (wildcards, constraints) instead of exact node IDs. Expands to concrete links on-demand during propagation. Enables compact graph representation—one template governs many nodes without serializing individual links. Common patterns: collector (N→1), shadow (1→1), relational join (M→N).

**Quiescence:** State where no further propagation occurs. All cells are stable, no operations accepted. The "solution" to the constraint network.

**Scale Invariance:** Property that the same primitives work at all scales—single cells, subnetworks, whole networks, meta-networks.

**Observe:** The fundamental operation for introducing external entropy. Structure: `[T, ObserveTag, [Path, Old, New], Meta?]`. This single construct is both the event (what was observed) and the operation (what is proposed). Compare-and-swap semantics are intrinsic—the Pulse is accepted only if the cell's current value equals Old, otherwise it triggers an amnesiac event or refinement (e.g., Sync). There is no generic "Set" operation—all external entropy enters as Observe operations.

### Appendix B: Complete Type Definitions

```typescript
// Base Types
type Literal = unknown
type Tag = string
type Path = string
type ObserveTag = string
type T = [Epoch: number, SyncedWall: number, Idx: number] // Idx uses fractional refinement: Idx = BaseIdx + Round / MaxRounds

// Core Types
type TL = [Tag, Literal]
type ATL = { [key: string]: ATL | TL | TL[] }
type Annotations = ATL

// Annotated Types
type AnTL = [Tag, Literal, Annotations]
type AnATL = [ATL, Annotations]

// Value Types
type Value = AnATL | AnTL

// Operation Types
type Args = Value[]
type Meta = ATL
type Old = Value
type New = Value

// Causal Types
type CAnATL = [T, Tag, Value, Meta?] // T: timestamp, Tag: semantic label, Value: current authoritative state, Meta?: optional metadata (no preservation guarantees)

// Model Entities
type Cell = CAnATL
type Pulse = [T, Tag, Args, Meta?] // T: timestamp, Tag: operation identifier, Args: operation-specific parameters, Meta?: optional metadata
type ObservePulse = [T, ObserveTag, [Path, Old, New], Meta?] // Fundamental operation: compare-and-swap semantics intrinsic
type ChangeSet = Pulse[]

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
  args: Args
  meta: Meta
  label?: string
}

// Node interface for Link Relations (receives full node context)
// In RaCSTS: value is opaque. In Suss implementation: value is ATL
interface Node {
  value: Value  // Opaque in RaCSTS, ATL in Suss
  state: 'observed' | 'consensus' | 'stale' | 'derived'
  meta: Meta
  asOf: T  // Timestamp of last update
}

// Op Relation: External operation that introduces entropy
type OpRelation = (
  prel: PREL,
  args: Args,
  meta: Meta
) => [PREL, Pulse[], Meta]

// Link Relation: Internal propagation logic between cells
type LinkRelation = (
  srcNode: Node,
  tgtNode: Node,
  meta: Meta
) => [Value, Value, Meta]
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
