# Relational and Causal State Transition System (RaCSTS)

**Propagator Networks as Serialisable Values**

---

## Abstract

Consider a world where propagator networks are first-class values—pausable, serialisable, and resumable like any other data structure. Where debugging a complex reactive system means loading a snapshot file, where distributed systems are simply networks that happen to span boundaries, and where composing complex behaviours means composing networks as naturally as composing functions.

This is not our current world. Today, propagator networks exist only as executing processes. Their topology, state, and logic cannot be serialised, transmitted, or inspected. This missing object—networks as serialisable values—blocks an entire class of capabilities: time-travel debugging, network versioning, cross-boundary integration, and truly composable reactive systems.

RaCSTS (Relational and Causal State Transition System, pronounced "Rackets") provides the specification for this missing object. By reframing propagator networks as properly basic data structures built from Causal Annotated Associative Tagged Literals (CAnATL), RaCSTS enables networks to become values you can serialise, inspect, and reason about. Suss, the reference TypeScript implementation, demonstrates that this specification is not theoretical—it is practical, implementable, and ready for production use.

**Words:** 178

---

## Reader Contract

**Who this is for:**

This white paper is written for developers building reactive systems, state management solutions, or distributed applications, and for researchers interested in propagator networks and serialisable computation models.

**Assumed knowledge:**

Familiarity with reactive programming (React, RxJS, MobX), state management patterns (Redux, Zustand), and basic understanding of serialisation and data flow architectures.

**What is delivered:**

- **RaCSTS Specification** (§6): A formal definition of propagator networks as serialisable values, grounded in State Transition Systems [15] (§6.1). Includes complete type hierarchy (§6.2), model entities (§6.4), and functional primitives (§6.5).
- **Implementable Model** (§7): Complete architecture with operational semantics (§7.4), serialisability guarantees (§7.2), and distributed systems support (§7.5-7.6). Demonstrates "distributed systems as data" through P-RAL serialisation (§7.2).
- **Suss Toolkit** (§8): Reference TypeScript implementation demonstrating practical application. Includes performance analysis (§8.4) and usage patterns (§8.5).

**What is not delivered:**

RaCSTS is not a UI framework, database system, or network transport protocol. It does not prescribe domain-specific solutions or replace existing persistence layers. It is a computational model and toolkit for building serialisable propagator networks.

**Words:** 147

---

## 1. The Promise: A World Where Hard Things Are Trivial

### 1.0 A Day in This World

You open a bug report. Instead of log statements and stack traces, there's a P-RAL snapshot file attached—a complete serialisation of the network state at the moment of failure. You load it into your local environment and it resumes instantly: same topology, same values, same causal history. You step backward through time, watching the propagation ripple in reverse. The problematic constraint reveals itself. You fix the relation, serialise the corrected network, and send it back. The entire debugging session took minutes, not hours.

This isn't science fiction. This is the world that becomes possible when networks are values.

### 1.1 The Vision

In this world, propagator networks are first-class values. You serialise them, version them in Git, compose them like functions, and transmit them across boundaries as naturally as you pass JSON. Time-travel debugging isn't a framework feature—it's a consequence of serialisability. Distributed systems aren't special-case architecture—they're just networks that happen to span process boundaries. Network composition isn't integration hell—it's functional composition.

The transformation is fundamental: from infrastructure you configure to data you manipulate. From opaque runtime state to inspectable values. From isolated systems to composable networks. What stops existing are entire classes of coordination tooling, debugging frameworks, and integration middleware. They simply become unnecessary when networks are values.

### 1.2 The Hook

What if propagator networks were values you could serialise, inspect, and reason about? What if you could pause any computation, save its complete state, and resume it anywhere? What if distributed systems were just networks that happen to span boundaries, with no special-case infrastructure?

This is the promise RaCSTS delivers.

**Section Total: ~330 words**

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

**Incremental computation:** Avoiding redundant work when only part of an input changes requires manual optimisation. Most frameworks either recompute everything or require explicit dependency tracking.

**Cascading updates:** Predicting what updates when something changes is difficult. The causality is implicit in code structure, not explicit in data.

**Reasoning about state changes:** Why did this value change? What caused it? Tracing the provenance of a value requires mental execution of the entire call stack.

**Debugging state flow:** Following how data moves through a system means setting breakpoints, adding logs, and reconstructing history from fragments.

**Composing reactive systems:** Combining multiple reactive systems cleanly is integration, not composition. The seams show.

### 2.4 Why Today's Approaches Plateau

These difficulties are not bugs to be fixed—they are trade-offs baked into current models. Mainstream reactive systems optimise for simple, tree-structured data flow. They treat bidirectionality, cycles, and causal transparency as edge cases.

But the real limitation is deeper: **Most mainstream reactive systems lack a serialisable intermediate representation of causality and reconciliation.** Without this representation, debugging remains opaque and composition remains integration. You can't inspect what doesn't exist as data.

Consider the implications: When your reactive system has no serialisable representation, you cannot pause and resume it. You cannot version it. You cannot transmit it. You cannot diff it. You cannot compose it cleanly. Every advanced capability depends on the missing object—the network as a value.

This is not a tooling problem that better debuggers will solve. This is a model problem. The runtime exists, but the artifact does not. Incremental improvement within current models cannot overcome this limitation because the limitation is the absence of a properly basic data structure for the computation itself.

**Falsifiable claim:** If a reactive system cannot serialise its complete state (topology, values, and causal history) into a format that deterministically reproduces that state upon deserialisation, then time-travel debugging, network versioning, and compositional reuse of that system require external, framework-specific infrastructure. RaCSTS proposes that this infrastructure becomes unnecessary when networks are properly basic serialisable values.

**Section Total: ~500 words**

## 3. Propagator Networks: The First Structural Shift

### 3.1 What Propagator Networks Solve

Propagator networks, as described by Sussman and Radul [1], represent a structural shift in how we think about computation and state. They solve the problems that tree-structured reactive models struggle with:

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

**Serialisation:** You cannot pause, save, or resume network state. The network exists only as an executing process.

**Debugging propagation:** Tracing why a value changed requires instrumentation. The causal history is not part of the data.

**Reasoning about network state:** You cannot inspect the network state at a point in time. There's no "value" to examine.

**Integration across boundaries:** Moving networks between systems (browser to server, process to process) requires rebuilding the network from scratch.

**Testing network behaviour:** Capturing network state for test assertions is ad-hoc. You test the outputs, not the network itself.

**Version control for networks:** You cannot serialise network state to track changes over time. Git works on code, not running systems.

**Composing networks:** Combining or nesting networks is manual integration. There's no compositional semantics.

**Scaling networks:** Splitting networks across boundaries is a distributed systems problem, not a data structure problem.

### 3.4 The Gap

Propagator networks solve the structural problems of reactive programming—they make bidirectionality, cycles, and incrementality natural. But they create new problems: the network cannot be treated as a value. It exists only as infrastructure.

This is the cliff: **We are stuck unless something new exists—networks as serialisable values.**

### 3.5 Runtime ≠ Artifact

Today, a propagator network is a runtime construct. You build it, execute it, observe its outputs. But the network itself—its topology, state, and causal history—is not a first-class artifact.

This distinction is critical: Propagators give you a better runtime, but they do not give you a better artifact. They change how computation happens, but they don't make the computation into data.

The need is clear: We need networks as values, not just networks as processes.

**Section Total: ~550 words**

## 4. The Missing Object: Networks as Serialisable Values

### 4.0 Requirements for Networks-as-Values

For a propagator network to be a serialisable value, it must satisfy three layers of requirements:

**Representation:**
- Must serialise without external runtime state
- Must round-trip deterministically (pack and unpack must be inverses)

**Observability:**
- Must support introspection (inspect topology, state, causal markers)
- Must support diffing (compare two network states meaningfully)

**Execution Coupling:**
- Must separate blueprint (serialisable) from execution environment (provided at runtime)
- Must preserve causal ordering and reconciliation semantics across serialisation boundaries
- Must compose recursively (networks can contain networks) without special cases

These requirements are not satisfied by adding serialisation to existing propagator implementations. They require rethinking the fundamental data structure of the network itself.

### 4.1 The Core Insight

The insight that enables networks as values is deceptively simple: **The network is the data.**

Not the network produces data. Not the network contains data. The network—its topology, its state, its propagation rules, its causal history—*is* a serialisable data structure.

This requires three conceptual shifts:

**Cells as Interpretation VMs:** Each cell is not merely a container for a value. It is a virtual machine that processes a sequence of operations (Pulses) through an interpretation function to produce a materialised value. The interpretation is the "microcode" of the cell.

**P-RAL as Blueprint:** The network topology, links, and causal markers exist as a serialisable structure called P-RAL (Parametric Relational Adjacency List). The P-RAL contains everything needed to resume the network, but it contains no executable logic—only references to logic.

**Separation of Blueprint and Runtime:** Nodes and relations are opaque within the P-RAL. They exist only as identifiers. At runtime, a Node Resolver and Relation Resolver provide the actual implementations. This separation is what enables portability.

### 4.2 What This Makes Possible

When networks become serialisable values, entire classes of capabilities emerge:

✅ **Serialisation:** Networks can be paused, serialised to JSON or other formats, and resumed deterministically. (Mechanism: §7.3 Serialisation Format; Example: §8.5 "Serialisation")

✅ **Debugging propagation:** Serialise network state at any point to trace changes. Time-travel debugging becomes natural. (Mechanism: §6.6 Serialisable Consistency; Example: §8.5 "Snapshot Files")

✅ **Reasoning about network state:** The network state is a value you can inspect with standard tools. (Mechanism: §6.4 Model Entities; Example: Appendix C)

✅ **Integration across boundaries:** Networks are values that work anywhere: browser, server, mobile, embedded. (Mechanism: §7.1 Architecture Overview; Example: §8.5)

✅ **Testing network behaviour:** Capture and replay network state for reproducible tests. (Mechanism: §6.6 Serialisable Consistency; Example: §8.5)

✅ **Version control for networks:** Serialise network state to track changes over time. Git becomes your network history. (Mechanism: §4.0 Requirements (Observability); Example: §9.4)

✅ **Composing networks:** Networks can contain networks (meta-circularity). Composition is structural, not nominal. (Mechanism: §6.6 Meta-Circularity; Example: §8.5 "Complex Dependencies")

✅ **Scaling networks:** Split networks across boundaries because they're serialisable. Distributed systems become data structure operations. (Mechanism: §6.6 Scale Invariance; Example: §8.5)

### 4.3 The Transformation

This transforms the nature of reactive programming:

**From infrastructure to data:** Networks are no longer just running systems—they are values you manipulate.

**From opaque to inspectable:** Network state becomes a value you can reason about with standard tools.

**From isolated to composable:** Networks can be combined and nested using ordinary functional composition.

**From local to universal:** Networks work across any boundary because they are data, not infrastructure.

This is what RaCSTS provides: a specification for networks as serialisable values.

**Section Total: ~620 words**

## 5. Consequences of the Missing Object

### 5.1 Network Composition

**If networks are serialisable values, then** building systems by composing networks becomes trivial. A complex application is just a composition of smaller, reusable network primitives.

**If networks are serialisable values, then** reusable network patterns become network libraries. The NPM ecosystem expands to include not just code libraries, but network libraries.

**If networks are serialisable values, then** network marketplaces become possible. Share, buy, and sell pre-built propagator networks for common problems.

### 5.2 Cross-Boundary Integration

**If networks are serialisable values, then** networks work seamlessly across systems, languages, and platforms. The same network runs in the browser, on the server, or on mobile without rewriting.

**If networks are serialisable values, then** network migration between systems becomes trivial. Move computation to where it makes sense—edge, server, or client—by transmitting the network as data.

**If networks are serialisable values, then** distributed systems are just networks that span boundaries. No special-case infrastructure needed—distribution becomes a deployment concern, not an architectural constraint.

### 5.3 Time-Travel and Versioning

**If networks are serialisable values, then** time-travel debugging becomes a natural capability. Serialise network state at any point, step backward and forward through time, replay from any state.

**If networks are serialisable values, then** network versioning becomes possible. Track and diff network structures over time using standard version control tools.

**If networks are serialisable values, then** networks can become the database. The boundary between "application state" and "persistent state" collapses when networks are durable values.

### 5.4 New Capabilities

**If networks are serialisable values, then** multiple developers can work on the same network simultaneously. Network state is just data—merge conflicts become data merge conflicts.

**If networks are serialisable values, then** network analysis becomes possible. Inspect network topology, identify bottlenecks, optimise structure—all using standard data analysis tools.

**If networks are serialisable values, then** network optimisation becomes a compiler problem. Analyze the network structure, apply optimisation passes, emit an optimised network—all at build time.

**Section Total: ~350 words**

## 6. The Theoretical Foundation: RaCSTS Specification

### 6.1 Formal Definition

**RaCSTS** (Relational and Causal State Transition System, pronounced "Rackets") is a specification for serialisable propagator networks as properly basic data structures, grounded in State Transition Systems theory [15].

RaCSTS is defined by three pillars:

**P-RAL (Parametric Relational Adjacency List):** The serialisable blueprint containing nodes, relations, links (array), meta, and asOf (T). P-RAL is independent of RaCSTS and is a sparse encoding—not a direct conversion of entire user objects. Only the P-RAL structure (nodes, links, relations, meta, asOf) is guaranteed serialisable; literals within ATL values are opaque and may contain non-serialisable references (e.g., WeakRefs) in runtime implementations. P-RAL is passive—it contains no executable logic, only references to logic.

**Node Resolver:** A function `fn(nodeId, P-RAL) -> RealNode` that resolves opaque node identifiers in P-RAL to concrete node implementations with a standard interface.

**Relation Resolver:** A function `fn(relationId, P-RAL) -> RealRelation` that resolves opaque relation identifiers in P-RAL to concrete relation functions with the signature `fn(src, tgt, meta) -> [srcV, tgtV, meta']`.

This three-pillar architecture achieves complete separation of concerns: P-RAL is pure data (serialisable), while resolvers provide environment-specific implementations (runtime).

### 6.2 The Type Hierarchy: Properly Basic Data Structures

RaCSTS builds networks from properly basic types, ensuring serialisability at every level:

**Type Hierarchy (Nested Structure):**

The type system follows a nested "Russian Doll" pattern, where each layer adds structure while preserving serialisability:

```
CAnATL [T, Tag, Value, Meta?]
  └─ Value = AnATL | AnTL
      ├─ AnATL [Dictionary<ATL>, Annotations>], Annotations]
      │   └─ ATL = Dictionary<ATL | TL | TL[]>
      │       └─ TL = [Tag, Literal]
      │           └─ Literal = any serialisable value
      └─ AnTL [Tag, Literal, Annotations]
          ├─ Tag = string
          ├─ Literal = any serialisable value
          └─ Annotations = ATL
```

Each layer wraps the previous, adding semantic structure (tags, annotations, causality) without breaking serialisability. This nesting enables meta-circularity: a CAnATL's Value can itself be an AnATL containing a network structure.

#### Base Types

**Literal:** `Unknown` — The base type for all values. Any serialisable JavaScript value.

**Tag:** A semantic label for a value, used implicitly for type discrimination and protocol dispatch.

**T:** A logical timestamp for causal ordering. Structure: `[Epoch, [Wall, Skew], Idx]` where:
- **Epoch** is a logical counter that serves as the "Causal Ratchet," ensuring linear order when nodes are too far apart to reconcile
- **Wall** is the immutable physical hardware timestamp (the "Local Witness")
- **Skew** is a first-class, mutable property representing the node's belief about its deviation from the network mean time
- **Idx** disambiguates concurrent events and uses fractional refinement `Idx = BaseIdx + Round / MaxRounds` to track propagation rounds within a logical time step, making the system linearisable [6] even outside individual P-RALs

This **Epoch-led Hybrid Logical Clock with Skew (EHLC-S)** structure [5] implements a **Gossiped Believed Inertial Time Frame (G-BITF)** model, extending Lamport's logical clocks [2] with physical time components and relativistic frame translation. The nested structure `[Wall, Skew]` implements a Galilean coordinate system where Wall is the invariant proper time and Skew is the frame translation, enabling distributed time consensus through implicit inertial frame translation rather than explicit synchronisation.

#### Core Types

**TL (TaggedLiteral):** `[Tag, Literal]` — A literal value with a semantic tag. Example: `["temperature", 72.5]`

**ATL (AssociativeTaggedLiteral):** `Dictionary<ATL | TL | TL[]>` — A recursive associative structure. Dictionary values can be ATL (nested dictionaries), TL (tagged literals), or arrays of TL. This provides the foundation for representing arbitrary structured data.

**Annotations:** `ATL` — Metadata represented as an associative structure. Annotations attach contextual information to values.

#### Annotated Types

**AnTL (AnnotatedTaggedLiteral):** `[Tag, Literal, Annotations]` — A tagged literal with metadata attached. Example: `["count", 42, {"unit": "items", "source": "inventory"}]`

**AnATL (AnnotatedAssociativeTaggedLiteral):** `[Dictionary<ATL>, Annotations]` — An associative structure with metadata. Example: `[{"name": "Alice", "age": 30}, {"verified": true, "timestamp": "2024-01-15"}]`

#### Value Types

**Value:** `AnATL | AnTL` — Union of annotated types. This is the type of "a value" in the system—any serialisable data with optional semantic tags and annotations.

#### Causal Types

**CAnATL (CausalAnnotatedAssociativeTaggedLiteral):** `[T, Tag, Value, Meta?]` — The fundamental cell type in RaCSTS. Contains:
- **T:** Logical timestamp for causal ordering
- **Tag:** Semantic label for the cell's interpretation
- **Value:** The current authoritative state (materialised through interpretation)
- **Meta:** Optional metadata (no preservation guarantees through serialisation)

CAnATL is the properly basic data structure for a cell. Everything in a propagator network is ultimately built from CAnATLs. Cells contain only authoritative state—there is no node-level history, window, frame, or context. Any operation that requires prior knowledge must reify that requirement explicitly in the Pulse. Any relation that requires smoothing, debouncing, or temporal context maintains its own private, non-authoritative state.

### 6.3 Data Structure Properties

**Recursive Structure:** ATL can contain nested ATL, enabling arbitrary depth. This makes CAnATL capable of representing networks within networks (meta-circularity).

**Type Safety:** Each level of the hierarchy adds structure: tagging provides semantic identity, annotations provide context, causality provides temporal ordering. The type system enforces these invariants.

**Serialisability:** All types are properly basic—they contain only serialisable data. No functions, no proxies, no live references. A CAnATL serialises as `[T, Tag, Value, Meta?]` where Value is the current authoritative state, and Values are ultimately built from primitive JavaScript types.

**No Node-Level History:** Cells contain only authoritative state. There is no node-level history, window, frame, or context. Causality lives exclusively in T. Any operation that requires prior knowledge must reify that requirement explicitly in the Pulse. Relations that require temporal context (smoothing, debouncing, moving averages) maintain their own private, non-authoritative state separate from the cell.

### 6.4 Model Entities

To bridge the formal type hierarchy with operational semantics, we define the entities that compose a working RaCSTS network:

**Cell (CAnATL):** The fundamental unit of state. A cell is a `[T, Tag, Value, Meta?]` structure where T provides causal ordering, Tag provides semantic identity, and Value is the current authoritative state. Cells are the "variables" in a propagator network. Cells contain only authoritative state—no history, window, or context at the node level.

**Pulse:** The atomic unit of propagation. Structure: `[T, Tag, Args, Meta?]` where T is the logical timestamp, Tag is the operation identifier, Args are operation-specific parameters, and Meta is optional metadata. Pulses are the fundamental unit that flows through the network—not operations, not events, not messages, but Pulses. Every change, every propagation, every reconciliation happens through Pulses. They carry updates from cell to cell, and the structure `[T, Tag, Args, Meta?]` is the universal packet that enables causal ordering and serialisability.

**ObservePulse:** The fundamental operation for introducing external entropy. Structure: `[T, ObserveTag, [Path, Old, New], Meta?]`. This single construct is both the event (what was observed) and the operation (what is proposed). Compare-and-swap semantics are intrinsic—the Pulse is accepted only if the cell's current value equals Old, otherwise it triggers an amnesiac event or refinement (e.g., Sync). 

**Critical Design Decision:** There is no generic "Set" operation—all external entropy enters as Observe operations. This is not an implementation detail but a fundamental architectural choice. Without this constraint, we cannot guarantee causal integrity across distributed boundaries. The compare-and-swap semantics are intrinsic to the Pulse structure itself, not layered on top. This design ensures that every external change is both an observation (what was seen) and a proposal (what should be), with the cell's current state serving as the validation gate.

**Op Relation:** External operation that introduces entropy into the network. Signature: `op(P-RAL, args, P-RAL-meta) -> [delta-P-RAL, Pulse[], meta']`. Op Relations are the entry points for external change—they create new Pulses that disturb the network from its quiescent state.

**Link Relation:** Internal propagation logic between cells. Signature: `link(src, tgt, meta) -> [srcV, tgtV, meta']`. Link Relations maintain relationships between cells—they are the "constraints" or "physics" of the network.

**From Pipes to Filters:** Initially, the design assumed that pulses would propagate directly to nodes—links were just "pipes" that carried pulses from one node to another. But when Link Relations were defined, the system departed from this automatic propagation model. A Link Relation is a pure function that **determines if and how** a state change should propagate across an edge. It's responsible for deciding **Visibility** and **Frequency**—not just passing pulses through. Without defined Link Relations, every node would talk to every other node infinitely. By including Link Relations in the P-RAL index, the **Value** itself contains the "Congestion Control" and "Interest Management" of the network. You aren't just serialising data; you are serialising a **Policy of Movement**. This shift from "pipes" to "filters/transformers" is what makes the network serialisable as a value—the propagation policy is part of the data structure itself, not a runtime behaviour.

**Pulse:** A `[T, Tag, Args, Meta?]` structure constructed with `pulse(t, op, args, meta?)` or using the helper method `op.pulse(t, ...args)`. Operations are created with `operation(opId, implementation)` and added to networks during construction. Pulses are constructed using operations that were added to the network. For example, `recv` operations take a pulse list as args: `pulse(t_msg, recv, [pulse(t_obs, observe, [old, new])])` or using helpers: `recv.pulse(t_msg, [observe.pulse(t_obs, [old, new])])`. The `meta` parameter is optional. Pulses can be collapsed with `collapse()` to remove redundancy while preserving causal integrity.

**Interpretation:** A function that projects a CAnATL to a materialised Value. Signature: `interpretation(CAnATL) -> Value`. The interpretation defines how a cell's CAnATL structure becomes a concrete value. Each cell is an "Interpretation VM"—it processes operations through its interpretation to produce its current value.

**The Interpretation VM Metaphor:** This is more than a metaphor. Each cell truly is a virtual machine that processes a sequence of Pulses through its interpretation function to produce a materialised value. The interpretation is the "microcode" of the cell. Different cells can have different interpretations: one might interpret its CAnATL as an associative map, another as a sequence, another as a network itself. The cell doesn't store the value—it stores the operations (the CAnATL), and the interpretation projects those operations into a value. This separation—between the stored operations (the CAnATL) and the interpretation (the VM)—is what makes cells serialisable. The operations are data. The interpretation is provided at runtime. This is why a network can be serialised and resumed anywhere: the operations are portable, and the interpretation can be provided by any host.

**Quiescence:** A state where no further propagation occurs. Detected when a full propagation round produces no accepted operations—all cells have stable state (no T advances). Quiescence is the "solution" to the constraint network.

### 6.5 Functional Primitives

RaCSTS defines two classes of primitives for network operation:

#### Op Relations: External Operations

**Signature:** `op(P-RAL, args, P-RAL-meta) -> [delta-P-RAL, Pulse[], meta']`

Op Relations operate on the P-RAL structure itself. They:
- Modify network topology (add/remove cells, links)
- Emit Pulses that update CAnATL structures
- Update P-RAL metadata

Op Relations are the boundary between the external world and the network. They transform external events into Pulses that the network can process.

#### Observe: The Fundamental Operation

**There is no generic "Set" operation.** All external entropy enters the system as **Observe** operations with intrinsic compare-and-swap semantics.

**ObservePulse Structure:** `[T, ObserveTag, [Path, Old, New], Meta?]`

This single construct is both the event (what was observed) and the operation (what is proposed). Compare-and-swap semantics are intrinsic, not layered on.

**Acceptance Logic:**
1. Resolve Path to the target cell
2. Materialise the cell to its current value Cur (through interpretation)
3. Accept iff Cur == Old, advancing T and applying New
4. Reject otherwise, triggering an amnesiac event (lineage becomes `stale`) or refinement (e.g., Sync)

This eliminates the need for any node-level sequence of past values. What was previously called a "window" was doing two unrelated jobs (CAS support and relation enhancement) and belonged in neither the core state nor the cell model.

**Result:**
- State is minimal and serialisable
- Causality lives exclusively in T
- CAS semantics are explicit and auditable
- No structure resembles history unless the model explicitly defines one

There is no operation in RaCSTS that reads a prior value implicitly. Any operation that depends on a previous value must receive it explicitly as part of its Pulse arguments. This makes it impossible for a future reader to justify reintroducing a "window-like" structure under another name.

#### Amnesiac Pulses: Handling High-Frequency Updates

In high-frequency update scenarios (e.g., UI events, sensor streams, real-time data feeds), the "Old" value in an Observe Pulse may change faster than the network can propagate. This creates a race condition where:

1. Observe Pulse arrives with `Old = V1`
2. Network begins propagation
3. Before propagation completes, another Observe Pulse arrives with `Old = V2` (where V2 is the value that would result from the first pulse)
4. The second pulse's `Old` doesn't match the current value (which is still V1), causing rejection

**Amnesiac Event:** When an Observe Pulse is rejected (Cur ≠ Old), the node's state transitions to `stale`. This is called an "amnesiac event" because the node "forgets" its current value's authority and seeks consensus.

**Handling Strategy:**

- **Batching:** Collect multiple Observe Pulses and batch them into a single propagation round. This reduces the window for race conditions.
- **Debouncing:** For UI events, delay Observe Pulse creation until a quiescent period (e.g., user stops typing for 100ms).
- **Sync Op:** When amnesiac events occur, the system automatically triggers Sync Op Relations to seek consensus across the network.
- **T-ordering:** The T timestamp ensures that even if multiple Observe Pulses arrive out of order, they are processed in causal order.

**Example:** A text input field updating at 60Hz generates Observe Pulses faster than propagation completes. The system batches these updates, and if a pulse is rejected (amnesiac event), the node transitions to `stale` and seeks consensus. The Sync Op mechanism ensures eventual consistency.

This design makes high-frequency updates safe: rejected pulses don't corrupt state, and the system naturally converges through consensus.

#### Link Relations: Internal Propagation

**Signature:** `link(srcNode: RealNode, tgtNode: RealNode, meta) -> [srcValue, tgtValue, meta']`

**Input:** Full Node objects (RealNode) and link metadata
**Output:** Values and metadata

Link Relations operate on pairs of cells. They:
- Receive the complete **node** objects (not just values) as input
- Observe full node state: value, state, meta, and asOf (timestamp)
- Compute new **values** that satisfy the relationship
- Return values (not nodes) and updated metadata

**The Departure from Automatic Propagation:** Initially, the design assumed that pulses would propagate directly to nodes—links were just "pipes" that carried pulses from one node to another. But when Link Relations were defined, the system departed from this automatic propagation model. A Link Relation is a pure function that **determines if and how** a state change should propagate across an edge. It's responsible for deciding **Visibility** and **Frequency**—not just passing pulses through. This shift from "pipes" to "filters/transformers" is what makes the network serialisable as a value—the propagation policy is part of the data structure itself, not a runtime behaviour.

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
- Use case: Serialising complex objects to strings, mapping UI state to domain state

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

These standard relations make the P-RAL predictable and analysable—a host receiving a value knows exactly what a `linear` or `reduce` link does without inspecting code, enabling potential hardware-level or optimised runtime execution.

**Link Relation Return Patterns:**

A relation's behaviour is defined by what it returns—the "repair" it suggests to bring cells into alignment. The relation receives full nodes but returns values:

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
| `asOf` | [Epoch, [Wall, Skew], Idx] | Timestamp of last update |

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

#### Serialisable Consistency

**Operational Definition:**
- **Pack operation:** Serialise P-RAL (all CAnATL structures, topology, links) to a format (JSON, MessagePack, etc.)
- **Unpack operation:** Deserialise format back to P-RAL with identical structure
- **Invariant:** `unpack(pack(P-RAL)) === P-RAL` (deterministic round-trip)

**Preservation Requirements:**
- All cell values must be preserved
- All timestamps (T) must be preserved  
- All topology (nodes, links) must be preserved
- Core P-RAL structure (nodes, links, relations, meta, asOf) must round-trip identically

**Metadata Guarantees:**
- Metadata has zero guarantees regarding preservation during serialisation cycles
- Implementations may discard, modify, or ignore metadata
- Metadata can be used for optimisation (e.g., caching serialised representations) but must not be relied upon for correctness

Pack and unpack are inverses for the core P-RAL structure. A serialised network, when deserialised, is indistinguishable from the original in terms of nodes, links, relations, meta, and asOf. Metadata may differ.

#### Scale Invariance

**Operational Definition:**
The same core operations (applying operations to networks, collapsing redundant pulses, materialising values through interpretation, computing constraint alignments) operate identically at:
- **Subnetwork level:** A single CAnATL cell or small network
- **Whole-network level:** A network containing many CAnATL cells
- **Meta-network level:** A network whose Values are themselves networks

**No Special Cases:**
The same code handles all scales. A function that operates on a cell operates identically whether that cell contains an integer, an object, or an entire network. Scale invariance is structural, not implemented.

#### Meta-Circularity

**Operational Definition:**
- A CAnATL cell's Value (the current authoritative state) can be an AnATL containing a network structure
- When materialising such a CAnATL, the interpretation produces a network
- That network can be operated on using the same core operations (adding operations, collapsing redundant operations, materialising values, computing constraint alignments)
- No special handling required: networks containing networks is a natural case of the recursive type structure

**Example:** Cell A contains a simple literal value (42). Cell B contains an entire network as its value. When materialised through their respective interpretations, Cell A produces the number 42, Cell B produces a resumable network structure. Both cells are processed identically by the propagation mechanics—the interpretation determines what the CAnATL "means," not the propagation system.

Meta-circularity is not a feature—it's a consequence of properly basic recursive types.

**Note:** When using persistent immutable data structures (like Immutable.js or structural sharing), the recursive type system naturally preserves history at each level. The structure itself becomes the history.

**Section Total: ~1,600 words**

---

## 7. Grounding the Solution: From Theory to Mechanism

### 7.1 Architecture Overview

RaCSTS achieves serialisability through strict separation of concerns:

**Blueprint (P-RAL) vs. Runtime (Resolvers):** P-RAL is independent of RaCSTS and contains nodes, links, relations, meta, and T. It contains only data—no executable code. At runtime, Node Resolvers and Relation Resolvers provide the implementations referenced by identifiers.

**Opaque Design:** Both nodes and relations are opaque within the P-RAL. P-RAL stores node structures `{ value: ATL, asOf: T, lineage, meta: ATL }` where value is ATL (tagged literals dispatch on tag for interpretation). Relations are implementation-dependent structures. This opacity is what enables portability—the same P-RAL can work with different resolver implementations in different environments.

**Sparse Encoding:** P-RAL is not a direct conversion of entire user objects. It is a sparse encoding of only what needs to be communicated. For example, in a shadow graph implementation, much of a node's runtime state may be WeakRefs (not serialisable), but literals are opaque—only the rest of P-RAL (nodes, links, relations, meta, asOf) is guaranteed to be serialisable. The tagged literal structure allows sparse encoding where tags dispatch to the appropriate interpretation, enabling efficient representation of only the essential state.

**Serialisation Boundary:** The serialisation boundary is precisely the P-RAL structure (nodes, links, relations, meta, asOf). Literals within ATL values are opaque and may contain non-serialisable references (e.g., WeakRefs) in runtime implementations. Only the P-RAL structure itself is guaranteed serialisable. Everything outside the P-RAL (resolvers, runtime state) is provided at runtime. This makes it trivial to reason about what can be transmitted and what must be locally available.

### 7.2 The Toolkit Primitives

RaCSTS is not a framework—it is a toolkit. Four core operations provide complete control over network state:

#### 1. Defining Network by Connecting Nodes via Relations

Operations are created with `operation(opId, implementation)`. Networks are constructed using `network(t0, config, ops?)` where `ops` defaults to `[recv, delta, sync]`. Operations are added to the network during construction. Networks are then built using `node()`, `relation()`, and `connect()`. The `connect()` function handles everything—it takes a network, source node, relation, and target node, and returns a new network with the connection established. This is the fundamental way to build network topology.

#### 2. Applying Operations from the Outside World

Applies a pulse to a network using `apply(prel, op, config)`. Operations are created with `operation(opId, implementation)` and added to networks during construction (defaults to `[recv, delta, sync]`). Pulses are then constructed with `pulse(t, op, args, meta?)` or using the helper method `op.pulse(t, ...args)`, where `meta` is optional. For example, `recv` operations take a pulse list as args: `pulse(t_msg, recv, [pulse(t_obs, observe, [old, new])])` or using helpers: `recv.pulse(t_msg, [observe.pulse(t_obs, [old, new])])`. The `apply()` function is strictly for operations from the outside world—not for arbitrary pulses. This operation maintains T-ordering (logical time) and semi-lattice properties (operations can be applied in any order as long as T-ordering is respected).

This is the fundamental way to introduce change into the system.

#### 3. Collapsing/Aggregating Pulses

Collapses redundant pulses using `collapse(pulses)` while preserving necessary context. This operation removes redundant operations by performing identity folding—if a value changes 1→2→3, it can be collapsed to 1→3. If a value changes 1→2→1 (circular mutation), it can be collapsed to a no-op.

This is the memory management operation of the system, reducing the number of pulses while maintaining causal integrity.

#### 4. Running Propagation Rounds

Propagates changes through the network using `propagate(network, config)`. This operation runs propagation rounds until quiescence is reached, tracking changed nodes by timestamp. Each round detects changed nodes, identifies matching links, resolves relations, executes relations, and conditionally updates target nodes.

This is the fundamental way to maintain relationships in the network and reach a stable state.

These four operations are sufficient to build any propagator network. Higher-level abstractions are built from these operations, not baked into the system.

### 7.3 Implementation Requirements

To implement RaCSTS, you must provide:

#### P-RAL Structure

The P-RAL must contain:
- **Nodes:** Map of node IDs to node structures `{ value: ATL, asOf: T, lineage, meta: ATL }` where value is ATL (tagged literals dispatch on tag for interpretation)
- **Relations:** Map of relation IDs to relation structures (implementation-dependent, opaque references)
- **Links:** Array of link specifications `[src-selector, tgt-selector, relation-id, args, meta, label?]`
- **Meta:** P-RAL-level metadata (ATL)
- **asOf:** Current logical timestamp (T) for the P-RAL

**Sparse Encoding:** P-RAL is not a direct conversion of entire user objects. It is a sparse encoding of only what needs to be communicated. For example, in a shadow graph implementation, much of a node's state may be WeakRefs (not serialisable), but literals are opaque—only the rest of P-RAL (nodes, links, relations, meta, asOf) is guaranteed to be serialisable. The tagged literal structure allows sparse encoding where tags dispatch to the appropriate interpretation, enabling efficient representation of only the essential state.

Everything in the P-RAL must be serialisable to JSON or equivalent.

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
- **Compact representation:** One template link governs many nodes without serialising individual links
- **Schema of propagation:** Serialise propagation rules, not instance connections
- **Self-organising:** Network structure resolves dynamically as values change

**Common Template Patterns:**

| Pattern | Template Link | Behaviour |
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

Template links transform the P-RAL from a static graph into a **generative graph architecture**—the value size stays constant even as the number of nodes grows.

#### Node Interface

A RealNode (returned by Node Resolver) must provide:
- **value:** The current value (opaque in RaCSTS, ATL in Suss implementation)
- **state:** One of `'observed'` (Observe accepted), `'consensus'` (Sync completed), `'stale'` (Observe rejected, seeking consensus), or `'derived'` (Link computed)
- **meta:** Metadata (ATL)
- **asOf:** Timestamp (T) of last update

Nodes in P-RAL are `{ value: ATL, asOf: T, lineage, meta: ATL }` where value is ATL (tagged literals dispatch on tag for interpretation). In RaCSTS, the value is opaque. In Suss, the value is ATL. P-RAL is a sparse encoding—not a direct conversion of entire user objects. Much of a node's runtime state may be WeakRefs (not serialisable), but literals are opaque; only the P-RAL structure is guaranteed serialisable.

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

#### Serialisation Format

Pack and unpack operations must:
- **Serialise CAnATL:** `[T, Tag, Value, Meta?]` where T is `[Epoch, [Wall, Skew], Idx]` (with fractional Idx), Tag is a string, Value is the current authoritative state, and Meta is optional metadata (no preservation guarantees)
- **Serialise Values:** Values are `AnATL | AnTL`, which serialise as nested JavaScript structures
- **Preserve Structure:** Recursive ATL structure must round-trip perfectly
- **Deterministic:** Core P-RAL structure (nodes, links, relations, meta, asOf) must round-trip identically. Metadata has zero guarantees and may differ.

Serialisation is not an afterthought—it is the fundamental capability of the system.

### 7.4 Operational Semantics

#### Internal Update Semantics: Four Layers of Abstraction

The system operates through four distinct layers that separate concerns and enable both determinism and distributability:

**1. Relations → Provide New Values**

Link Relations are pure functions that compute proposed values. They receive full node objects (with value, state, meta, and timestamp) and return new values that satisfy the relationship: `link(srcNode, tgtNode, meta) -> [srcValue, tgtValue, meta']`. They don't mutate nodes—they propose values. Relations are pure and deterministic—given the same inputs, they produce the same outputs.

**2. Implementation → Updates Conditionally (Timestamp Increases)**

The implementation decides whether to accept the relation's proposal. Nodes are updated only if the timestamp advances: `T_new > T_current`. This is conditional—not every relation execution results in a node update. The timestamp increment is the signal that a node actually changed. This conditional update mechanism ensures monotonicity and prevents redundant work.

**3. DELTA Op → Generates RECV of Pulses**

When nodes are updated (timestamp increased), DELTA generates RECV pulses: `DELTA(P-RAL_state, Pulse_in) -> [RECV, { [nodeID]: Pulse_out[] }]`. DELTA doesn't just update state—it emits RECV pulses for communication. This is the boundary between local state and network communication. DELTA acts as a router, determining which nodes should receive which pulses.

**4. System Logs/Transmits RECV as Change Message**

RECV pulses are logged and/or transmitted as change messages. This is the gossip layer—RECV becomes the message format. The system merges inbound DELTA with outbound data for naive gossip, ensuring information diffuses through the network. This layer handles the actual transmission, whether across process boundaries, network boundaries, or storage boundaries.

This four-layer distinction is critical:
- Relations are pure and don't mutate (enables serialisation)
- The implementation controls when nodes actually update (timestamp check ensures monotonicity)
- DELTA bridges local updates to network communication (enables distribution)
- RECV is the serialisable message format (enables gossip and persistence)

The separation between computation (relations), conditional updates (implementation), communication generation (DELTA), and transmission (system) is what makes RaCSTS both deterministic and distributable.

#### Op Execution: Introducing Entropy

When an Op Relation executes:
1. Receives current P-RAL, operation arguments, and P-RAL metadata
2. Modifies P-RAL structure (adds/removes nodes, links)
3. Creates Pulses `[T, op, ...args]` with T > any existing T in affected nodes
4. Emits Pulses and delta-P-RAL
5. Returns updated P-RAL metadata

Observe Pulse acceptance is the boundary between external events and internal propagation.

#### Internal Propagation: Round-Based Coordination

Internal propagation within a single P-RAL uses the node's change time (timestamp) as the coordination mechanism. This is **separate** from the communication layer (RECV/SYNC) that handles synchronisation between different P-RAL instances.

**Each Propagation Round:**

1. **Change Detection:** Look for nodes changed since last round (nodes whose timestamp advanced)
2. **Link Identification:** For each changed node, identify all links where the source selector matches
3. **Relation Resolution:** Resolve the relation function for each matched link
4. **Relation Execution:** Run the relation: `link(srcNode, tgtNode, meta) -> [srcValue, tgtValue, meta']`
5. **Conditional Update:** Update the target node only if needed (using the round-specific T), which advances the node's timestamp
6. **P-RAL T Update:** Update the P-RAL's global timestamp
7. **Iteration Check:** If `round < max_rounds` and nodes were updated, repeat from step 1

This continues until quiescence–a round where no nodes are updated. The method is deterministic and monotonic: nodes only advance forward in time, and the system always makes progress toward a fixed point. The key insight is using the node's change time as the signal for what needs to propagate, rather than maintaining explicit change lists or event queues.

**Why This Separation Matters:**

Internal propagation is about **local consistency** within a single P-RAL. It's the mechanism that ensures all Link Relations are satisfied within the local network. This is fundamentally different from the communication layer (RECV/SYNC) that handles synchronisation between different P-RAL instances in a distributed system.

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
- **Partial Results:** Current P-RAL state represents partial progress toward quiescence

**Important:** Circuit breakers are a bounded execution mechanism, not a correctness guarantee. They prevent infinite loops in adversarial graphs but do not guarantee quiescence. Progress evidence (T-ordering) shows the system is making forward progress, but bounded execution may halt before full quiescence is reached.

### 7.5 The Organic Evolution: From Log-Based to P-RAL Based

As the system was refined, a subtle but important transition occurred. The system evolved from being **log-based** (where operations were stored as a sequence of events) to being **P-RAL based** (where operations lived in the Protocol-Relation domain).

This transition wasn't purposeful—it was organic. The abstraction led the way.

**The Key Shift:** Instead of each change emitting individual pulses that triggered immediate propagation, the system began using the **change time of the node** itself to trigger propagation. When a node's timestamp advanced, that became the signal to propagate—not a separate pulse for each individual operation.

**Collection Semantics:** By only using the pulse to communicate change, and by using the node's change time as the trigger, the system enabled **collection semantics**. Multiple changes to a node could be batched. The system could wait for quiescence before propagating, collecting all the mutations that happened within a single logical tick.

**Performance Benefits:** Instead of propagating every individual operation (which could mean hundreds of pulses for a single batch update), the system could collect all changes, compact them, and emit a single pulse representing the net effect. This wasn't just an optimisation—it was a fundamental shift in how the network reasoned about change.

**Optimisation Opportunities:** Collection semantics opened up optimisation opportunities that weren't possible with individual pulses. The system could detect when multiple operations cancelled each other out. It could merge redundant updates. It could defer expensive propagations until it knew the full scope of changes.

This organic evolution from log-based to P-RAL based wasn't planned, but it was necessary. The abstraction was teaching us that the structure of the data (the P-RAL domain) and the structure of the operations (the relations index) needed to be unified. The operations weren't separate from the state—they were part of the state itself.

### 7.6 Serialisability and Linearity in Distributed Systems

While RaCSTS is designed to make networks serialisable values, the T structure ensures that these values maintain causal ordering across distributed boundaries. This section describes the **Epoch-led Hybrid Logical Clock with Skew (EHLC-S)** implementing a **Gossiped Believed Inertial Time Frame (G-BITF)** model, a distinct formalism that enables both local serialisability and distributed linearity through relativistic frame translation rather than traditional time synchronisation.

#### The Epoch-led Hybrid Logical Clock with Skew (EHLC-S) and Gossiped Believed Inertial Time Frame (G-BITF)

The T structure is always `[Epoch, [Wall, Skew], Idx]`. This **Epoch-led Hybrid Logical Clock with Skew (EHLC-S)** structure [5] extends Lamport's logical clocks [2] with physical time components and implements a **Gossiped Believed Inertial Time Frame (G-BITF)** model. The system achieves internal linearisability [6] through fractional refinement of the Idx component.

**Component Roles:**
- **Epoch:** The "Causal Ratchet." A logical counter that ensures linear order when nodes are too far apart to reconcile. This is the "most significant bit" of the timestamp, providing the primary causal ordering
- **Wall:** The **invariant proper time**—an immutable physical hardware timestamp that witnesses when the event actually occurred. Wall is never adjusted; it serves as the anchor point for frame translation
- **Skew:** The **only mutable component**—a first-class property representing the node's current belief of its offset from the network's consensus frame. Skew is adjusted through inertial frame translation, allowing events to be "translated" into different local frames while preserving the original Wall as the invariant witness. The adjustment maintains strong inertia against rapid changes
- **Idx:** Disambiguates concurrent events at the same wall time. Uses fractional refinement `Idx = BaseIdx + Round / MaxRounds` to encode internal propagation rounds

The nested structure `[Wall, Skew]` implements a **Galilean coordinate system** where Wall is the invariant proper time and Skew is the frame translation. Each node maintains its own **Believed Inertial Time Frame (BITF)**, where `BelievedTime = Wall + Skew` represents where the node believes it exists in the network's consensus timeline. This structure makes the system linearisable not just within a single P-RAL, but across P-RALs—enabling distributed coordination while maintaining serialisability.

**Key Principle:** Wall is immutable. Only Skew is adjusted. This allows the originator to recognise its own events (via the original Wall) while peers "translate" that event into their local frame of reference (via Skew adjustment).

#### Inertial Belief: Ensuring Linearisability Through Frame Translation

The G-BITF model ensures global linearisability [6] across distributed nodes through **inertial belief** and frame translation. Instead of nodes "swaying" to match a leader, each node maintains its own Believed Inertial Time Frame with strong inertia against rapid changes. Nodes resist change—they accept only a small percentage of blame (5% default, reduced for unreliable nodes), creating inertia that prevents Byzantine clock flapping. When a node receives a remote pulse with timestamp T_remote, it performs the following frame translation:

**The Inertial Frame Translation Step:**

1. **Causal Check:** If the remote pulse is logically in the past or concurrent (within a threshold based on `Wall + Skew`), it is processed normally without modification.

2. **Epoch Ratchet:** If the pulse is logically in the future (violating monotonicity when comparing `[Epoch, Wall + Skew, Idx]`), the local node must "buy" causal space by advancing:
   ```
   Epoch_local ← max(Epoch_local, Epoch_remote) + 1
   ```

3. **Inertial Frame Translation (Skew Adjustment):** The node runs a `computeSkew` function using a probabilistic approach with **inertial belief** (minimal blame acceptance). It:
   - Calculates the "Believed Time" for both nodes: `BelievedTime_local = Wall_local + Skew_local` and `BelievedTime_remote = Wall_remote + Skew_remote`
   - Computes the delta: `Delta = BelievedTime_remote - BelievedTime_local`
   - **Determines blame acceptance percentage** based on historical evidence:
     - Default: 5% for nodes with no prior history
     - **Reduced percentage** (e.g., 1-2%) for nodes with consistent history of large skew values
     - **Never 0%**—some blame must always be accepted to maintain causal correctness and handle legitimate clock drift
   - **Accepts the determined percentage of the blame**: `LocalAdjustment = Delta * BlameAcceptanceRate`
   - **Assigns the remainder to the remote node**: `RemoteAdjustment = Delta * (1 - BlameAcceptanceRate)`
   - Calculates the reconciled realtime: `Realtime = BelievedTime_local + LocalAdjustment`
   - Updates local Skew: `Skew_local ← Realtime - Wall_local`
   - Updates the remote pulse's Skew: `Skew_remote ← Realtime - Wall_remote`

This approach ensures that a Byzantine actor would need approximately 20 epochs (at 5%) or 100 epochs (at 1%) to drag a good actor all the way to its value, providing time for evidence to accumulate that the remote actor is at fault. The inertial belief (minimal blame acceptance) creates strong resistance to rapid changes—nodes maintain their frame of reference unless given strong evidence to adjust. This allows gradual convergence for honest nodes while preventing Byzantine actors from causing clock flapping. Historical evidence allows the system to learn which nodes are consistently unreliable and reduce their influence accordingly.

**Implicit Consensus:** There is no explicit "time-sync" protocol. The network's "good enough" consensus is an emergent property of nodes constantly re-stamping the Skew values of gossiped pulses to match their local beliefs. Each node translates events from remote frames into its own frame, and consensus emerges naturally from these translations.

**Properties:**
- **Strict monotonicity:** Timestamps always advance, never regress
- **Total ordering:** Any two timestamps can be compared unambiguously using `[Epoch, Wall + Skew, Idx]`
- **Clock-drift resilience:** System remains causal even if physical clocks are hours apart
- **Self-stabilisation:** The Skew adjustment creates a negative feedback loop that pulls nodes toward a stable mean time

The Epoch carries causality forward during periods of high divergence, while the Skew handles micro-jitter and enables convergence to a stable mean. Physical clock synchronisation (like NTP) remains an optional optimisation that reduces the magnitude of Skews and Epoch heights, but is not required for correctness.

#### Examples: G-BITF Inertial Belief in Practice

**Example 1: Basic Refining Step**

Node A has local timestamp `T_A = [5, [1000, 0], 10]` (Epoch=5, Wall=1000, Skew=0, Idx=10). Node B sends a pulse with `T_B = [6, [1100, -50], 5]`.

1. **Causal Check:** Compare `[Epoch, Wall + Skew, Idx]`:
   - A: `[5, 1000 + 0, 10] = [5, 1000, 10]`
   - B: `[6, 1100 + (-50), 5] = [6, 1050, 5]`
   - B is in the future (Epoch 6 > 5), triggering the Refining Step

2. **Epoch Ratchet:** `Epoch_A ← max(5, 6) + 1 = 7`

3. **Inertial Frame Translation:** `computeSkew` calculates with 5% blame acceptance (inertial belief):
   - BelievedTime_A = 1000 + 0 = 1000
   - BelievedTime_B = 1100 + (-50) = 1050
   - Delta = 1050 - 1000 = 50ms
   - Node A accepts 5% of the blame: `LocalAdjustment = 50 * 0.05 = 2.5ms ≈ 3ms`
   - Node B gets 95% of the blame: `RemoteAdjustment = 50 * 0.95 = 47.5ms ≈ 47ms`
   - Reconciled realtime: `Realtime = 1000 + 3 = 1003`
   - Updates: `Skew_A ← 1003 - 1000 = +3` (Node A accepts 3ms of the 50ms difference)
   - Updates remote pulse: `Skew_B ← 1003 - 1100 = -97` (Node B gets blamed for 47ms, adjusted from its Wall)

Result: `T_A = [7, [1000, +3], 10]`, and the pulse is processed with `Skew_B = -97`. The 5% blame acceptance means it would take 20 epochs for a Byzantine Node B to drag Node A all the way to its value, providing time for evidence to accumulate.

**Example 2: Time-Shifting and Feedback Loop**

Node A (drifting fast) sends pulse with `T_A = [5, [1000, 0], 10]` to Node B. Node B's local time is `T_B = [5, [950, 0], 15]` (Node B's clock is 50ms behind).

1. **Node B receives pulse:**
   - Refining Step detects A is 50ms ahead (BelievedTime_A = 1000, BelievedTime_B = 950)
   - Delta = 1000 - 950 = 50ms
   - Node B accepts 5% of the blame: `LocalAdjustment = 50 * 0.05 = 2.5ms ≈ 3ms`
   - Reconciled realtime: `Realtime = 950 + 3 = 953`
   - Updates: `Skew_B ← 953 - 950 = +3` (Node B accepts 3ms of the 50ms difference)
   - Updates remote pulse: `Skew_A ← 953 - 1000 = -47` (Node A gets blamed for 47ms)

2. **Node B broadcasts (time-shifting):**
   - Re-broadcasts A's pulse with `Skew_A = -47` (not the original 0)
   - Node C receives the time-shifted pulse

3. **Feedback to Node A:**
   - Node A eventually receives its own pulse back with `Skew_A = -47`
   - Node A's Refining Step: Delta = 47ms, accepts 5%: `Skew_A ← 0 + (47 * 0.05) = +2.35 ≈ +2`
   - Over multiple round-trips, Node A's Skew gradually converges toward the network mean

This creates a negative feedback loop: drifting nodes are pulled back toward consensus. The 5% blame acceptance ensures that if Node A were Byzantine and rapidly changed its reported time, Node B would only adjust by 5% per epoch, requiring 20 epochs to fully converge and providing time for evidence to accumulate.

**Example 3: Causal Ratcheting During Initial Sync**

Two nodes boot simultaneously with no prior knowledge:
- Node A: `T_A = [1000, [1000, 0], 0]` (Epoch = UnixTime)
- Node B: `T_B = [1005, [1005, 0], 0]` (slightly later boot)

**Round 1:**
- Node A sends pulse to Node B
- Node B's Refining Step: `Epoch_B ← max(1005, 1000) + 1 = 1006`
- Node B's Skew adjusts with local bias: `Skew_B ← 0 * 0.7 + (-2.5) * 0.3 = -0.75` (gradual)
- Result: `T_B = [1006, [1005, -0.75], 0]`

**Round 2:**
- Node B sends pulse back to Node A
- Node A's Refining Step: `Epoch_A ← max(1000, 1006) + 1 = 1007`
- Node A's Skew adjusts with local bias: `Skew_A ← 0 * 0.7 + (+2.5) * 0.3 = +0.75` (gradual)
- Result: `T_A = [1007, [1000, +0.75], 0]`

**Round 3:**
- BelievedTime_A = 1000 + 0.75 = 1000.75
- BelievedTime_B = 1005 + (-0.75) = 1004.25
- Values converge gradually (still 3.5ms apart, but closer)
- Over subsequent rounds, Skews continue adjusting gradually until alignment
- Once `Wall + Skew` values align within threshold, Epoch stops rising
- System reaches **Stable Mean Time** at Epoch 1007

The gradual convergence demonstrates how local bias prevents rapid oscillations while still allowing honest nodes to reach consensus.

The Epoch climbed from 1000/1005 to 1007 during sync, then stabilised once Skews aligned.

**Example 4: Historical Evidence Reduces Blame Acceptance**

Node A has received multiple messages from Node C in the past, all with consistently large skew values:
- Message 1: `Skew_C = -100` (Node C was 100ms fast)
- Message 2: `Skew_C = -95` (Node C was 95ms fast)
- Message 3: `Skew_C = -98` (Node C was 98ms fast)

Node A has built up historical evidence that Node C consistently reports times that are ~97ms ahead of the network mean.

Now Node C sends a new pulse with `T_C = [8, [1200, -100], 5]`. Node A's current state is `T_A = [7, [1000, 0], 10]`.

1. **Causal Check:** Compare `[Epoch, Wall + Skew, Idx]`:
   - A: `[7, 1000 + 0, 10] = [7, 1000, 10]`
   - C: `[8, 1200 + (-100), 5] = [8, 1100, 5]`
   - C is in the future (Epoch 8 > 7), triggering the Refining Step

2. **Epoch Ratchet:** `Epoch_A ← max(7, 8) + 1 = 9`

3. **Inertial Frame Translation with Historical Evidence:**
   - BelievedTime_A = 1000 + 0 = 1000
   - BelievedTime_C = 1200 + (-100) = 1100
   - Delta = 1100 - 1000 = 100ms
   - **Historical confidence adjustment:** Based on past evidence (average skew of -97ms), Node A has low confidence in Node C's time reports
   - **Reduced blame acceptance:** Instead of 5%, Node A accepts only 1% (confidence-weighted): `LocalAdjustment = 100 * 0.01 = 1ms`
   - Node C gets 99% of the blame: `RemoteAdjustment = 100 * 0.99 = 99ms`
   - Reconciled realtime: `Realtime = 1000 + 1 = 1001`
   - Updates: `Skew_A ← 1001 - 1000 = +1` (Node A accepts only 1ms of the 100ms difference)
   - Updates remote pulse: `Skew_C ← 1001 - 1200 = -199` (Node C gets blamed for 99ms, adjusted from its Wall)

Result: `T_A = [9, [1000, +1], 10]`, and the pulse is processed with `Skew_C = -199`. 

**Key Insight:** The probabilistic `computeSkew` function can reduce blame acceptance below 5% based on historical evidence, but never to 0%. This ensures:
- Nodes with consistent time errors are trusted less, requiring even more epochs (100 epochs at 1% vs 20 epochs at 5%) to influence honest nodes
- Causal correctness is maintained—some blame is always accepted to handle legitimate clock drift
- The system learns from past evidence while remaining resilient to new honest nodes joining

#### Distributed Error Correction: Time-Shifting and Causal Relays

The G-BITF model implements distributed error correction through frame translation during the gossip phase. The system operates on a cycle of **Ingest → Translate → Process → Quiesce → Broadcast**.

**Time-Shifting Mechanism:**

When a node reaches quiescence and prepares an outbound gossip message, it performs distributed error correction:

1. **Time-Shifting Remote Pulses:** Before re-broadcasting remote pulses, a node "shifts" them by replacing their original Skews with its own updated belief of that node's drift. This allows the network to "rehabilitate" drifting nodes before their data propagates further.

2. **The Feedback Loop:** If Node A is drifting, it will eventually receive its own pulses back from Node B, but with a **modified Skew**. Node A sees this "Network Truth" and drifts its local Skew toward that value, creating a negative feedback loop that stabilises the system.

3. **The Sum of Novel Timeshifted Pulses:** The outbound message becomes a **Sum of Novel Timeshifted Pulses**—a causal snapshot that includes both novel local pulses and novel remote pulses that have been time-shifted to reflect the node's current consensus belief.

**Transmission Bundle Structure:**

Each transmission bundle contains:
- `T_Sync`: The sender's current `[Epoch, [Wall, Skew], Idx]` (with Idx containing fractional round if mid-propagation)
- `Pulse[]`: The array of state transitions being transmitted, each with its own `[Epoch, [Wall, Skew], Idx]` timestamp where Skews have been updated to reflect the sender's consensus belief

**Important:** When multiple P-RALs coordinate across multiple nodes, each P-RAL maintains its own `[Epoch, [Wall, Skew], Idx]` timestamp. The inertial belief mechanism ensures that when a P-RAL receives a remote timestamp, it translates the event into its local frame by adjusting both the Epoch (for causal ordering) and the Skew (for frame translation), while maintaining strong inertia against rapid changes. The Skew component is first-class—it is not just an optimisation, but a fundamental mechanism for achieving distributed time consensus through Galilean frame translation.

**Causal Ratcheting:**

During initial peer discovery or after a network partition, Epochs will climb on every round-trip. This "syncing tax" ensures a linear order for sequential events while allowing for partial concurrent ordering across the network. Once the `Wall + Skew` values align within a shared "concurrency window," the Epoch stops rising and the system reaches a **Stable Mean Time**.

**Byzantine Resistance:**

By using a probabilistic `computeSkew` with **5% blame acceptance**, the system treats outlier clocks as low-confidence data. The minimal blame acceptance ensures that:
- A Byzantine actor cannot cause clock flapping by rapidly changing its reported time—each node accepts only 5% of the blame per epoch, requiring approximately 20 epochs to fully converge
- This 20-epoch window provides time for evidence to accumulate that the remote actor is at fault
- Outlier clocks are neutralised through local negative skew adjustments rather than forcing global Epoch jumps
- The system maintains causal correctness while filtering malicious or erroneous time reports
- Multiple honest nodes reinforce each other's agreement, while a single Byzantine node's influence is dampened by the 5% acceptance rate

The 5% blame acceptance acts as a strong low-pass filter: honest nodes converge gradually toward consensus over multiple round-trips, while Byzantine actors are unable to destabilise the network through rapid time oscillations. A Byzantine node would need to maintain its malicious time for 20 epochs to fully drag a good actor to its value, during which time the network can detect and isolate the outlier.

This mechanism makes clock synchronisation a **first-class causal property** rather than an optional optimisation. The system works correctly even if clocks never fully converge—the Epoch ensures linearisability regardless—but the Skew mechanism actively pulls nodes toward consensus, reducing the frequency of Epoch jumps and enabling stable operation.

#### Initialisation: Default Epoch and Skew Values

When initialising a new P-RAL, the system sets the initial timestamp T as: **`[Epoch, [Wall, Skew], Idx]`** where:

- **Epoch:** `Epoch = UnixTime + prior_skew`, where `prior_skew` is any prior known clock skew preserved in metadata or provided by a clock sync node. If no prior skew is available, `prior_skew = 0` and the epoch starts at UnixTime.
- **Wall:** The current physical wall clock time at initialisation
- **Skew:** Initially set to `0`, representing the node's initial belief that its clock is accurate
- **Idx:** Initially set to `0`

**Initialisation Logic:**
- If a node has previously computed clock skew (preserved in metadata from a previous session or received from a clock sync node), it uses that skew to adjust the starting epoch
- The Skew starts at 0 and will be adjusted through the probabilistic consensus mechanism as the node participates in the network
- This allows nodes that have been part of the network before to start closer to the network's current causal generation

**Benefits:**
- Provides global coarse sync without a central server
- Even if two nodes have never met, their Epochs will be roughly in the same "galaxy"
- Nodes with prior network participation start closer to the current causal generation, reducing the initial Epoch jump required when they reconnect
- Inertial belief handles the rest—if a node boots and is behind the network's current causal generation, the first message it receives will trigger Epoch advancement and frame translation (Skew adjustment), but with strong inertia preventing rapid changes

This decision stabilises the "physics" of the system. By anchoring the Epoch to Unix time (adjusted for known skew) at startup, we ensure that even isolated nodes start in a reasonable causal space. The system becomes self-stabilising—it uses gossip to find a fixed point for time (through Skew consensus), space (window size), and state (consensus), while maintaining local consistency at every step. The Skew mechanism actively pulls nodes toward a stable mean time, reducing the frequency of Epoch jumps once the network reaches consensus.

#### Internal Linearisability: Fractional Idx Refinement

The Idx component uses fractional refinement to enable strict ordering of internal propagation cycles without advancing physical time. The Idx value equals BaseIdx plus Round divided by MaxRounds. This fractional refinement provides linearisability [6] **even outside individual P-RALs**—when multiple P-RALs are coordinating or when splitting a P-RAL across distributed boundaries, the fractional Idx ensures unambiguous ordering.

**Behaviour:**
- **External input (Observe Pulse):** Increments BaseIdx, Round starts at 0
- **Internal propagation (Link Relation):** Increments Round, Idx becomes fractional
- **Bounded rounds:** Round ∈ [0, MaxRounds), preventing unbounded fractional growth
- **Serialisation:** The computed fractional Idx value is part of T, serialised as a single number

**Example:** When an external Observe Pulse arrives, T might be [5, [1704067200, 0], 42.00] (BaseIdx=42, Round=0, Skew=0). As links propagate, the Round increments: 42.01, 42.02, etc. When quiescence is reached at Round=5, T is [5, [1704067200, 0], 42.05]. The next external Observe Pulse increments BaseIdx to 43 and resets Round to 0, yielding [5, [1704067200, 0], 43.00].

The fractional Idx allows strict ordering of the propagation wavefront without requiring wall clock advancement for each internal step. Critically, this makes timestamps from different P-RALs directly comparable—if P-RAL A is at T=[5, [1704067200, 0], 42.03] and P-RAL B is at T=[5, [1704067200, 0], 42.07], we can unambiguously order them even though they're separate networks. When comparing timestamps, the system uses `[Epoch, Wall + Skew, Idx]` to determine ordering.

#### Implications for Serialisability

This architecture ensures that P-RAL serialisation preserves causal order across distributed boundaries:

**When packing a P-RAL:**
- All T timestamps are serialised as `[Epoch, [Wall, Skew], Idx]` where Idx contains the fractional refinement
- Both Wall and Skew are preserved exactly, maintaining the node's belief about its clock offset
- Causal relationships are preserved in the Epoch ordering
- Fractional Idx values are preserved exactly, maintaining internal propagation ordering

**When unpacking a P-RAL:**
- Timestamps are restored exactly, including fractional Idx values and the [Wall, Skew] pair
- The receiving node applies inertial frame translation to translate the unpacked timestamps into its local frame of reference
- The Skew values from the unpacked P-RAL are treated as evidence in the probabilistic consensus mechanism
- Propagation can resume from the exact state where it was serialised
- The fractional Idx allows the receiving node to correctly order unpacked operations relative to its own ongoing propagation

**Cross-P-RAL linearisability:**
- A P-RAL serialised on Node A can be deserialised on Node B
- Node B's local clock may be completely different
- The Epoch-based ordering ensures Node B correctly orders all operations relative to its local state
- The inertial belief mechanism allows Node B to gradually adjust its belief about time while maintaining causal correctness and resisting rapid changes
- The fractional Idx ensures operations from the unpacked P-RAL interleave correctly with Node B's local propagation
- The probabilistic consensus mechanism actively pulls Node B's Skew toward the network mean, reducing future Epoch jumps

This makes RaCSTS networks truly portable across distributed boundaries—serialisation and deserialisation are inverses that preserve all causal structure. The fractional Idx refinement is what enables linearisability **outside individual P-RALs**, allowing multiple P-RALs to coordinate or merge while maintaining strict causal ordering.

### 7.6 Leader-Free Consensus via Sync Op: Fixed-Point Gossip

RaCSTS provides a natural mechanism for distributed consensus without request-response protocols, heavyweight locking, or leader election. The Sync Op leverages the propagator network itself to achieve consensus through "rolling snowball" accumulation.

**Why Leader-Free:**

The system achieves consensus without a leader through three foundational properties:

1. **Inertial belief ensures global linearisability without a central master clock**: When nodes receive remote timestamps, they translate events from remote frames into their local frame through inertial belief, adjusting both Epoch (for causal ordering) and Skew (for frame translation) while maintaining strong resistance to rapid changes. No central coordinator is needed—each node independently maintains its own Believed Inertial Time Frame with inertia, while translating events from other frames. Consensus emerges implicitly from these translations.

2. **Semilattice join operations guarantee convergence without coordination**: The network state model is a join-semilattice [10]. When two nodes have divergent states, they join their states using `NewState = CurrentState ∨ ProposedState`. Because the data model is a semilattice (like CRDTs [7,8]), both sides are guaranteed to converge on the same result without a central coordinator.

3. **Any node can initiate consensus for any path**: There is no designated leader node that coordinates consensus. Every node has equal authority to emit a Sync Op for any state path. If multiple nodes initiate competing Syncs, they merge naturally through the accumulator dictionary or resolve through Epoch-based ordering.

#### Observe Rejection: The Transition to Stale

An **Observe rejection** occurs when an Observe Pulse arrives at a node but the `Old` value in the Pulse doesn't match the node's current state (Cur ≠ Old). This can happen when:
- A node has been partitioned and rejoins the network
- A P-RAL is deserialised in a new environment
- Concurrent updates have diverged
- A node speculatively committed a value that conflicts with network consensus

When an Observe rejection is detected:
1. The node's state transitions to `stale` (regardless of previous state)
2. The stale state acts as a signal: "this value is potentially outdated"
3. This enables Sync Op Relations to update the value
4. The node emits a Sync Op to seek consensus

The transition to `stale` is the trigger for consensus coordination—it opens the gate for distributed agreement.

#### Sync Op Structure

The Sync Op is a specialised Op Relation that emits a consensus accumulator. It takes a count (target threshold for consensus, such as quorum size or node count), a path (state path being decided, like "config" or "LeaderID"), and a dictionary (accumulator mapping nodeId to value).

The Sync Op is not a request-response—it's a **propagating constraint** that accumulates witnesses as it flows through the gossip fabric.

#### Communication Between P-RALs: RECV and SYNC

While internal propagation handles consistency within a P-RAL, **RECV** and **SYNC** operations handle **communication** between neighboring P-RALs. This is the gossip layer that enables distributed convergence.

**On OBSERVE:**

When an Observe Pulse arrives and `old != current`, the system returns a **SYNC Op**. This SYNC Op propagates through the network of neighboring P-RALs, seeking consensus.

**On SYNC:**

When a SYNC pulse arrives, the system checks the quorum:

```pseudocode
if count(keys) == target_quorum:
  if value == 'stale':
    if quorum_met_for_value:
      set value as 'consensus'
    else:
      increase required_count
      return incoming SYNC with new count
  else:
    // do nothing (already decided)
else:
  if not voted_yet:
    add vote to original SYNC
    return modified SYNC
  else:
    return original SYNC unchanged
```

This creates a "rolling snowball" effect where the SYNC accumulator grows as it propagates through the network until consensus is reached.

**On RECV:**

RECV is the communication entrypoint:

```pseudocode
for each node in incoming dictionary:
  T_last = get_last_T(node) from local tracking (stored as [Epoch, [Wall, Skew], Idx] per node)
  filtered_pulses = filter pulses where T_incoming > T_last (comparing [Epoch, Wall + Skew, Idx] structures)
  merge filtered_pulses into P-RAL.meta (append)
  process each pulse, applying inertial frame translation to translate the event into the local frame (adjusting Epoch and Skew with inertia)
```

**DELTA:**

DELTA collects changes since the last DELTA execution:

```pseudocode
changes = collect_changes_since_last_delta()
change_dict = {nodeId: Pulse[]} with your changes
merge other_node_pulses from P-RAL.meta (set in RECV)
clear P-RAL.meta recorded pulses
update last_delta_time in P-RAL.meta
return RECV with change_dict
```

**The Convergence Guarantee:**

This separation–internal propagation for local consistency, RECV/SYNC for distributed communication–ensures that each P-RAL reaches quiescence locally while multiple P-RALs converge to consensus globally. The convergence is guaranteed by the mathematical properties of the underlying data structure (join-semilattice [10]), ensuring that even if the network splits, both sides will join when they reconnect. There's no need for a central coordinator–convergence is a natural consequence of the propagator network's structure.

#### Valuation Functions

The final value used is determined by a reduction of the dictionary:
- `Mean(values)`: Average of all witnessed values
- `Mode(values)`: Most common witnessed value
- `Max(values)`: Maximum witnessed value
- `Quorum(values)`: Value from majority of witnesses

#### Consensus as Refinement

The Sync Op leverages the propagator network's fundamental property: **local consistency, global convergence**. This is leader-free consensus because convergence is guaranteed by the mathematical properties of the underlying data structure, not by coordinator logic.

**Semilattice Foundation:**
- The network state model is a join-semilattice [10] (foundation of CRDTs [7,8])
- When two nodes receive different Sync dictionaries, they join: `NewState = CurrentState ∨ RemoteState`
- The join operation is:
  - **Commutative**: `A ∨ B = B ∨ A` (order doesn't matter)
  - **Associative**: `(A ∨ B) ∨ C = A ∨ (B ∨ C)` (grouping doesn't matter)
  - **Idempotent**: `A ∨ A = A` (applying twice has no effect)
- These properties guarantee convergence without any central coordinator
- If a network splits and both sides modify the Sync dictionary, they simply join when they reconnect

**Local Network Behaviour:**
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

**The Observe Guardrail:** For bidirectional relations (like the temperature converter example), developers might fear infinite loops. The Observe operation's "Old vs. New" check acts as an implicit circuit breaker: if `New === Old`, the operation is a no-op and propagation stops. This prevents circular dependencies from causing infinite propagation when values stabilise.

**The Leader-Free Property:**

Consensus in RaCSTS is leader-free because:
- **No election needed**: Inertial belief and semilattice properties eliminate the need for leader election protocols
- **No single point of failure**: Any node can initiate consensus; no designated coordinator
- **Partition tolerance**: Network splits don't break consensus—they pause it. Reconnection triggers automatic merge through join operations
- **Zero-Knowledge verification**: Each node independently verifies causal correctness through local Epoch comparison and OLD value matching (transitions to `stale` on mismatch)
- **The network IS the coordinator**: Consensus emerges from the local interactions of propagator cells, not from centralised logic

This is not bolt-on leader-free consensus—it's an emergent property of the propagator network's mathematical foundation.

#### Non-Termination: Circuit Breakers and Max Rounds

**Oscillation Detection:**

In pathological cases, a network may oscillate between two states indefinitely. For example:
- Node A computes value based on Node B
- Node B computes value based on Node A
- Each update triggers the other, creating an infinite loop: A → B → A → B...

**Max Rounds Circuit Breaker:**

RaCSTS includes a bounded execution mechanism to prevent infinite loops:

- **MaxRounds:** A configuration parameter limiting the number of propagation rounds per logical time step
- **Behaviour:** When Round reaches MaxRounds, propagation halts for that time step
- **Result:** The system returns partial state + evidence of progress (T-ordering shows forward progress even if quiescence isn't reached)
- **Interpretation:** Partial state indicates the network may not converge without external constraints. Progress evidence (T advances) shows the system is making forward progress, not deadlocked.

**What Bounded Execution Returns:**

When MaxRounds is reached:
1. **Partial State:** Current cell values at the point of halting
2. **Progress Evidence:** T timestamps showing causal advancement
3. **Round Count:** Evidence that MaxRounds was reached (not deadlock)
4. **Interpretation:** "Progress evidence" vs "correct result" — bounded execution may halt before full quiescence, but T-ordering proves forward progress

**Non-Convergence Scenarios:**

- **Adversarial Cycles:** Networks with pathological dependency graphs (A = B + 1, B = A + 1) may not converge
- **Conflicting Constraints:** Multiple relations enforcing incompatible constraints
- **Oscillating Values:** Relations that don't satisfy monotonicity may cause oscillation

**Handling Non-Convergence:**

- **External Constraints:** Add external Observe Pulses to break cycles
- **Relation Design:** Ensure relations satisfy monotonicity properties
- **MaxRounds Tuning:** Increase MaxRounds for complex networks, but recognise that some networks may require external intervention

**Important:** Circuit breakers are a bounded execution mechanism, not a correctness guarantee. They prevent infinite loops in adversarial graphs but do not guarantee quiescence. Progress evidence (T-ordering) shows the system is making forward progress, but bounded execution may halt before full quiescence is reached.


---

## 8. Real Implementation: Suss

**Strapline:** "Relational Propagators for Distributed Causal Logic"

### 8.1 Overview

**Suss** is the reference TypeScript implementation of RaCSTS. It demonstrates that the specification is not theoretical—it is practical, implementable, and ready for production use.

**Etymology and Meaning:** The name "Suss" honors Gerald J. Sussman, whose foundational work on propagator networks with Alexey Radul [1] provided the theoretical foundation for this system. But it also doubles as an evocative verb in modern English—to "suss out" means to investigate, to understand, or to find the truth of a situation. This perfectly encapsulates what the library does: it **susses** the state of an arbitrary graph and provides the "Just Enough Knowledge" to act on it. The library susses out the state, susses out the relationships, susses out what needs to propagate.

**Toolkit Philosophy:** Suss provides primitives that compose, not a framework that prescribes. The four core operations (defining network by connecting nodes via relations, applying operations from the outside world, collapsing/aggregating pulses, running propagation rounds) are the complete toolkit. Everything else is built from these primitives.

**Purpose:** Suss exists to prove RaCSTS works and to provide practical tooling for building serialisable propagator networks in TypeScript. It is opinionated about correctness, not about how you use it.

### 8.2 Reference Implementation

**Correctness and Clarity:** Suss prioritises correctness and clarity over performance. The implementation demonstrates that RaCSTS is implementable without compromises to the specification.

**The Four Core Operations:** Suss implements the four core operations exactly as specified in the RaCSTS specification:
- Defining network by connecting nodes via relations using `network()`, `node()`, `relation()`, and `connect()`
- Applying operations from the outside world using `apply()` with pulses constructed by `pulse(t, op, args, meta?)` where operations are created with `operation(opId, implementation)` and added to networks during construction, and `meta` is optional
- Collapsing/aggregating pulses using `collapse()` to remove redundancy while preserving causal integrity
- Running propagation rounds using `propagate()` to maintain relationships and reach quiescence

**Type Safety:** Suss is strongly typed. TypeScript types for CAnATL, Value, Pulse, and all other entities ensure correctness at compile time. The type system enforces invariants that would be runtime errors in untyped implementations.

**Serialisation:** Suss can serialise P-RAL (containing nodes with ATL values, links array, relations, meta, and asOf) to JSON and deserialise JSON back to P-RAL with identical structure. The implementation demonstrates deterministic round-trip—serialising and deserialising a network produces an identical network. Only the P-RAL structure is guaranteed serialisable; literals within ATL values are opaque and may contain non-serialisable references (e.g., WeakRefs) in runtime implementations.

Serialisation is not bolted on—it is fundamental to how Suss works.

### 8.3 Provided Networks

**Shadow Object Propagator:** Suss provides a built-in network for shadow object models. This network demonstrates sparse encoding:
- Uses P-RAL nodes with ATL values to represent only essential object state
- Much of a node's runtime state may be WeakRefs (not serialisable), but literals are opaque
- Only the P-RAL structure (nodes, links, relations, meta, asOf) is guaranteed serialisable
- Maintains private state for dirty propagation logic (relations maintain their own temporal context)
- Provides dirty propagation (manual triggering)
- Bridges imperative JavaScript code with the propagator model

This illustrates that P-RAL is not a direct conversion of entire user objects—it is a sparse encoding of only what needs to be communicated. The tagged literal structure allows efficient representation where tags dispatch to the appropriate interpretation.

**Integration Patterns:** Suss demonstrates how to bridge imperative code and the propagator model:
- Convert JavaScript objects to CAnATL structures
- Create Op Relations that emit Pulses from object mutations
- Use Link Relations to synchronise related objects
- Serialise complete object graphs as P-RAL snapshots

The Shadow Object Propagator is both a useful primitive and a reference implementation of integration patterns.

### 8.4 Production Considerations

**Performance:** Performance is a function of connectivity, not network size (e.g., O(e) where e is the number of active edges). Networks with high connectivity (many links per node) require more propagation rounds to reach quiescence. Propagation respects causal ordering across rounds (T-ordering), but within a single round, many nodes can update in parallel as long as they're not causally dependent. Highly connected nodes create bottlenecks because they require more rounds to reach quiescence. Sparse networks with low connectivity can be very fast even with many nodes.

**Serialisation:** Serialisation can be optimised by caching serialised representations in metadata. However, metadata has zero guarantees regarding preservation during serialisation cycles—implementations may discard, modify, or ignore metadata. Only the core P-RAL structure (nodes, links, relations, meta, asOf) is guaranteed to round-trip. Literals within ATL values are opaque and may contain non-serialisable references (e.g., WeakRefs) in runtime implementations.

**Storage:** CAnATL cells contain only authoritative state—no history, window, or context at the node level. Relations that require temporal context (smoothing, debouncing, moving averages) maintain their own private, non-authoritative state separate from the cells.

**History Preservation:** Cells do not preserve history. If you need complete history:
- Use persistent immutable data structures (structural sharing preserves history naturally)
- Maintain a separate pulse log to record all operations
- Store snapshots at key points (serialise P-RAL periodically)

**Batching:** Batch operations for performance. Instead of computing constraint alignments after every Op, collect multiple pulses and compute alignments once. The `collapse()` function enables this naturally.

**Distribution:** Splitting networks across boundaries:
- Serialise P-RAL subgraphs
- Transmit P-RAL subgraphs as values
- Provide environment-specific resolvers at each boundary
- Use Pulse exchange for cross-boundary propagation

#### Performance & Complexity

**CAnATL Overhead:**

The CAnATL wrapper adds structure overhead compared to plain in-memory state objects:

- **Memory:** Each CAnATL cell requires `[T, Tag, Value, Meta?]` structure. For a simple value (e.g., number 42), this adds:
  - T: 4 numbers (Epoch, Wall, Skew, Idx) ≈ 32 bytes
  - Tag: string (variable, typically 10-50 bytes)
  - Value: the actual data (minimal for primitives)
  - Meta: optional ATL (variable, often empty)
  - **Total overhead:** ~50-100 bytes per cell for simple values, compared to ~8 bytes for a plain number

- **Computation:** Materialising a Value through interpretation adds one function call per cell read. For simple interpretations (identity function), this is negligible. For complex interpretations, the cost is the interpretation function itself, not the CAnATL structure.

**Serialisation Overhead:**

Serialisation adds JSON encoding overhead:

- **Size:** JSON serialisation of a CAnATL cell is typically 2-3x the in-memory size due to:
  - JSON string encoding
  - Structure metadata (brackets, commas, keys)
  - String representation of numbers and tags
- **Time:** Serialisation requires traversing the entire P-RAL structure. For a network with N nodes and L links:
  - **Time complexity:** O(N + L) — linear in network size
  - **Space complexity:** O(N + L) — linear in network size
  - **Practical performance:** For networks with <1000 nodes, serialisation typically takes <10ms in JavaScript

**Relative to Standard State Objects:**

Compared to standard in-memory state objects (e.g., plain JavaScript objects, Redux stores):

- **Memory:** CAnATL adds ~50-100 bytes overhead per cell. For 1000 cells, this is ~50-100KB overhead.
- **Read performance:** Materialisation adds one function call per read. Negligible for simple values, significant only for complex interpretations.
- **Write performance:** Observe operations require CAS checks (Cur == Old comparison). This adds one equality check per write, typically negligible.
- **Serialisation:** Standard state objects require custom serialisation logic. CAnATL serialisation is automatic but adds JSON encoding overhead (2-3x size increase).

**Bottlenecks:**

- **Connectivity:** The primary performance factor is connectivity (links per node), not network size. A network with 10,000 nodes and 10,000 links (sparse) is faster than a network with 100 nodes and 10,000 links (dense).
- **Propagation rounds:** Each round requires O(L) relation evaluations. High connectivity increases rounds to quiescence.
- **Serialisation:** Large networks (>10,000 nodes) may take >100ms to serialise. Use incremental serialisation or subgraph extraction for large networks.

**Optimisation Strategies:**

- **Metadata caching:** Cache serialised representations in metadata (zero guarantees for preservation).
- **Batching:** Collect multiple Observe Pulses before propagation to reduce round count.
- **Subgraph extraction:** Serialise only relevant subgraphs for transmission.
- **Lazy materialisation:** Materialise Values only when needed, not on every read.

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

#### Serialisation: Pause and Resume

Suss can serialise a network's complete state (P-RAL) to JSON at any point. This serialised network can be transmitted across boundaries (browser to server, saved to disk, sent over network) and then deserialised to resume exactly where it left off. The network's topology, node states, and causal history are preserved. Metadata may or may not be preserved (zero guarantees). This enables true pause-and-resume semantics—a network can be stopped, saved, moved, and continued without loss of core state.

#### Snapshot Files: Bug Reports with Network State

From §1.0's promise: A bug report includes a P-RAL snapshot file. In production, when an error occurs, Suss can capture the complete network state at that moment. This snapshot includes all node values (as ATL structures), the propagation graph (links array), and causal history (asOf timestamps). Metadata may be included but is not guaranteed to be preserved. During debugging, this snapshot can be loaded into a development environment, recreating the exact network state from production. Developers can step through propagation, inspect node values, modify relations, and verify fixes—all without needing production logs or trying to reproduce the error state manually.

**Section Total: ~1,100 words**

---

## 9. Conclusion: Capabilities Unlocked

### 9.1 The Solution

RaCSTS provides a formal specification for serialisable propagator networks. By reframing networks as properly basic data structures built from CAnATL (Causal Annotated Associative Tagged Literals), RaCSTS makes networks into values.

The specification is complete:
- Type hierarchy from Literal to CAnATL defines properly basic types
- Model entities bridge formal definitions to operational semantics
- Core operations (defining network by connecting nodes via relations, applying operations from the outside world, collapsing/aggregating pulses, running propagation rounds) provide complete control
- Properties and guarantees (monotonicity, serialisable consistency, scale invariance, meta-circularity) are testable

Suss, the TypeScript reference implementation, demonstrates that RaCSTS is practical. The four core operations, strong typing, and serialisation capabilities prove that the specification can be implemented without compromises.

The transformation is complete: networks are no longer infrastructure you configure—they are values you manipulate.

### 9.2 Capabilities Unlocked

When networks become serialisable values, capabilities that were impossible or required heavy infrastructure become natural:

**Serialisable networks:** CAnATL structures serialise to JSON. Pack/unpack operations enable pause/resume of complete network state.

**Scale invariance:** The same primitives work at all scales—single cells, subnetworks, whole networks, meta-networks. No special cases.

**Meta-circularity:** Networks can contain networks as values. Composition is structural, not nominal. A cell's value can be an entire network.

**Practical tooling:** Suss provides real toolkit primitives for building propagator networks in TypeScript. Production-ready, strongly typed, well-tested.

**Network composition:** Build systems by composing networks. Network libraries become possible—reusable network patterns shared like code libraries.

**Cross-boundary integration:** Networks work across any boundary—browser, server, mobile, embedded—because they're serialisable data.

**Time-travel debugging:** Serialise network state at any point. Step backward and forward through time. Replay from any state. P-RAL snapshots are the currency of debugging.

**Network versioning:** Track changes to network structure over time. Use Git for network history. Diff P-RAL snapshots to see what changed.

### 9.3 Future Directions

RaCSTS opens research and engineering directions:

**Extensions:** Domain-specific propagators for UI, physics, optimisation, machine learning. Custom higher-order relations beyond the standard toolkit (mark, linear, map, constrain, join, reduce).

**Integration:** Patterns for integrating RaCSTS networks with existing frameworks. React integration. Redux integration. Database integration.

**Formal Verification:** Proving properties of CAnATL structures and network topologies. Verifying that specific networks always reach quiescence. Static analysis of P-RAL structures.

**Ecosystem:** Network libraries for common patterns. Marketplaces for sharing networks. Tooling for inspecting, analysing, and optimising P-RAL structures.

**Performance:** Optimisations for large-scale networks. Parallel propagation where causal independence allows. Incremental serialisation (delta encoding). Persistent immutable data structures for efficient history preservation through structural sharing.

**History and Replay:** Pulse log systems for recording complete operation history. Replay mechanisms for time-travel debugging. Integration with persistent data structures for zero-copy history preservation.

### 9.4 The Next Cliff

If RaCSTS makes networks into values, what is the next object we still lack?

**Standard network diff/merge semantics:** How do we diff two P-RAL structures meaningfully? How do we merge divergent network states? Current diff tools work on text, not network topology. We need semantic diff/merge for P-RAL.

**Market-grade trust and provenance:** How do we verify that a P-RAL snapshot came from a trusted source? How do we track lineage through serialisation and transmission? We need signed P-RAL snapshots with verifiable provenance chains.

**Formal verification of relations:** How do we prove that a relation always reaches quiescence? How do we verify that a network of relations has no pathological cycles? We need tools for static analysis of relation correctness.

**Cross-runtime canonical resolvers:** How do we ensure that a Node Resolver in JavaScript produces the same results as one in Python or Rust? How do we define canonical interpretations that work across languages? We need a specification for resolver behaviour, not just resolver signatures.

Each solution reveals the next missing object. The journey continues.

**Section Total: ~600 words**

---

## Appendices

### Appendix A: Glossary

**Amnesiac Event:** When an Observe Pulse is rejected (Cur ≠ Old), the node's state transitions to `stale`. The node "forgets" its current value's authority and seeks consensus through Sync Op Relations.

**ATL (Associative Tagged Literal):** Recursive associative structure `Dictionary<ATL | TL | TL[]>`. Foundation for representing arbitrary structured data. Can contain nested dictionaries, tagged literals, or arrays of tagged literals.

**Believed Inertial Time Frame (BITF):** Each node's local frame of reference for time. The BITF is defined by `BelievedTime = Wall + Skew`, where Wall is the invariant proper time and Skew is the frame translation. Nodes translate events from remote frames into their own BITF through inertial frame translation, maintaining strong inertia against rapid changes.

**CAnATL (Causal Annotated Associative Tagged Literal):** The fundamental cell type in RaCSTS. Structure: `[T, Tag, Value, Meta?]` containing logical timestamp, semantic tag, current authoritative value, and optional metadata (no preservation guarantees). Cells contain only authoritative state—no history, window, or context at the node level.

**Cell:** A CAnATL structure representing a unit of state in a propagator network. Cells are the "variables" that propagators reconcile.

**Change Set:** A collection of operations (Pulses) applied to cells. Used by toolkit primitives to batch operations for efficient application.

**Epoch:** Logical counter component of T timestamp. Provides primary causal ordering. The "most significant bit" of the timestamp.

**Epoch-led Hybrid Logical Clock with Skew (EHLC-S) / Gossiped Believed Inertial Time Frame (G-BITF) (T):** Logical timestamp structure `[Epoch, [Wall, Skew], Idx]` implementing a Galilean coordinate system. Epoch is the causal ratchet. Wall is the **invariant proper time**—an immutable physical hardware timestamp that witnesses when the event actually occurred; Wall is never adjusted and serves as the anchor point for frame translation. Skew is the **only mutable component**—a first-class property representing the node's belief about its offset from the network's consensus frame; Skew is adjusted through frame reconciliation, allowing events to be translated into different local frames while preserving the original Wall. Idx disambiguates concurrent events with fractional refinement. Each node maintains its own **Believed Inertial Time Frame (BITF)**, where `BelievedTime = Wall + Skew` represents where the node believes it exists in the network's consensus timeline. Consensus emerges implicitly from the network of frame translations rather than through explicit synchronisation.

**Fractional Idx:** The Idx component of T uses fractional refinement `Idx = BaseIdx + Round / MaxRounds` to track propagation rounds within a logical time step, enabling linearisability even outside individual P-RALs.

**Gossiped Believed Inertial Time Frame (G-BITF):** The relativistic coordinate system model implemented by EHLC-S. Each node maintains its own Believed Inertial Time Frame (BITF) where time is represented as `Wall + Skew`. Wall is the invariant proper time (immutable), and Skew is the frame translation (mutable). Consensus emerges implicitly from the network of frame translations rather than through explicit synchronisation.

**Inertial Belief (Frame Translation):** When a node receives a remote pulse with timestamp T_remote, it performs inertial frame translation: (1) checks if the pulse is logically in the past or concurrent (within threshold), (2) if future, advances Epoch: `Epoch_local ← max(Epoch_local, Epoch_remote) + 1`, (3) runs probabilistic `computeSkew` with inertial belief (5% blame acceptance, reduced for nodes with poor history) to translate the event into the local frame by adjusting Skew. The inertial belief creates strong resistance to rapid changes—nodes maintain their frame unless given strong evidence. Wall remains immutable as the invariant proper time. This ensures global linearisability while maintaining each node's Believed Inertial Time Frame with inertia. Consensus emerges implicitly from the network of frame translations.

**Interpretation:** A function that projects a CAnATL to a materialised Value. Defines how a cell's operation history becomes a concrete value. Each cell is an "Interpretation VM."

**Lineage (State):** The provenance and authority level of a cell's value. Four types in hierarchy: `'observed'` (Observe accepted—always wins), `'consensus'` (Sync completed—beats stale and derived), `'stale'` (Observe rejected, seeking consensus—beats derived), `'derived'` (Link computed—lowest authority). Authority: observed > consensus > stale > derived.

**Link Relation:** Internal propagation logic between cells. Signature: `link(srcNode: RealNode, tgtNode: RealNode, meta) -> [srcValue, tgtValue, meta']`. Receives full node objects as input, returns values as output. Maintains relationships between cells.

**Link Selector:** Pattern-based specification for source/target cells in links. Format: `type:id` or `type:constraint`. Supports wildcards (`node:sensor:*`), metadata paths (`node:meta.dirty`), and template variables (`{{id}}`). Enables template links and dynamic graph assembly.

**MaxRounds:** Configuration parameter limiting propagation rounds per logical time step. Circuit breaker preventing infinite loops. When reached, returns partial state + progress evidence.

**Meta-Circularity:** Property that a CAnATL cell's Value can itself be an AnATL containing a network structure. Networks can contain networks, and the same propagation mechanics apply at all scales.

**Monotonicity:** Property that timestamps always increase. Operations are only accepted if they advance logical time (T_new > T_current). Ensures forward progress and prevents time-travel.

**Node:** In P-RAL, a node structure `{ value, state, meta, asOf }`. P-RAL is independent of RaCSTS and uses nodes, not CAnATL cells directly.

**Observe:** The fundamental operation for introducing external entropy. Structure: `[T, ObserveTag, [Path, Old, New], Meta?]`. Compare-and-swap semantics are intrinsic—accepted only if Cur == Old, otherwise triggers amnesiac event. There is no generic "Set" operation.

**Op Relation:** External operation that introduces entropy. Signature: `op(P-RAL, args, meta) -> [delta-P-RAL, Pulse[], meta']`. Entry point for external change.

**P-RAL (Parametric Relational Adjacency List):** The serialisable blueprint of a network containing nodes, links, relations, meta, and T. Independent of RaCSTS. Contains topology, state, and causal markers but no executable code.

**Pulse:** The atomic unit of propagation. Structure: `[T, Tag, Args, Meta?]`. The fundamental unit that flows through the network.

**Quiescence:** State where no further propagation occurs. All cells are stable, no operations accepted. The "solution" to the constraint network.

**RaCSTS (Relational and Causal State Transition System):** Pronounced "Rackets." The specification for serialisable propagator networks. Grounded in State Transition Systems theory.

**Scale Invariance:** Property that the same primitives work at all scales—single cells, subnetworks, whole networks, meta-networks. No special handling required for nested networks.

**Skew (Frame Translation):** The only mutable component of the `[Wall, Skew]` pair in T. Skew represents the node's current belief about its offset from the network's consensus frame. Skew is adjusted through inertial frame translation, allowing events to be translated into different local frames while preserving the original Wall as the invariant witness. The adjustment maintains strong inertia—only a small percentage of blame is accepted (5% default), creating resistance to rapid changes. The "Believed Time" is `Wall + Skew`.

**Standard Higher-Order Relations:** Six core toolkit primitives: `mark` (directional truth propagation), `linear` (bidirectional numeric constraints), `map` (functional transformation with conflict resolution), `constrain` (bidirectional constraint solver), `reduce` (N→1 aggregation), `join` (N→M relational knitting). These are standard primitives, not optional extensions.

**State Transition System (STS) [15]:** The theoretical grounding for CAnATL. CAnATL is a reified trace of an STS, where each Pulse is a transition and T provides causal ordering.

**Suss:** The reference TypeScript implementation of RaCSTS. Demonstrates practical application and proves the specification is implementable.

**Sync Op:** Specialised Op Relation for consensus. Emits a consensus accumulator that accumulates witnesses as it flows through the gossip fabric. Leader-free consensus mechanism.

**T-ordering:** Causal ordering enforced by T timestamps. Operations are processed in T order, ensuring causal correctness. The foundation of monotonicity and serialisability.

**Template Link:** Link using pattern-based selectors (wildcards, constraints) instead of exact node IDs. Expands to concrete links on-demand during propagation. Enables compact graph representation—one template governs many nodes without serialising individual links. Common patterns: collector (N→1), shadow (1→1), relational join (M→N).

**Value:** Union type `AnATL | AnTL`. The type of "a value" in the system—any serialisable data with optional semantic tags and annotations.

**Wall (Invariant Proper Time):** The immutable physical hardware timestamp component of T. Wall witnesses when the event actually occurred and is never adjusted—it serves as the anchor point for frame translation in the G-BITF model. Wall allows the originator to recognise its own events while peers translate that event into their local frame via Skew adjustment.

### Appendix B: Complete Type Definitions

```typescript
// Base Types
type Literal = unknown
type Tag = string
type Path = string
type ObserveTag = string
type T = [Epoch: number, [Wall: number, Skew: number], Idx: number] // Idx uses fractional refinement: Idx = BaseIdx + Round / MaxRounds. BelievedTime = Wall + Skew

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

// P-RAL Structure (independent of RaCSTS)
interface PREL {
  nodes: { [id: string]: Node }
  relations: { [id: string]: Relation }
  links: Link[]  // Array of links, not object
  meta: ATL
  asOf: T  // Current logical timestamp
}

// Node structure in P-RAL
interface Node {
  value: ATL  // ATL, not Value - tagged literals dispatch on tag for interpretation
  asOf: T
  lineage: 'observed' | 'consensus' | 'stale' | 'derived'
  meta: ATL
}

// Relation in P-RAL (implementation-dependent)
// Relations are opaque - their structure depends on the implementation
// For serialisation, relations are recreated from metadata or relation definitions
type Relation = unknown  // Implementation-dependent structure

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
interface RealNode {
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
  srcNode: RealNode,
  tgtNode: RealNode,
  meta: Meta
) => [Value, Value, Meta]
```

### Appendix C: Complete Example

#### Bidirectional Celsius/Fahrenheit Converter

This example demonstrates how RaCSTS bridges theory to code with a concrete, minimal implementation. The example shows how the standard `linear` higher-order relation makes bidirectional unit conversion trivial.

**The Linear Relation:**

Recall from Section 6.3.5 that `linear` is a bidirectional numeric relation that solves linear relationships of the form `y = a + bx`. Given this form, unit conversions become straightforward parameterisation.

**The Conversion Formula:**

The relationship between Celsius (C) and Fahrenheit (F) is:
```
F = (9/5) × C + 32
```

Rewriting in the linear form `y = a + bx`:
```
F = 32 + (9/5) × C
```

Where:
- `a = 32` (the bias)
- `b = 9/5` (the gradient)
- `x = C` (source value)
- `y = F` (target value)

**The Relation Definition:**

Since `linear` is a higher-order relation, it must be instantiated with parameters to create a concrete relation. The form is `linear(a, b) // y = a + bx`:

```typescript
// Higher-order relation: linear(a, b) returns a LinkRelation
// For Celsius/Fahrenheit: F = 32 + (9/5) × C
const tempRelation = linearRelation(32, 1.8)  // a=32, b=9/5=1.8
```

**The P-RAL Structure:**

P-RAL is independent of RaCSTS and contains nodes, links, relations, meta, and T:

```typescript
// Create operations (if custom ones needed beyond default [recv, delta, sync])
const observeOp = operation('observe', observeImplementation)

// Network construction - config goes in metadata, ops defaults to [recv, delta, sync]
const temperatureNetwork = network(T0, {})

// Factory functions for entities
const celsiusNode = node("celsius", { "temperature": [["celsius", 25]] }, T0, "observed")
const fahrenheitNode = node("fahrenheit", { "temperature": [["fahrenheit", 77]] }, T0, "derived")
const [tempRelationId, tempRelation] = relation("temp", linearRelation(32, 1.8))

// Single connect function - handles everything (bidirectional connection)
const connectedNetwork = connect(
  temperatureNetwork,
  celsiusNode,
  tempRelation,
  fahrenheitNode
)
```

**How It Works:**

1. **Forward (C → F):** When the Celsius cell updates to a new value C_new:
   - The `linear` relation computes: `F_new = 32 + (9/5) × C_new`
   - Updates the Fahrenheit cell with the computed value

2. **Backward (F → C):** When the Fahrenheit cell updates to a new value F_new:
   - The `linear` relation performs the inverse: `C_new = (5/9) × (F_new - 32)`
   - Updates the Celsius cell with the computed value

**The Triviality:**

Given the form `linear(a, b) // y = a + bx`, the Celsius/Fahrenheit converter is simply:
- One relation instantiation: `linearRelation(32, 1.8)`
- One link with no args (the link references the relation ID)
- No custom code required

The link has no arguments because the parameters are captured when instantiating the higher-order relation. This is the pattern for all higher-order relations: instantiate with parameters, reference by ID in links.

The bidirectional nature is automatic—the `linear` relation handles both directions. If you change Celsius, Fahrenheit updates. If you change Fahrenheit, Celsius updates. The relation is the constraint, not a directional function.

**Observe Operations:**

To update the temperature, emit Observe Pulses:

```typescript
// Construct pulses using operations from the network
// Assume observe and recv are imported as symbols
// Two ways to construct pulses:

// Method 1: Direct construction
const observePulse1 = pulse(t_obs, observe, ["celsius", 25, 30])  // [Path, Old, New]
const recvPulse1 = pulse(t_msg, recv, [pulse(t_obs, observe, ["celsius", 25, 30])])

// Method 2: Helper method (preferred)
const observePulse2 = observe.pulse(t_obs, ["celsius", 25, 30])  // [Path, Old, New]
const recvPulse2 = recv.pulse(t_msg, [observe.pulse(t_obs, ["celsius", 25, 30])])

// Apply pulse to network
const result = apply(connectedNetwork, observePulse2)

// Propagate - returns new network, tracks changed nodes by timestamp
const updatedNetwork = propagate(connectedNetwork)
// The network automatically computes F = 32 + (9/5) × 30 = 86°F
// The Fahrenheit cell updates via the linear relation
```

**Serialisation:**

The entire network serialises to JSON:

```json
{
  "nodes": {
    "celsius": {
      "value": { "temperature": [["celsius", 30]] },
      "asOf": [0, [1704067200, 0], 1.0],
      "lineage": "observed",
      "meta": {}
    },
    "fahrenheit": {
      "value": { "temperature": [["fahrenheit", 86]] },
      "asOf": [0, [1704067200, 0], 1.05],
      "lineage": "derived",
      "meta": {}
    }
  },
  "relations": {
    "temp": "linear(32, 1.8)"  // Serialised as relation definition, recreated at deserialisation
  },
  "links": [
    {
      "srcSelector": "node:celsius",
      "tgtSelector": "node:fahrenheit",
      "relationId": "temp",
      "args": [],
      "meta": {},
      "label": "celsius-to-fahrenheit"
    }
  ],
  "meta": {},
  "asOf": [0, [1704067200, 0], 1.05]
}
```

Note: Relations are implementation-dependent structures in the runtime PREL. For serialisation, they are stored as relation definitions (e.g., `"linear(32, 1.8)"`) and recreated when deserialised by instantiating the higher-order relation with the stored parameters. Node values are ATL structures where tagged literals dispatch on tag for interpretation. This enables sparse encoding—only essential state is serialised, not full object representations.

This serialised network can be transmitted, stored, or resumed—the network is a value.

**Key Insight:**

The `linear` relation demonstrates how RaCSTS makes common patterns trivial. Unit conversions, coordinate transformations, and linear constraints all reduce to parameterised links. The relation handles bidirectionality, inverse computation, and propagation automatically. This is the power of properly basic data structures combined with standard higher-order relations.

### Appendix D: Comparison with Related Work

**Propagator Networks (Sussman & Radul) [1]:** RaCSTS builds on the propagator model but adds serialisation as a first-class concern. Traditional propagators are runtime constructs; RaCSTS makes them values.

**CRDTs (Conflict-free Replicated Data Types) [7,8]:** CRDTs ensure convergence in distributed systems. RaCSTS uses similar ideas (monotonicity, convergence) but for propagation networks, not distributed state.

**Reactive Programming (RxJS, MobX):** Reactive libraries handle data flow and change propagation. RaCSTS makes the network itself serialisable, enabling capabilities reactive libraries don't provide.

**State Machines:** State machines define transitions between discrete states. RaCSTS is grounded in State Transition Systems [15] but focuses on networks of continuous propagation, not discrete state machines.

**Datalog / Logic Programming [16,17]:** Datalog defines relations and propagates constraints. RaCSTS provides similar constraint propagation but with serialisable, temporal networks as first-class values.

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
System halts with current state. Logs execution trace showing propagation history. Returns P-RAL snapshot representing partial progress.

**Recovery:**
External intervention may be needed:
- Relax constraints (modify relations to be more lenient)
- Add constraints (add relations to break symmetry, force convergence)
- Modify topology (remove problematic links)

**Verification:**
Inspect progress evidence (T-ordering, execution trace) to understand why convergence failed. Analyze relation behaviour, identify oscillations or divergence patterns.

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

## References

1. **Sussman, G. J., & Radul, A.** (2009). The Art of the Propagator. *MIT Computer Science and Artificial Intelligence Laboratory*. Available: https://groups.csail.mit.edu/mac/users/gjs/6.945/readings/art-of-propagator.pdf

2. **Lamport, L.** (1978). Time, Clocks, and the Ordering of Events in a Distributed System. *Communications of the ACM*, 21(7), 558-565. Available: https://lamport.azurewebsites.net/pubs/time-clocks.pdf

3. **Fidge, C. J.** (1988). Timestamps in Message-Passing Systems That Preserve the Partial Ordering. *Proceedings of the 11th Australian Computer Science Conference*, 56-66.

4. **Mattern, F.** (1988). Virtual Time and Global States of Distributed Systems. *Parallel and Distributed Algorithms*, 215-226.

5. **Kulkarni, S., et al.** (2014). Logical Physical Clocks and Consistent Snapshots in Globally Distributed Databases. *Proceedings of the VLDB Endowment*, 8(12), 1446-1457. Available: https://cse.buffalo.edu/tech-reports/2014-04.pdf

6. **Herlihy, M. P., & Wing, J. M.** (1990). Linearisability: A Correctness Condition for Concurrent Objects. *ACM Transactions on Programming Languages and Systems*, 12(3), 463-492. Available: https://cs.brown.edu/~mph/HerlihyW90/p463-herlihy.pdf

7. **Shapiro, M., et al.** (2011). Conflict-free Replicated Data Types. *Proceedings of the 13th International Symposium on Stabilisation, Safety, and Security of Distributed Systems (SSS 2011)*, 386-400. Available: https://hal.inria.fr/inria-00555588/document

8. **Shapiro, M., et al.** (2011). A Comprehensive Study of Convergent and Commutative Replicated Data Types. *Rapport de recherche RR-7506, INRIA*. Available: https://hal.inria.fr/inria-00555588/document

9. **Mills, D., et al.** (2010). Network Time Protocol Version 4: Protocol and Algorithms Specification. *RFC 5905*. Available: https://www.rfc-editor.org/rfc/rfc5905.html

10. **Davey, B. A., & Priestley, H. A.** (2002). *Introduction to Lattices and Order* (2nd ed.). Cambridge University Press.

11. **Eugster, P. T., et al.** (2004). The Many Faces of Publish/Subscribe. *ACM Computing Surveys*, 36(2), 114-131. Available: https://www.cs.cornell.edu/home/rvr/papers/Gossip.pdf

12. **Demers, A., et al.** (1987). Epidemic Algorithms for Replicated Database Maintenance. *Proceedings of the 6th Annual ACM Symposium on Principles of Distributed Computing*, 1-12.

13. **Lamport, L.** (1998). The Part-Time Parliament. *ACM Transactions on Computer Systems*, 16(2), 133-169.

14. **Ongaro, D., & Ousterhout, J.** (2014). In Search of an Understandable Consensus Algorithm. *Proceedings of the 2014 USENIX Annual Technical Conference*, 305-319. Available: https://raft.github.io/raft.pdf

15. **Manna, Z., & Pnueli, A.** (1992). *The Temporal Logic of Reactive and Concurrent Systems: Specification*. Springer-Verlag.

16. **Abiteboul, S., et al.** (1995). *Foundations of Databases*. Addison-Wesley.

17. **Ceri, S., Gottlob, G., & Tanca, L.** (1989). What You Always Wanted to Know About Datalog (And Never Dared to Ask). *IEEE Transactions on Knowledge and Data Engineering*, 1(1), 146-166.

---

**END OF WHITE PAPER**
