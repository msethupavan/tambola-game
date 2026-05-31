# Contributing to Tambola Game

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Tambola Game. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 📋 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## 🚀 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the [issue list](https://github.com/msethupavan/tambola-game/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**
* **Include your environment details** (OS, browser, Node.js version, etc.)

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as [GitHub issues](https://github.com/msethupavan/tambola-game/issues). When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Explain why this enhancement would be useful**
* **List some other applications where this enhancement exists, if applicable**

### Pull Requests 📝

* Follow the TypeScript and CSS styleguides
* Follow the conventional commits pattern for commit messages
* Include appropriate test cases
* Update documentation as needed
* End all files with a newline
* Avoid platform-specific code

## 📝 Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification

Examples:
```
feat: add auto-call feature for number calling
fix: resolve room code case sensitivity issue
docs: update README with new setup instructions
refactor: improve ticket generation algorithm
style: format CSS with proper indentation
test: add unit tests for pattern validation
chore: update dependencies
```

### TypeScript Style Guide

* Use `const` for variables that don't change
* Use `let` for variables that do change (avoid `var`)
* Use meaningful variable names
* Add JSDoc comments for functions and classes
* Use arrow functions where appropriate
* Follow Angular style guide conventions

Example:
```typescript
/**
 * Validates a Tambola pattern claim
 * @param ticket - The player's ticket
 * @param calledNumbers - Numbers that have been called
 * @param pattern - The pattern being claimed
 * @returns true if the claim is valid, false otherwise
 */
validateClaim(ticket: number[][], calledNumbers: number[], pattern: string): boolean {
  // Implementation
}
```

### CSS Style Guide

* Use CSS variables for colors and sizing
* Group related properties together
* Use meaningful class names (BEM methodology)
* Add comments for complex sections
* Include mobile-first responsive design

Example:
```css
/* Button primary style */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 14px 28px;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: var(--transition);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}
```

### HTML/Template Style Guide

* Use semantic HTML
* Keep templates clean and readable
* Use Angular directives properly (*ngIf, *ngFor, etc.)
* Avoid inline styles (use CSS classes)
* Add aria labels for accessibility

## 🔍 Testing

Before submitting a PR, please test your changes:

1. **Manual Testing**: Test the feature in both host and player modes
2. **Mobile Testing**: Test on mobile devices if the change affects UI
3. **Multi-player Testing**: Test with multiple players if applicable
4. **Edge Cases**: Test with edge cases (empty inputs, max players, etc.)

## 📦 Development Setup

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/msethupavan/tambole-game.git
cd tambole-game

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Running Locally

```bash
# Terminal 1: Frontend (dev server with hot reload)
cd frontend
ng serve --open

# Terminal 2: Backend
cd backend
npm run dev
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Backend serves the built frontend
cd ../backend
npm start
```

## 📚 Documentation

When contributing code changes, please update the relevant documentation:

* **Code Comments**: Explain complex logic with comments
* **JSDoc**: Add JSDoc comments to functions
* **README**: Update if adding new features
* **DEVELOPMENT.md**: Update architecture docs if making structural changes
* **QUICKSTART.md**: Update if changing setup process

## ✅ PR Checklist

Before submitting a Pull Request, please ensure:

- [ ] I have read the Contributing Guidelines
- [ ] I have followed the style guides
- [ ] I have updated documentation as needed
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly
- [ ] I have added comments to explain complex logic
- [ ] I have verified mobile responsiveness
- [ ] My commit messages follow the style guide

## 🎯 Development Priorities

We prioritize contributions in this order:

1. **Bug Fixes**: Critical issues affecting functionality
2. **Performance**: Improvements to speed and efficiency
3. **Accessibility**: Making the game accessible to all users
4. **User Experience**: Improving UI/UX and responsiveness
5. **New Features**: New game features or enhancements
6. **Documentation**: Improving existing documentation

## 📞 Questions?

Feel free to open an issue with the `question` label if you have questions about the project.

## 🙏 Thank You!

Your contributions are greatly appreciated! Whether you're fixing a bug, improving documentation, or adding a new feature, you're helping make Tambola Game better for everyone.

Happy coding! 🚀
