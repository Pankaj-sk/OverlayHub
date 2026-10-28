# Full Product Vision

## GitHub Overlay Marketplace for Agentic Commerce

## Core idea

A GitHub overlay marketplace that supports agentic commerce. It lets buyers and AI agents discover, value, and buy GitHub repositories, and transfer ownership from one owner to the next.

## Platform placement

- The marketplace sits on top of existing GitHub repositories, codebases, and user identities. It reuses GitHub infrastructure rather than rebuilding it.
- A user opens marketplace mode from a repo page. Candidate mechanisms: a browser extension, an embedded UI button in the GitHub page, or a URL change (for example `githubsales.../abc`).

## Transaction model (buyer and seller)

- The flow is a transaction between two parties: a buyer and a seller.
- Smart contracts automate the technical ownership transfer.
- Digital signature services (for example DocuSign) legally bind the agreement to both parties.
- For repos with no set price, an offer-based workflow applies. A buyer or agent submits a proposal. GitHub channels notify the owner. The owner can accept, discuss, or ignore.

## AI-native access

- Expose the marketplace to agents through an MCP server or a dedicated API.
- Agents can discover repositories, read valuation data and terms, and start a transaction from code.

## Seller features

- Receive and evaluate offers.
- Secure and receive payment per the agreed contract.
- Authenticate that the buyer is real.
- See an estimated value for their repository.

## Buyer features and protections

- See repository value, code quality, maintenance lineage, and IP originality (original vs plagiarized).
- Get a verifiable cryptographic proof of ownership transfer.
- Update repo settings to restrict access to the new buyer and prevent further public forks.

## Repository valuation and quality

- Quality layers: static analysis (security, standards), automated testing (unit and integration), and dependency analysis (health and licenses).
- Community metrics: stars, forks, active contributors.
- Open-source value depends on adoption and ecosystem health. Closed or partly closed value depends on commercial viability, IP rights, and enterprise adoption.
- Tools like CodeRabbit, Snyk, or SonarQube can cover static analysis and vulnerability scanning. Custom integration is likely needed to feed those results into the marketplace.

## Overlay page contents (repo view)

- Owner information, to the detail available.
- Quality metrics the repo passed.
- Community engagement metrics.
- Licensing, ownership, and IP information, reviewed and analyzed.
- An estimated suggested dollar value.
- An asking price, or blank if none.
- A "Make an offer" function for human or agent buyers.
- A binding agreement applied if the owner accepts the offer.
- Legal and IP risk reports, an audit trail for the transfer, and a transition support plan for handover.

## Application design (high level)

- A core marketplace API plus an MCP server bridges GitHub repos and AI agents.
- A browser extension or embedded UI gives human users marketplace controls (set price and terms).
- The MCP server exposes endpoints for discovery, valuation data, and transaction initiation.
- Commerce flows through GitHub infrastructure. Legal and technical transfer steps are automated.

## Candidate services to consume

- Banking-as-a-Service for escrow accounts.
- DocuSign for signing agreements.
- Smart contracts on a blockchain.
- Stripe or other agentic commerce platforms for payment.
- Auth0 or similar for identity verification.
- CodeRabbit, Snyk, SonarQube for code quality and security.

## Cross-cutting requirements

- Regulatory compliance across jurisdictions.
- A reputation system for buyers and sellers.
- Escrow services that hold funds until milestones are met.
- Strict authentication protocols for AI agents.

## Open questions

1. Activation mechanism. Extension, embedded button, or URL change? Left open for later.
2. Offer enforcement. How do you stop an owner from going back on an accepted offer? The binding mechanism was raised but not defined.
3. Access control enforcement. The exact process to enforce new-owner-only access and block public forks is a to-do.
4. Valuation methodology. The method to turn metrics into a suggested dollar value is parked.
5. Agent authentication protocol. How agents prove identity and authorization is a requirement, not yet designed.
6. Smart contract vs digital signature. Both are noted. Which one is primary, and how they combine, is undecided.
7. IP originality / plagiarism detection. Named as a need. No method chosen.
8. Payment rail choice. Banking-as-a-Service vs Stripe vs blockchain escrow. Listed as options, not chosen.
9. Handling repos where the owner never joined the platform. Offer-based flow exists, but notification reliability and owner opt-in are not worked out.
10. Jurisdictional compliance. Flagged as important, no approach defined.
