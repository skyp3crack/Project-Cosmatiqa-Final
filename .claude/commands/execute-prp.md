# Execute PRP Command

You are an expert full-stack developer. Your task is to implement features according to a Project Request Prompt (PRP).

## Instructions

1. **Read the specified PRP** from the PRPs/ directory
2. **Understand the current phase** and its tasks
3. **Implement tasks sequentially** following acceptance criteria
4. **Test as you go** according to testing requirements
5. **Update the PRP** with progress and mark tasks complete
6. **Communicate clearly** about what you're doing and why

## Execution Guidelines

### Phase-by-Phase Approach
- Start with Phase 1, complete all tasks before moving to Phase 2
- Don't skip phases unless explicitly instructed
- Mark tasks as complete only when acceptance criteria are met
- Update "Progress Tracking" section regularly

### Task Execution
For each task:
1. **Announce** what you're about to implement
2. **Show** the code you're writing with clear comments
3. **Explain** key decisions or trade-offs
4. **Test** the implementation
5. **Mark complete** in the PRP and TodoWrite tool

### Code Quality Standards
Follow CLAUDE.md guidelines:
- Write clean, readable, maintainable code
- Use TypeScript with strict typing
- Implement error handling and loading states
- Add meaningful comments for complex logic
- Follow naming conventions

### Testing Requirements
- Run unit tests after implementing core logic
- Verify integration points work correctly
- Test edge cases and error scenarios
- Confirm acceptance criteria are met

### Communication
- Be transparent about progress
- Ask questions if requirements are unclear
- Warn about potential issues or blockers
- Suggest improvements when beneficial

## Workflow

1. **Start Phase**
   - Read phase goal and tasks
   - Identify dependencies
   - Plan implementation order

2. **Implement Tasks**
   - One task at a time
   - Write code following best practices
   - Test immediately after writing
   - Update PRP checkboxes

3. **Complete Phase**
   - Verify all acceptance criteria met
   - Run phase testing requirements
   - Check definition of done
   - Move to next phase

4. **Handle Blockers**
   - Document blocker in PRP
   - Suggest mitigation strategies
   - Ask user for guidance if needed

## Code Implementation Patterns

### Convex Functions
```typescript
// Query (read data)
export const getRoutine = query({
  args: { routineId: v.id("routines") },
  handler: async (ctx, { routineId }) => {
    // Validate, fetch, return
  },
});

// Mutation (write data)
export const saveRoutine = mutation({
  args: { name: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    // Validate, insert/update, return ID
  },
});

// Action (external API calls)
export const analyzeWithAI = action({
  args: { ingredientA: v.string(), ingredientB: v.string() },
  handler: async (ctx, args) => {
    // Call external API, process, cache, return
  },
});
```

### React Components
```jsx
export function FeatureComponent({ data, onAction }) {
  // State
  const [state, setState] = useState(initialValue);

  // Convex hooks
  const convexData = useQuery(api.module.queryName, { args });
  const mutateFn = useMutation(api.module.mutationName);

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Handlers
  const handleAction = async () => {
    try {
      await mutateFn({ args });
      onAction(result);
    } catch (error) {
      console.error(error);
      // Show user-friendly error
    }
  };

  // Render
  if (!convexData) return <LoadingSpinner />;

  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

### Error Handling
```typescript
// Backend
try {
  const result = await processData(input);
  return { success: true, data: result };
} catch (error) {
  console.error("Processing failed:", error);
  throw new ConvexError({
    code: "PROCESSING_FAILED",
    message: "User-friendly message"
  });
}

// Frontend
const { data, error, isLoading } = useQuery(api.module.query);

if (error) {
  return <ErrorCard message="Something went wrong. Please try again." />;
}
```

## Progress Tracking

Use TodoWrite tool to track tasks:
```javascript
TodoWrite({
  todos: [
    { content: "Implement feature X", status: "in_progress", activeForm: "Implementing feature X" },
    { content: "Write tests for X", status: "pending", activeForm: "Writing tests for X" },
    { content: "Deploy to production", status: "pending", activeForm: "Deploying to production" }
  ]
});
```

## PRP Updates

After completing tasks, update the PRP file:
- Mark checkboxes as [x] done
- Add notes in "Progress Tracking"
- Document learnings in "Learnings & Retrospective"
- Update "Last Updated" timestamp

## Definition of Done

Before marking a phase complete:
- [ ] All tasks implemented
- [ ] Acceptance criteria met
- [ ] Tests written and passing
- [ ] Code reviewed (self-review checklist)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] PRP file updated

## Example Execution Flow

```
User: Execute PRP-001, start with Phase 1

You: I'll execute PRP-001: Ingredient Analyzer Foundation, Phase 1 (Project Setup).

[Create todos]
[Implement Task 1.1: Initialize React + Vite]
[Show code]
[Run tests]
[Mark complete]
[Move to Task 1.2]
...
[Complete Phase 1]

Phase 1 complete! All tasks done, tests passing. Ready for Phase 2.
```

## Reference Files

- PRPs: `PRPs/PRP-XXX_FeatureName.md`
- Global rules: `CLAUDE.md`
- Template: `PRPs/templates/prp_base.md`

---

**Now, execute the PRP specified by the user, starting from the appropriate phase.**
