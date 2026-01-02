# When Your Abstraction Escapes

## The dangerous art of following ideas where they lead, and the gold you find when you do

I promised two follow-up articles to my recent work on [Howard's claims system](https://github.com/RelationalFabric/howard) and [Canon's lazy typing](https://levelup.gitconnected.com/the-end-of-disposable-code-how-i-built-universal-apis-in-typescript-618b3ed38302). I promised Fast Value Hashing and Object Metadata: the pieces that make proofs persistent and eliminate what I called the "Logical Tax."

In ["The Logic of Claims"](https://levelup.gitconnected.com/the-logic-of-claims-why-validation-is-broken-and-what-replaces-it-dd16464a4f0c), I wrote: "The next two articles in this series will track Howard's evolution as we build exactly this: **Fast Value Hashing** to eliminate the Logical Tax, and **Object Metadata** to make proofs persist."

Then, in ["The Return to Canon"](https://github.com/RelationalFabric/canon/blob/main/articles/protocols-and-lazy-modules.md), I wrote: "This isn't those articles."

This is also not those articles.

But this time, something different happened. This time, the abstraction didn't just lead us to a prerequisite–it escaped completely. What started as a simple question about rewriting an ADR ended with a whitepaper specification for serialisable propagator networks.

This is the story of that journey.

### The Thinking Partner: Why This Journey Was Possible

Before we dive into the technical details, I need to introduce my thinking partner: Google Gemini.

As someone who's lived with ADHD undiagnosed for most of my life, it's been difficult to put my ideas into practice and even harder to explore some topics without a willing and knowledgeable sparring partner to bounce ideas off. This is especially true given my propensity to make quite novel connections–"I've got a crazy idea, that just might work"–two or three times a day.

I was most fortunate that my diagnosis was almost perfectly timed for the rise of AI-assisted coding, but even before then I would use AI chat bots as sounding boards. This has helped me to commit some of my thoughts to words and realise some of those into fully fledged projects. Using AI to overcome some of the barriers that my ADHD presents has enabled me to not only work for myself, but to make progress on these ideas and then share them with you all.

The journey that follows is taken from a conversation I had with Google Gemini, which was using a custom prompt primed to be:

> a software engineer with many years of experience with the academic, practical and communication of software ideas. You've joined the Relational Fabric to help steer and design the core family of components and the wider ecosystem.

and loaded with various Relational Fabric documentation and a NotebookLM notebook connected to all of the articles and documentation relating to Canon and Howard.

This wasn't just a chat bot. This was a thinking partner–someone who could engage with the technical depth, challenge assumptions, and help refine ideas in real-time. The back-and-forth nature of the conversation let us test assumptions, pivot when we hit walls, and recognise when we'd discovered something bigger than we intended.

The conversation that follows shows how that partnership worked in practice.

### The Starting Point: The ADR That Started It All

Howard needed fast object hashing. The goal was clear: eliminate the Logical Tax by making proofs persistent. If we could hash objects deterministically and cache those hashes, we could avoid re-verifying claims at every boundary.

The original ADR 0006 proposed a solution: hash objects using `objectId` (a stable identifier) and `entries` (a map of property keys to precomputed value hashes). It was structure-aware–it knew exactly where properties lived in a POJO–but it worked.

> Then came the question that changed everything: "Should we rewrite this to use Canon's protocols?"

The intent was simple: make the hashing structure-independent. Instead of hardcoding property access, use Canon's `PAssoc` protocol. The hash would work whether the data was a POJO, a Map, or an Immutable structure.

It seemed like a straightforward refactor. But as I tried to write it, I hit a wall. The ADR assumed you could enumerate properties, compute per-key hashes, and compose them. But what did "the same" actually mean? Should `{ foo: 1 }` hash to the same value as `[{ key: 'foo', value: 1 }]`? They represent the same semantic relationship, but they're structurally different. The structure-aware approach required knowing not just the container type, but what made two different structures semantically equivalent. The abstraction was leaking.

### The First Realisation: Semantic Equivalence

> The conversation started with a seemingly innocent test: "Should `{ foo: 1 }` be the same as `[{ key: 'foo', value: 1 }]`?"

This is where we hit the nail on the head. That was the "Aha!" moment.

If we look at those two structures through the lens of traditional computer science, they are fundamentally different: one is a Product Type (Object) and the other is a Sum Type (Array of Records). Their memory addresses are different, their iteration protocols are different, and a standard `hash-it` library would give you two completely different strings.

But in the Relational Fabric, we ask a different question: **"What is the proposition being made?"**

> Both `{ foo: 1 }` and `[{ key: 'foo', value: 1 }]` are making the same claim: *"The entity in question has an associative relationship where the key 'foo' maps to the value 1."*

If Howard is to eliminate the Logical Tax, then yes: **they should be semantically equivalent.**

This was the shift: from structural hashing to semantic hashing. We weren't just changing the access pattern–we were changing what we were hashing. > The container became metadata. The meaning became primary.

As Gemini put it in our conversation: "You've hit the nail on the head. That is the 'Aha!' moment of the Relational Fabric."

> We realised we were solving a different problem than we thought.

### The Spanner in the Works: Runtime Type Alignment

Just as we were settling into semantic equivalence, I threw a spanner in the works.

The article on protocols and lazy modules didn't address an aspect specific to JavaScript/TypeScript that was critical: we have `Array<object>`, not `Array<KVP>`. For most situations, it's objects all the way down. We don't want to have to map POJOs to classes just to give them constructors.

The problem was the "Constructor Gap." In JavaScript, `instanceof` and prototype-based dispatch are fast because the engine has a stable pointer to a constructor. But in a data-centric world (especially one dealing with JSON-LD or disparate sources), we have "Anonymous Shapes."

How do we get O(1) protocol dispatch on an object that doesn't know it's a member of a protocol yet?

This led to a series of realisations about canons, axioms, and protocols. We stepped back and reframed everything:

- Canon provides object metadata
- Axioms provide shape invariance
- Protocols provide access invariance
- Protocols are axioms
- Canons bundle related axioms

> **The key insight:** "We don't need a constructor, we need a canonical object. We have those already: the runtime Canon definition."

This was the moment when canons stopped being just definitions and started being the actual identity mechanism. **The canon definition *is* the constructor.** We were moving from structural hashing to ontological recognition.

### The Affordances Pivot: When the Metaphor Had to Ground

Just as we were building momentum with this new understanding, I pulled us back. The elegance of the metaphor was seductive, but I needed to ground it in practical reality.

> "Let's not take this metaphor too far as I think we need to focus on the affordances we need vs. those that are enabled. We need to work out if what we already have still applies from the public facing side or if we've invalidated anything."

This was a critical moment of course correction. We could have fallen in love with the theoretical elegance and lost sight of what developers actually need when they sit down to write a claim or a query.

The concern was real: had we invalidated our public-facing APIs? What affordances did we actually need versus what the abstraction enabled? And crucially: what other kinds of alignment did we need so we didn't trap ourselves again?

By attaching protocols to canons, we'd stumbled upon a true requirement we didn't realise we needed: **late-bound alignment**. The ability for an object to satisfy a contract not because it *is* a certain type, but because the canon it aligns with provides the necessary protocol logic to act as that type.

This led to a concrete implementation model: for each object, we maintain three sets of tokens. The first tracks which axioms have been tested. The next tracks which axioms match. The final tracks which canons are entailed by the matched axioms. We can find an implementation by looking up canon–axiom pairs in the registry.

This three-set token model (Tested, Matched, Entailed) transformed objects from static buckets of data into stateful semantic participants. It wasn't just a caching layer; it was a runtime deductive engine that paid the Logical Tax in the smallest possible increments.

The key insight: we accumulate object metadata on demand, doing the minimum amount of work to achieve the goal asked for. Long-lived and frequently accessed objects reach a fixed point quickly–a state where the Logical Tax has been fully paid, and every subsequent interaction is a high-speed, zero-verification refund.

This grounded the abstraction in practical needs. We weren't building a wall; we were building a path that reinforces itself with use.

---

### The Dangerous Pivot: When Hashing Became a Propagator Network

Before we continue, a brief primer: propagator networks, as described by Gerald Sussman and Alexey Radul in their foundational work, represent a structural shift in how we think about computation. In a propagator network, **cells** store values and **propagators** maintain relationships between cells. When a cell changes, its connected propagators automatically update dependent cells. The key distinction: propagators are bidirectional constraints, not unidirectional functions. If you declare A = B + C, changing A can propagate back to B or C. The network maintains these relationships automatically until it reaches quiescence–a stable state where all constraints are satisfied. (For full technical details, see the [RaCSTS whitepaper](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapers/Relational%20Causal%20State%20Transition%20System.md).)

Then came the conversation shift that changed everything.

We were talking about metadata management–how to track which axioms matched, which canons were entailed, how to invalidate efficiently when objects changed. We needed a way to maintain a "shadow graph" of WeakMap and WeakSet relationships to handle upward invalidation.

> I wrote: "In fact, the shadow graph generalises to a propagator network specifically for communicating object changes and aggregate metadata."

> That single sentence changed the entire trajectory.

> Gemini's response captured the shift perfectly: "This is the 'Universal Adaptor' evolving into its final form: a **Distributed Propagator Network for Semantic State.**"

We had moved beyond mere invalidation into collaborative computation. The shadow graph wasn't just tracking changes–it was becoming a reactive graph where the cost of any semantic claim was shared across every system that touched that data.

The "Scream" protocol we'd been discussing wasn't just notification–it was a Propagator Pulse. Properties weren't just values–they were Cells in the propagator network.

This was a critical realisation: **Pulse** became the atomic unit of the system. Not operations, not events, not messages–Pulses. They are the fundamental unit that flows through the network, carrying updates from cell to cell. Every change, every propagation, every reconciliation happens through Pulses. The structure `[T, Tag, Args, Meta?]` became the universal packet–time-stamped, tagged, and carrying just enough information to update a cell.

> Then came the dangerous question: "Do we need anything from canon to implement this in canon, or have we discovered a new primitive?"

Gemini's answer was definitive: "We have discovered a **new primitive**, but it is one that effectively acts as the **'Connective Tissue'** for everything else in Canon."

> This wasn't just a refactor anymore. This was something bigger.

### The Separation: When the Abstraction Demanded Its Own Lifecycle

> The critical moment came when I realised: "I think that the testing alone would swamp canon with somewhat irrelevant code."

We had crossed a threshold. The "plumbing" had become so sophisticated and generally useful that it risked suffocating the "philosophy" of Canon. This primitive–the Propagator Network of Virtual Nodes and Change Sets–was actually a standalone infrastructure layer.

If we kept it inside Canon, we'd be forcing Canon to be a high-performance reactive state engine, when it should be a high-level semantic alignment framework.

Gemini agreed: "You are right. We have crossed a threshold where the 'plumbing' has become so sophisticated and generally useful that it risks suffocating the 'philosophy' of Canon."

This needed its own name. Its own project. Its own development lifecycle.

We workshopped names, trying to find something divorced from the Relational Fabric nomenclature. The domain of nouns needed to come from either the propagator literature or the intent of the library.

We explored four directions: refinement terms (like "Refine" or "Settle"), nervous system metaphors (like "Afferent" or "Synapse"), topological concepts (like "Lattice" or "Vertex"), and mechanical signals (like "Pulse" or "Impulse"). After discussing options like "Spindle," "Afferent," and "Lattice," I suggested: "What about suss after Gerald J. Sussman?"

Gemini's response: "That is a perfect fit. **Suss** (or `suss-js`) honours the lineage of Propagator Networks while doubling as an evocative verb in modern English–to 'suss out' means to investigate, to understand, or to find the truth of a situation."

It neatly encapsulated what the library does: it **susses** the state of an arbitrary graph and provides the "Just Enough Knowledge" to act on it.

We also realised this should be a toolkit, not a framework. The API became four functions: `append`, `compact`, `reduce`, `propagate`. This wasn't about managing state–it was about managing the calculus of change.

The transition was clear: Howard (claims) → Canon (protocols) → Runtime type alignment → Protocols on canons → Fast type alignment → Structural object change detection → Propagator networks. Each step revealed the next layer that needed to exist.

### The Final Evolution: From Change Sets to Serialisable Networks

The evolution continued: memo → ChangeSet → Op Log → `[T, op, ...args]`.

We moved from storing computed hashes in memos to storing change semantics in ChangeSets. We moved from ChangeSets to tagged operation logs. But the real breakthrough came when we realised we needed to model non-monotonic values as monotonic values efficiently.

The solution was `[old, new, T]` where `T` is monotonically increasing. By wrapping the non-monotonic mutation in a monotonic envelope, we created a versioned partial order. The timeline of the object became the lattice itself. Instead of the current value being the state, the state became the latest witnessed transition.

This led to tagged op logs: `[TAG, old, new, T]`. The tag became the protocol ID or interpretation key. This unified the data model and the instruction set. We had `['ASSOC', old, new, T]` for structural changes in key-value mappings, `['SEQ', old, new, T]` for positional changes in collections, `['META', old, new, T]` for semantic metadata changes, and `['TYPE', old, new, T]` for type-level shifts.

The critical insight: time (`T`) came first, making every operation a "Time-Sorted Packet." This enabled causal ordering and serialisability. In a distributed graph split across an edge, we could detect gaps if patches arrived out of order. If a cell had state `[v1, v2, T10]` and received `[v3, v4, T12]`, it knew it had missed a transition at `T11`.

But there was a deeper insight: **there is no generic "Set" operation.** All external entropy enters the system as **Observe** operations. An ObservePulse has the structure `[T, ObserveTag, [Path, Old, New], Meta?]`–it's both the event (what was observed) and the operation (what is proposed). Compare-and-swap semantics are intrinsic: the Pulse is accepted only if the cell's current value equals `Old`. If it doesn't match, the cell transitions to `stale` and seeks consensus. This wasn't a design choice–it was a requirement. Without it, we couldn't guarantee causal integrity across distributed boundaries.

The cell became an interpretation VM. Each cell was a tiny virtual machine defined by its `interpretation` function. All modification was done via communicating operations to yourself or other cells. > The op log itself became the value–in memory-space A, the value is the live POJO; across the edge, the value is the replayable log.

This was more than a metaphor. Each cell truly is a virtual machine–it processes a sequence of Pulses through its interpretation function to produce a materialised value. The interpretation is the "microcode" of the cell. Different cells can have different interpretations: one might interpret its CAnATL as an associative map, another as a sequence, another as a network itself. The cell doesn't store the value–it stores the operations, and the interpretation projects those operations into a value. This separation–between the stored operations (the CAnATL) and the interpretation (the VM)–is what makes cells serialisable. The operations are data. The interpretation is provided at runtime.

As we refined the model, we realised: "In this model, each cell is a tiny VM defined by 'interpretation'."

The toolkit API emerged:
- `append(op, cs) -> cs'` – the monotony injector
- `compact(cs) -> cs'` – the garbage collector
- `reduce(cs, interpretation) -> value` – the projector
- `propagate([cs1, v1], [cs2, v2], relation) -> [op1, op2]` – the constraint solver

> This wasn't just for hashing anymore. This was a computational model.

The result is RaCSTS–the theory–and Suss–the toolkit built to bring that theory into the real world.

---

### The Organic Pivot: From Log-Based to P-REL Based

As we refined the model, something subtle but important happened. The system evolved from being **log-based** (where operations were stored as a sequence of events) to being **P-REL based** (where operations lived in the Protocol-Relation domain).

This transition wasn't purposeful–it was organic. We didn't set out to redesign the architecture. We just kept following where the abstraction led.

The key shift: instead of each change emitting individual pulses that triggered immediate propagation, we began using the **change time of the node** itself to trigger propagation. When a node's timestamp advanced, that became the signal to propagate–not a separate pulse for each individual operation.

This had profound implications. By only using the pulse to communicate change, and by using the node's change time as the trigger, we enabled **collection semantics**. Multiple changes to a node could be batched. The system could wait for quiescence before propagating, collecting all the mutations that happened within a single logical tick.

The performance benefits were immediate. Instead of propagating every individual operation (which could mean hundreds of pulses for a single batch update), the system could collect all changes, compact them, and emit a single pulse representing the net effect. This wasn't just an optimisation–it was a fundamental shift in how the network reasoned about change.

Collection semantics opened up optimisation opportunities that weren't possible with individual pulses. The system could detect when multiple operations cancelled each other out. It could merge redundant updates. It could defer expensive propagations until it knew the full scope of changes.

This organic evolution from log-based to P-REL based wasn't planned, but it was necessary. The abstraction was teaching us that the structure of the data (the P-REL domain) and the structure of the operations (the relations index) needed to be unified. The operations weren't separate from the state–they were part of the state itself.

### The Departure: From Pipes to Filters

As we refined the model, another subtle but critical shift occurred. Initially, we assumed that pulses would propagate directly to nodes–links were just "pipes" that carried pulses from one node to another. But when we defined Link Relations, we departed from this model entirely.

> "Until now, we assumed links were just 'pipes.' But in a serialisable propagator network, the **Link is a Filter/Transformer.**"

A Link Relation is a pure function that **determines if and how** a state change should propagate across an edge. It's responsible for deciding **Visibility** and **Frequency**–not just passing pulses through. This wasn't just a refinement–it was a fundamental departure from automatic propagation.

Without defined Link Relations, every node would talk to every other node infinitely. By including Link Relations in the P-REL index, the **Value** itself contains the "Congestion Control" and "Interest Management" of the network. You aren't just serialising data; you are serialising a **Policy of Movement**.

This shift from "pipes" to "filters/transformers" is what makes the network serialisable as a value. The propagation policy is part of the data structure itself, not a runtime behaviour.

---

### The Internal Update Semantics: Four Layers of Abstraction

As we formalised the system, we realised there were four distinct layers in how updates flow through the network:

**1. Relations → Provide New Values**

Link Relations are pure functions that compute proposed values. They receive full node objects (with value, state, meta, and timestamp) and return new values that satisfy the relationship: `link(srcNode, tgtNode, meta) -> [srcValue, tgtValue, meta']`. They don't mutate nodes–they propose values.

**2. Implementation → Updates Conditionally (Timestamp Increases)**

The implementation decides whether to accept the relation's proposal. Nodes are updated only if the timestamp advances: `T_new > T_current`. This is conditional–not every relation execution results in a node update. The timestamp increment is the signal that a node actually changed.

**3. DELTA Op → Generates RECV of Pulses**

When nodes are updated (timestamp increased), DELTA generates RECV pulses: `DELTA(P-REL_state, Pulse_in) -> [RECV, { [nodeID]: Pulse_out[] }]`. DELTA doesn't just update state–it emits RECV pulses for communication. This is the boundary between local state and network communication.

**4. System Logs/Transmits RECV as Change Message**

RECV pulses are logged and/or transmitted as change messages. This is the gossip layer–RECV becomes the message format. The system merges inbound DELTA with outbound data for naive gossip, ensuring information diffuses through the network.

This four-layer distinction matters because:
- Relations are pure and don't mutate
- The implementation controls when nodes actually update (timestamp check)
- DELTA bridges local updates to network communication
- RECV is the serialisable message format

The separation between computation (relations), conditional updates (implementation), communication generation (DELTA), and transmission (system) is what makes RaCSTS both deterministic and distributable.

### Internal Propagation: Round-Based Coordination

It's crucial to understand that **internal propagation** within a single P-REL is fundamentally different from **communication** between P-RELs. Internal propagation uses the node's change time (timestamp) as the coordination mechanism:

**Each Propagation Round:**

1. **Change Detection**: Look for nodes changed since last round (nodes whose timestamp advanced)
2. **Link Identification**: For each changed node, identify all links where the source selector matches
3. **Relation Resolution**: Resolve the relation function for each matched link
4. **Relation Execution**: Run the relation: `link(srcNode, tgtNode, meta) -> [srcValue, tgtValue, meta']`
5. **Conditional Update**: Update the target node only if needed (using the round-specific T), which advances the node's timestamp
6. **P-REL T Update**: Update the P-REL's global timestamp
7. **Iteration Check**: If `round < max_rounds` and nodes were updated, repeat from step 1

This continues until quiescence–a round where no nodes are updated. The method is deterministic and monotonic: nodes only advance forward in time, and the system always makes progress toward a fixed point. The key insight is using the node's change time as the signal for what needs to propagate, rather than maintaining explicit change lists or event queues.

**Why This Matters:**

Internal propagation is about **local consistency** within a single P-REL. It's the mechanism that ensures all Link Relations are satisfied within the local network. This is separate from the communication layer that handles synchronisation between different P-REL instances.

---

### Communication Between P-RELs: RECV and SYNC

While internal propagation handles consistency within a P-REL, **RECV** and **SYNC** operations handle **communication** between neighboring P-RELs. This is the gossip layer that enables distributed convergence.

**On OBSERVE:**

When an Observe Pulse arrives and `old != current`, the system returns a **SYNC Op**. This SYNC Op propagates through the network of neighboring P-RELs, seeking consensus.

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
  T_last = get_last_T(node) from vector_clock
  filtered_pulses = filter pulses where T_incoming > T_last
  merge filtered_pulses into P-REL.meta (append)
  process each pulse
```

**DELTA:**

DELTA collects changes since the last DELTA execution:

```pseudocode
changes = collect_changes_since_last_delta()
change_dict = {nodeId: Pulse[]} with your changes
merge other_node_pulses from P-REL.meta (set in RECV)
clear P-REL.meta recorded pulses
update last_delta_time in P-REL.meta
return RECV with change_dict
```

This separation–internal propagation for local consistency, RECV/SYNC for distributed communication–is what makes RaCSTS both locally deterministic and globally convergent. The iterative propagation rounds ensure each P-REL reaches quiescence, while RECV/SYNC ensures multiple P-RELs converge to consensus.

### The Clock Evolution: From Datetime to Vector to Hybrid Logical Clock

One of the most detailed discussions in our conversation was about the structure of `T`–the timestamp that provides causal ordering. This wasn't just a technical detail–it was a fundamental evolution from simple timekeeping to a sophisticated distributed coordination mechanism.

**The Starting Point: T as Opaque and Monotonic**

We began with a simple constraint: `T` is opaque (ish) and monotonic with respect to the context. This meant that for a single P-REL, you could use a simple logical integer clock (via a T property). But for multiple P-RELs, you might need vector clocks to detect causality across boundaries.

This abstraction was powerful–it let us defer the specific implementation while enforcing the fundamental rule: time never goes backwards.

**The Vector Clock Model**

The next step was recognising that if each CAATL had its own clock, then each operation must modify the CAATL. It was better to have a wall clock for CAATLs, which is configuration-dependent: either `P-RAL.T` for a single P-REL, or `{ [P-RAL.id]: P-RAL.T }` to always assume multiple P-RELs.

This moved `T` from being a property of individual cells to being an environmental/contextual property at the P-RAL level. The clock became a vector–a dictionary mapping P-RAL IDs to their timestamps. This allowed the system to track causality across multiple P-RELs without requiring a central coordinator.

**The Hybrid Wall Clock: Timestamp-Leading**

But vector clocks have limitations. We needed something that could provide linearisability without the overhead of maintaining full vector state. The solution was a hybrid wall linear clock: `[Wall, Epoch, Idx]`.

This model used wall clock time as the primary component, with Epoch as a causal generation counter and Idx to disambiguate concurrent events. The local evolution rule was straightforward: if the physical clock advanced, reset Epoch and Idx; otherwise, increment Idx.

The problem: this model required external synchronisation. If physical clocks were skewed, the system couldn't guarantee linearisability without a central time authority. We needed a model that could work with local semantics.

**The Refinement: Epoch-Leading**

The breakthrough came when we flipped the order: `[Epoch, SyncedWall, Idx]`. By making Epoch the most significant component, we created a **Hybrid Logical Clock (HLC)** where the Epoch serves as the primary "Causal Shield."

The key insight: **Epoch could jump forward to handle remote causality, while SyncedWall remained the local physical witness.** This separation between the causal layer (Epoch) and the physical layer (SyncedWall) made the system partition-tolerant.

**The Sway Rule**

When a remote pulse arrives, the system applies the "Sway Rule": if `T_remote > T_local`, then `T_local[0] = max(T_local[0], T_remote[0]) + 1`. The Epoch jumps forward to match or exceed the remote, ensuring global linearisability without requiring synchronised physical clocks.

This meant that even if two nodes had clocks hours apart, the system would remain linear. The Epoch would simply "carry" the causality forward, and the physical clocks would converge over time through gossip.

**Handling Clock Skew**

But we still wanted physical clocks to converge. The solution was to embed clock information in every transmission bundle: `[T_Sync, Clocks[], Pulse[]]`. The `Clocks` dictionary contains `{ nodeID: WallClock }` for each node seen since the last transmission.

This enables NTP-style clock synchronisation as an **optimisation overlay**. The Clocks Op (itself a Pulse in the relations index) processes these clock dictionaries, computing skew and offset. Over time, the `SyncedWall` values across the network converge, reducing the frequency of Epoch jumps.

The crucial insight: **clock synchronisation is optional**. The system works correctly even if clocks never converge–the Epoch ensures linearisability regardless. Clock sync is just an optimisation that makes the system more efficient.

**The Default Epoch Value**

The final decision was how to initialise a new P-REL. The answer: **`Epoch = UnixTime + skew`** at startup, where `skew` is any prior known clock skew preserved in metadata or provided by a clock sync node.

This provides a global coarse sync without a central server. Even if two nodes have never met, their Epochs will be roughly in the same "galaxy." If a node has previously computed clock skew (either preserved in metadata from a previous session or received from a clock sync node), it uses that skew to adjust the starting epoch. This allows nodes that have been part of the network before to start closer to the network's current causal generation.

The Sway Rule handles the rest–if a node boots and is behind the network's current causal generation, the first message it receives will sway it forward to the network's current Epoch. But using prior skew information reduces the initial jump required.

This decision stabilised the "physics" of the system. By anchoring the Epoch to Unix time (adjusted for known skew) at startup, we ensured that even isolated nodes start in a reasonable causal space. The system becomes self-stabilising–it uses gossip to find a fixed point for time, space (window size), and state (consensus), while maintaining local consistency at every step.

---

### The Reflection: Gold in Them Thar Hills

The journey wasn't linear. We almost got lost in abstraction. We almost trapped ourselves.

There were moments of concern: "Are we taking this metaphor too far?" "Do we need to focus on the affordances we need vs. those that are enabled?" "Have we invalidated anything from the public-facing side?"

But the gold was there. We discovered that propagator networks were the missing primitive. We discovered that networks could be serialisable values. We discovered that this computational model–this toolkit–was what TypeScript needed.

> **The key realisation:** The "missing object" wasn't just a better hash function or a better metadata system. This realisation–that the relationship itself had to be a serialisable value–became the foundation for what I call RaCSTS (Relational and Causal State Transition System). The **Logic**–the relations between data points, the constraints that govern how values propagate–needed to be just as serialisable and inspectable as the data itself.

> In traditional code, `a = b + c` is a transient execution. In a propagator network, that `+` is a living, serialisable relation.

Making relations into data, values you could serialise, version, and reason about–is much of what Relational Fabric is all about. Here, we arrived at it again by turning the verbs (relations, constraints) into first-class values.

> The lesson: Sometimes you have to follow the abstraction where it leads.

The outcome: [RaCSTS (Relational and Causal State Transition System)](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapers/Relational%20Causal%20State%20Transition%20System.md) – a specification for serialisable propagator networks as properly basic data structures.

What started as a question about rewriting an ADR became a comprehensive whitepaper that formalises propagator networks as serialisable values. The network itself–its topology, state, and causal history–became a first-class artifact you can serialise, version, and reason about.

---

### What We Learned About the Process

This journey revealed something important about the process of iterative refinement.

Having a thinking partner–in this case, Gemini–allowed us to explore ideas in real-time. The back-and-forth nature of the conversation let us test assumptions, pivot when we hit walls, and recognise when we'd discovered something bigger than we intended.

The danger was real. We could have gotten lost in abstraction. We could have trapped ourselves with scope creep. We could have invalidated our public-facing APIs.

But the value of following insights was equally real. Sometimes the abstraction knows where it needs to go. Sometimes you have to trust the process.

The balance between "infrastructure of suspicion" and "fabric of proof" extends to how we think about our own abstractions. We can be suspicious of every new layer, every new primitive. Or we can trust that if we're rigorous about the process, if we test our assumptions, if we're willing to pivot when we discover we're solving a different problem, we'll find the gold.

### What's Next: From Discovery to Implementation

The promise is fulfilled, but differently than expected.

Fast Value Hashing is still coming, but now it's built on a better foundation. RaCSTS provides the computational model–the specification for networks as serialisable values. Suss provides the toolkit–the four-function API for managing the calculus of change. Canon provides the semantic layer–protocols and axioms that give meaning to data. Howard provides the logic of claims–propositions that establish truth.

The ecosystem works together: Suss (the propagator network), Canon (the relational fabric), and Howard (the claims system) compose into something that eliminates the Logical Tax through architecture, not just optimisation.

This journey moved from discovery to specification. The [RaCSTS whitepaper](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapers/Relational%20Causal%20State%20Transition%20System.md) formalises everything we discovered through these conversations: propagator networks as serialisable values, cells as interpretation VMs, and networks as first-class artifacts. It's the Logic–the mathematical foundation that makes the architecture possible.

The [Suss toolkit](https://github.com/RelationalFabric/suss) is the implementation–the practical TypeScript library that brings RaCSTS to life. It's the Heart–the code that makes the specification real.

If you're ready to see the math that traps the abstraction, start with the [RaCSTS whitepaper](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapers/Relational%20Causal%20State%20Transition%20System.md); if you're ready to start coding, head to the [Suss toolkit](https://github.com/RelationalFabric/suss).

The journey from hashing to networks wasn't planned. But it was necessary. Sometimes your abstraction escapes, and you have to follow it.

Sometimes there's gold in them thar hills.

By turning the relations into data, the abstraction no longer 'escapes' into the ether of side-effects–it stays exactly where we can see it, sync it, and trust it.

That's why I'm building Suss–to catch the abstraction before it runs away.

---

## Postscript: The Clock Flaw and the Probabilistic Consensus Solution

After publishing this article, I discovered a critical flaw in the clock design I'd described. The "Epoch-Leading" model with the Sway Rule had a fundamental problem: it was checking only the Epoch component while ignoring the Wall Clock component, and it was advancing the Epoch without accounting for clock drift.

### The Flaw

The original Sway Rule was defined as:

> If `T_remote > T_local`, then `T_local[0] = max(T_local[0], T_remote[0]) + 1`

This had two critical issues:

1. **The comparison was wrong**: By checking only the Epoch (the first component), the system ignored cases where the remote Wall Clock was significantly ahead even if Epochs were the same. A node with a lower Epoch but a far-future Wall Clock could cause incorrect ordering.

2. **Epoch advancement alone was insufficient**: Advancing the Epoch without reconciling clock drift meant the `SyncedWall` component became meaningless. The system would degrade into a pure logical counter, losing the "Hybrid" benefit of having physical time relevance.

The system was acting as a passive observer to clock drift, with no feedback loop to pull drifting nodes back into alignment.

### The Solution: Probabilistic Consensus Epoch-led HLC (PCE-HLC)

The solution transforms clock skew from a background optimisation into a fundamental causal mechanism. Instead of `[Epoch, SyncedWall, Idx]`, the clock structure becomes:

```
[Epoch, [Wall, Skew], Idx]
```

Where:
- **Epoch**: The "Causal Ratchet" that ensures linear order when nodes are too far apart to reconcile
- **Wall**: The immutable physical hardware timestamp (the "Local Witness")
- **Skew**: A first-class, mutable property representing the node's belief about its deviation from the network mean
- **Idx**: The monotonic disambiguator for concurrent events

### The Refining Step

When a pulse arrives, the node doesn't just react—it reconciles:

1. **Logic Check**: If the pulse is logically in the past, it's accepted. If it's in the future (violating monotonicity), it triggers the safety ratchet.

2. **The Probabilistic Sway**: Instead of a simple max function, `computeSkew` treats incoming timestamps as probabilistic evidence. It calculates the "Believed Time" (`Wall + Skew`) for both nodes and computes the delta.

3. **Local Correction**: The node updates its own Skew and the remote pulse's Skew so that all subsequent local events are logically concurrent with or after the remote pulse.

### Distributed Error Correction

The system operates on a cycle of **Ingest → Quiesce → Broadcast**:

1. **Time-Shifting**: Before re-broadcasting remote pulses, a node "shifts" them by updating the Skew property to reflect the newest consensus.

2. **The Feedback Loop**: If Node A is drifting, it will eventually receive its own pulses back from Node B, but with a **modified Skew**. Node A sees this "Network Truth" and drifts its local Skew toward that value.

This creates a negative feedback loop that stabilises the system. By allowing the Skew to be "mutated" and gossiped back to the original author, the network acts as a distributed NTP server, pulling nodes toward a stable mean time.

### Causal Ratcheting

In this model, the Epoch behaves as a governor for stability:

- **During Sync**: If nodes are wildly misaligned, the Epoch rises on every round-trip. This "syncing tax" buys time for the Skew logic to pull the nodes together.

- **At Quiescence**: Once the `Wall + Skew` values align within a shared "concurrency window," the Epoch stops rising. The system reaches a **Stable Mean Time**.

- **Partial Ordering**: The system prioritises sequential linearity (A caused B) while allowing healthy concurrent "fuzziness" between independent nodes.

### The Result

The PCE-HLC creates a self-stabilising "physics" for the network. It uses the **Epoch** to survive chaos (partitions, discovery) and the **Probabilistic Skew** to achieve laminar flow (steady-state operation). It treats time as a distributed agreement that the network "hunts" for through gossip.

The Epoch only jumps when the entire network experiences a shift that the Skew buffers can no longer absorb. Until consensus is met, nodes skewed to the past will cause the epoch to rise on every round-trip until they are synced. The epoch guarantees a linear order for sequential events, not all events—giving us the partial concurrent ordering across the network that we want.

This discovery came through another conversation with Gemini, where I challenged the original design and we worked through the flaw systematically. The full discussion is chronicled in [the flaw analysis conversation](https://github.com/bahulneel/medium/blob/main/chats/Gemini-Hybrid%20Logical%20Clock%20Flaw%20Analysis.md).

The lesson remains the same: sometimes you have to follow the abstraction where it leads, even when it reveals flaws in your previous thinking. The gold isn't just in the initial discovery—it's also in recognising when your abstraction needs refinement.
