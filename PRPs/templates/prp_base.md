# PRP Template: [Feature Name]

**PRP ID:** PRP-[NUMBER]
**Created:** [DATE]
**Status:** [Draft | In Progress | Completed | Blocked]
**Priority:** [Critical | High | Medium | Low]
**Estimated Effort:** [Hours/Days]

---

## 1. Feature Overview

### Problem Statement
[Describe the problem this feature solves in 2-3 sentences]

### User Story
**As a** [type of user]
**I want** [goal/desire]
**So that** [benefit/value]

### Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

### Scope
**In Scope:**
- [What will be included]
- [What will be implemented]

**Out of Scope:**
- [What won't be included in this iteration]
- [Future considerations]

---

## 2. Technical Design

### Architecture Overview
```
[High-level architecture diagram or description]

Example:
Frontend (React) → Convex Functions → Database
                 ↓
              Claude AI API
```

### Tech Stack
- **Frontend:** [Technologies used]
- **Backend:** [Technologies used]
- **Database:** [Tables/schemas involved]
- **External APIs:** [Third-party services]

### Data Models

#### Database Schema
```typescript
// New tables or modifications
export const [tableName] = defineTable({
  field1: v.string(),
  field2: v.number(),
  // ...
}).index("by_field", ["field"]);
```

#### API Interfaces
```typescript
// Request/Response types
interface [RequestType] {
  // ...
}

interface [ResponseType] {
  // ...
}
```

### Component Architecture
```
src/
├── components/
│   ├── [FeatureName]/
│   │   ├── [MainComponent].jsx
│   │   ├── [SubComponent].jsx
│   │   └── index.js
├── hooks/
│   └── use[FeatureName].js
├── pages/
│   └── [FeaturePage].jsx
└── utils/
    └── [feature-helpers].js
```

---

## 3. Implementation Phases

### Phase 1: [Phase Name]
**Goal:** [What this phase achieves]
**Duration:** [Estimated time]

#### Tasks
- [ ] **Task 1.1:** [Description]
  - File: `[file path]`
  - Dependencies: [None | Other tasks]
  - Acceptance Criteria:
    - [ ] [Specific outcome]
    - [ ] [Specific outcome]

- [ ] **Task 1.2:** [Description]
  - File: `[file path]`
  - Dependencies: [Task 1.1]
  - Acceptance Criteria:
    - [ ] [Specific outcome]

#### Testing
- [ ] Unit tests for [component/function]
- [ ] Integration test for [workflow]

#### Definition of Done
- [ ] All tasks completed
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Documentation updated

---

### Phase 2: [Phase Name]
**Goal:** [What this phase achieves]
**Duration:** [Estimated time]

#### Tasks
- [ ] **Task 2.1:** [Description]
  - File: `[file path]`
  - Dependencies: [Phase 1 complete]
  - Acceptance Criteria:
    - [ ] [Specific outcome]

[Repeat task structure]

#### Testing
[Test requirements]

#### Definition of Done
[Completion criteria]

---

### Phase 3: [Phase Name]
[Repeat phase structure]

---

## 4. Dependencies & Integrations

### Internal Dependencies
- [ ] [Component/feature that must exist first]
- [ ] [Database table/schema required]

### External Dependencies
- [ ] [Third-party API credentials]
- [ ] [External service setup]

### Environment Variables
```env
# New variables required
NEW_API_KEY=
NEW_CONFIG_VALUE=
```

---

## 5. Testing Strategy

### Unit Tests
**Files to test:**
- `[file path]`: [What to test]
- `[file path]`: [What to test]

**Test cases:**
```javascript
describe('[Feature]', () => {
  it('should [expected behavior]', () => {
    // Test implementation
  });

  it('should handle [edge case]', () => {
    // Test implementation
  });
});
```

### Integration Tests
**Workflows to test:**
- [ ] [User flow 1]: [Expected outcome]
- [ ] [User flow 2]: [Expected outcome]

### E2E Tests
**Critical paths:**
- [ ] [Complete user journey]
- [ ] [Error scenario]

### Manual Testing Checklist
- [ ] Desktop browser (Chrome, Firefox, Safari)
- [ ] Mobile browser (iOS Safari, Chrome)
- [ ] Tablet responsiveness
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

---

## 6. Security & Performance

### Security Considerations
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] Sensitive data encrypted
- [ ] Rate limiting applied
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention (if applicable)

### Performance Considerations
- [ ] Database queries optimized with indexes
- [ ] API responses cached (if applicable)
- [ ] Lazy loading implemented (if applicable)
- [ ] Bundle size checked
- [ ] Performance budget met: [< X ms load time]

### Monitoring & Observability
- [ ] Error tracking configured
- [ ] Performance metrics tracked
- [ ] User analytics events added

---

## 7. User Experience

### UI/UX Design
**Mockups/References:**
- [Link to Figma/Mobbin designs]
- [Screenshot or description]

**Interaction Patterns:**
- [How users interact with the feature]
- [Loading states]
- [Error states]
- [Empty states]

### Accessibility Requirements
- [ ] ARIA labels added
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

### Responsive Design Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

---

## 8. Documentation

### Code Documentation
- [ ] JSDoc comments for complex functions
- [ ] README updated with new setup steps
- [ ] API documentation updated

### User Documentation
- [ ] Feature guide written
- [ ] Tutorial/walkthrough created (if needed)
- [ ] FAQ updated

### Developer Documentation
- [ ] Architecture decision record (ADR) created
- [ ] Migration guide (if breaking changes)

---

## 9. Deployment Plan

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations ready (if applicable)
- [ ] Rollback plan documented

### Deployment Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Post-Deployment Verification
- [ ] Feature works in production
- [ ] No errors in logs
- [ ] Performance metrics normal
- [ ] User feedback collected

### Rollback Procedure
If issues arise:
1. [Rollback step 1]
2. [Rollback step 2]

---

## 10. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk description] | High/Med/Low | High/Med/Low | [How to prevent/handle] |
| [Risk description] | High/Med/Low | High/Med/Low | [How to prevent/handle] |

---

## 11. Open Questions

- [ ] **Q:** [Question about implementation]
  - **A:** [Answer or status: Pending/Resolved]

- [ ] **Q:** [Question about requirements]
  - **A:** [Answer or status: Pending/Resolved]

---

## 12. Progress Tracking

### Sprint 1 (Week X-Y)
- [x] ~~Task completed~~
- [x] ~~Task completed~~
- [ ] Task in progress

### Sprint 2 (Week X-Y)
- [ ] Pending task
- [ ] Pending task

### Blockers
- [Current blocker description] - Status: [Active | Resolved]

---

## 13. Learnings & Retrospective

### What Went Well
- [Positive outcome]

### What Could Be Improved
- [Area for improvement]

### Action Items
- [ ] [Follow-up task]
- [ ] [Process improvement]

---

## 14. References

- [Link to design docs]
- [Link to API documentation]
- [Related PRPs]
- [External resources]

---

**Last Updated:** [DATE]
**Updated By:** [NAME/AI]
