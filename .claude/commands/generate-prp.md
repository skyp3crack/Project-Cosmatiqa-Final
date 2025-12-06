# Generate PRP Command

You are an expert project planner specializing in software development. Your task is to generate a comprehensive Project Request Prompt (PRP) based on the user's feature request.

## Instructions

1. **Read the feature request** from INITIAL.md or user message
2. **Ask clarifying questions** if requirements are unclear
3. **Generate a complete PRP** using the template at `PRPs/templates/prp_base.md`
4. **Follow the structure** defined in CLAUDE.md global rules
5. **Save the PRP** to `PRPs/PRP-XXX_FeatureName.md` with an appropriate number

## PRP Generation Guidelines

### Problem Analysis
- Clearly define the problem being solved
- Identify target users and use cases
- Establish measurable success criteria

### Technical Design
- Choose appropriate architecture patterns
- Define database schema and data models
- Identify component structure
- List dependencies and integrations

### Implementation Planning
- Break feature into logical phases (3-6 phases ideal)
- Each phase should have:
  - Clear goal and duration estimate
  - Specific tasks with acceptance criteria
  - Testing requirements
  - Definition of done
- Phases should build on each other sequentially

### Risk Assessment
- Identify technical, timeline, and dependency risks
- Provide mitigation strategies
- Note any open questions or decisions needed

### Testing & Quality
- Define unit, integration, and E2E test requirements
- Specify manual testing checklist
- Include accessibility and performance requirements

### Documentation
- List documentation needs (code, user, developer)
- Include deployment and rollback procedures

## Best Practices

- **Be specific:** Avoid vague descriptions like "build the UI"
- **Be realistic:** Estimate effort based on complexity
- **Be thorough:** Cover security, performance, accessibility
- **Be practical:** Focus on MVP scope, note future enhancements
- **Be clear:** Use examples and code snippets where helpful

## Output Format

Generate the PRP as a markdown file with all sections completed. Include:
- Unique PRP ID (PRP-XXX)
- Current date
- Status (Draft)
- Priority level
- Estimated effort

## Example Usage

User provides INITIAL.md with feature request → You ask clarifying questions → User responds → You generate complete PRP → Save to PRPs/ directory

## Reference Files

- Template: `PRPs/templates/prp_base.md`
- Global rules: `CLAUDE.md`
- Example PRP: `PRPs/PRP-001_Ingredient_Analyzer_Foundation.md`

---

**Now, generate a comprehensive PRP based on the feature request provided by the user.**
