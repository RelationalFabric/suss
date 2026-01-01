# When Your Abstraction Escapes

## The dangerous art of following ideas where they lead, and the gold you find when you do

I promised two follow-up articles to my recent work on [Howard's claims system](https://github.com/RelationalFabric/howard) and [Canon's lazy typing](https://levelup.gitconnected.com/the-end-of-disposable-code-how-i-built-universal-apis-in-typescript-618b3ed38302). I promised Fast Value Hashing and Object Metadata: the pieces that make proofs persistent and eliminate what I called the "Logical Tax."

In ["The Logic of Claims"](https://levelup.gitconnected.com/the-logic-of-claims-why-validation-is-broken-and-what-replaces-it-dd16464a4f0c), I wrote: "The next two articles in this series will track Howard's evolution as we build exactly this: **Fast Value Hashing** to eliminate the Logical Tax, and **Object Metadata** to make proofs persist."

Then, in ["The Return to Canon"](https://github.com/RelationalFabric/canon/blob/main/articles/protocols-and-lazy-modules.md), I wrote: "This isn't those articles."

This is also not those articles.

But this time, something different happened. This time, the abstraction didn't just lead us to a prerequisite–it escaped completely. What started as a simple question about rewriting an ADR ended with a whitepaper specification for serialisable propagator networks.

This is the story of that journey.

---

### The Starting Point: The ADR That Started It All

Howard needed fast object hashing. The goal was clear: eliminate the Logical Tax by making proofs persistent. If we could hash objects deterministically and cache those hashes, we could avoid re-verifying claims at every boundary.

The original ADR 0006 proposed a solution: hash objects using `objectId` (a stable identifier) and `entries` (a map of property keys to precomputed value hashes). It was structure-aware–it knew exactly where properties lived in a POJO–but it worked.

> Then came the question that changed everything: "Should we rewrite this to use Canon's protocols?"

The intent was simple: make the hashing structure-independent. Instead of hardcoding property access, use Canon's `PAssoc` protocol. The hash would work whether the data was a POJO, a Map, or an Immutable structure.

It seemed like a straightforward refactor. But as I tried to write it, I hit a wall. The ADR assumed you could enumerate properties, compute per-key hashes, and compose them. But what if the data came from a legacy SQL system as key-value rows? What if it was an Immutable.js structure? What if someone mutated the object outside our control? The structure-aware approach required knowing the container type upfront, which broke the entire premise of Canon's universal API.

The specific frustration was this: I couldn't write a clean ADR that described fast hashing without also describing how to handle every possible container type. The abstraction was leaking.

---

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

---

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

---

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

Before we continue, a brief primer: propagator networks, as described by Gerald Sussman and Alexey Radul in their foundational work, represent a structural shift in how we think about computation. In a propagator network, **cells** store values and **propagators** maintain relationships between cells. When a cell changes, its connected propagators automatically update dependent cells. The key distinction: propagators are bidirectional constraints, not unidirectional functions. If you declare A = B + C, changing A can propagate back to B or C. The network maintains these relationships automatically until it reaches quiescence–a stable state where all constraints are satisfied. (For full technical details, see the [RaCSTS whitepaper](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapaers/Relational%20Causal%20State%20Transition%20System.md).)

Then came the conversation shift that changed everything.

We were talking about metadata management–how to track which axioms matched, which canons were entailed, how to invalidate efficiently when objects changed. We needed a way to maintain a "shadow graph" of WeakMap and WeakSet relationships to handle upward invalidation.

> I wrote: "In fact, the shadow graph generalises to a propagator network specifically for communicating object changes and aggregate metadata."

> That single sentence changed the entire trajectory.

> Gemini's response captured the shift perfectly: "This is the 'Universal Adaptor' evolving into its final form: a **Distributed Propagator Network for Semantic State.**"

We had moved beyond mere invalidation into collaborative computation. The shadow graph wasn't just tracking changes–it was becoming a reactive graph where the cost of any semantic claim was shared across every system that touched that data.

The "Scream" protocol we'd been discussing wasn't just notification–it was a Propagator Pulse. Properties weren't just values–they were Cells in the propagator network.

> Then came the dangerous question: "Do we need anything from canon to implement this in canon, or have we discovered a new primitive?"

Gemini's answer was definitive: "We have discovered a **new primitive**, but it is one that effectively acts as the **'Connective Tissue'** for everything else in Canon."

> This wasn't just a refactor anymore. This was something bigger.

---

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

---

### The Final Evolution: From Change Sets to Serialisable Networks

The evolution continued: memo → ChangeSet → Op Log → `[T, op, ...args]`.

We moved from storing computed hashes in memos to storing change semantics in ChangeSets. We moved from ChangeSets to tagged operation logs. But the real breakthrough came when we realised we needed to model non-monotonic values as monotonic values efficiently.

The solution was `[old, new, T]` where `T` is monotonically increasing. By wrapping the non-monotonic mutation in a monotonic envelope, we created a versioned partial order. The timeline of the object became the lattice itself. Instead of the current value being the state, the state became the latest witnessed transition.

This led to tagged op logs: `[TAG, old, new, T]`. The tag became the protocol ID or interpretation key. This unified the data model and the instruction set. We had `['ASSOC', old, new, T]` for structural changes in key-value mappings, `['SEQ', old, new, T]` for positional changes in collections, `['META', old, new, T]` for semantic metadata changes, and `['TYPE', old, new, T]` for type-level shifts.

The critical insight: time (`T`) came first, making every operation a "Time-Sorted Packet." This enabled causal ordering and serialisability. In a distributed graph split across an edge, we could detect gaps if patches arrived out of order. If a cell had state `[v1, v2, T10]` and received `[v3, v4, T12]`, it knew it had missed a transition at `T11`.

The cell became an interpretation VM. Each cell was a tiny virtual machine defined by its `interpretation` function. All modification was done via communicating operations to yourself or other cells. > The op log itself became the value–in memory-space A, the value is the live POJO; across the edge, the value is the replayable log.

As we refined the model, we realised: "In this model, each cell is a tiny VM defined by 'interpretation'."

The toolkit API emerged:
- `append(op, cs) -> cs'` – the monotony injector
- `compact(cs) -> cs'` – the garbage collector
- `reduce(cs, interpretation) -> value` – the projector
- `propagate([cs1, v1], [cs2, v2], relation) -> [op1, op2]` – the constraint solver

> This wasn't just for hashing anymore. This was a computational model.

The result is RaCSTS–the theory–and Suss–the toolkit built to bring that theory into the real world.

---

### The Reflection: Gold in Them Thar Hills

The journey wasn't linear. We almost got lost in abstraction. We almost trapped ourselves.

There were moments of concern: "Are we taking this metaphor too far?" "Do we need to focus on the affordances we need vs. those that are enabled?" "Have we invalidated anything from the public-facing side?"

But the gold was there. We discovered that propagator networks were the missing primitive. We discovered that networks could be serialisable values. We discovered that this computational model–this toolkit–was what TypeScript needed.

> **The key realisation:** The "missing object" wasn't just a better hash function or a better metadata system. This realisation–that the relationship itself had to be a serialisable value–became the foundation for what I call RaCSTS (Relational and Causal State Transition System). The **Logic**–the relations between data points, the constraints that govern how values propagate–needed to be just as serialisable and inspectable as the data itself.

> In traditional code, `a = b + c` is a transient execution. In a propagator network, that `+` is a living, serialisable relation.

We had spent decades modelling nouns (objects, entities) while leaving the verbs (relations, constraints) to be hard-coded functions. **The breakthrough was making the relations into data–into values you could serialise, version, and reason about.**

> The lesson: Sometimes you have to follow the abstraction where it leads.

The outcome: [RaCSTS (Relational and Causal State Transition System)](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapaers/Relational%20Causal%20State%20Transition%20System.md) – a specification for serialisable propagator networks as properly basic data structures.

What started as a question about rewriting an ADR became a 7,875-word whitepaper that formalises propagator networks as serialisable values. The network itself–its topology, state, and causal history–became a first-class artifact you can serialise, version, and reason about.

---

### What We Learned About the Process

This journey revealed something important about the process of iterative refinement.

Having a thinking partner–in this case, Gemini–allowed us to explore ideas in real-time. The back-and-forth nature of the conversation let us test assumptions, pivot when we hit walls, and recognise when we'd discovered something bigger than we intended.

The danger was real. We could have gotten lost in abstraction. We could have trapped ourselves with scope creep. We could have invalidated our public-facing APIs.

But the value of following insights was equally real. Sometimes the abstraction knows where it needs to go. Sometimes you have to trust the process.

The balance between "infrastructure of suspicion" and "fabric of proof" extends to how we think about our own abstractions. We can be suspicious of every new layer, every new primitive. Or we can trust that if we're rigorous about the process, if we test our assumptions, if we're willing to pivot when we discover we're solving a different problem, we'll find the gold.

---

### What's Next: From Discovery to Implementation

The promise is fulfilled, but differently than expected.

Fast Value Hashing is still coming, but now it's built on a better foundation. RaCSTS provides the computational model–the specification for networks as serialisable values. Suss provides the toolkit–the four-function API for managing the calculus of change. Canon provides the semantic layer–protocols and axioms that give meaning to data. Howard provides the logic of claims–propositions that establish truth.

The ecosystem works together: Suss (the propagator network), Canon (the relational fabric), and Howard (the claims system) compose into something that eliminates the Logical Tax through architecture, not just optimisation.

This journey moved from discovery to specification. The [RaCSTS whitepaper](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapaers/Relational%20Causal%20State%20Transition%20System.md) formalises everything we discovered through these conversations: propagator networks as serialisable values, cells as interpretation VMs, and networks as first-class artifacts. It's the Logic–the mathematical foundation that makes the architecture possible.

The [Suss toolkit](https://github.com/RelationalFabric/suss) is the implementation–the practical TypeScript library that brings RaCSTS to life. It's the Heart–the code that makes the specification real.

If you're ready to see the math that traps the abstraction, start with the [RaCSTS whitepaper](https://github.com/RelationalFabric/suss/blob/main/docs/whitepapaers/Relational%20Causal%20State%20Transition%20System.md); if you're ready to start coding, head to the [Suss toolkit](https://github.com/RelationalFabric/suss).

The journey from hashing to networks wasn't planned. But it was necessary. Sometimes your abstraction escapes, and you have to follow it.

Sometimes there's gold in them thar hills.

By turning the relations into data, the abstraction no longer 'escapes' into the ether of side-effects–it stays exactly where we can see it, sync it, and trust it.

That's why I'm building Suss–to catch the abstraction before it runs away.
