# Outline Example

Below is an example outline for a Python tutorial video. Use this as a reference when creating your own outline in `WORKSPACE/outline.md`.

Each page description should specify:
- **Layout type** (from `references/design-guide.md`): title page, section with accent bar, two-column (main+side / equal split), timeline, checklist, full-width card, chart+insight, continue page
- **Components used** (from `references/components.md`): Text, Cardbox, Anim, Mermaid, BarChart, Markdown, etc.

**Vary layouts across pages** — avoid long text blocks in every page. A chapter full of nothing but text cards is monotonous to watch.

```markdown
# Python Tutorial Outline

## Chapter 1: Introduction to Python
  - Description: This chapter introduces Python and sets up the development environment. Uses indigo as brand color.
 
  - Page 1: What is Python?
    - Layout: Title page
    - Components: radial-gradient bg, Cardbox bordered (badge), Anim (scale-in accent line, slide-up h1, fade-in h3)
    - Description: Centered gradient title page with "Chapter 01" badge, accent line, h1 "Introduction to Python", h3 subtitle "Getting started with the language".

  - Page 2: Why Python is popular?
    - Layout: Chart + insight card (two-column, centered)
    - Components: accent bar (brand.primary), Cardbox elevated (chart), BarChart, Cardbox bordered (insight)
    - Description: Bar chart comparing Python's popularity against other languages. Right-side insight card highlights Python's growth rate and community size.

  - Page 3: Setting up Python — Anaconda
    - Layout: Timeline / process flow (3 horizontal steps)
    - Components: accent bar (brand.primary), Cardbox default (step), Cardbox bordered (step badge)
    - Description: Three steps side by side: Download Anaconda → Install → Verify. Each step card has a numbered badge, title, and description.

  - Page 4: Setting up Python — Jupyter Notebook
    - Layout: Section with accent bar + checklist
    - Components: accent bar (brand.primary), Cardbox default (list items), inline SVG icons
    - Description: Three checklist items: Launch Jupyter → Create notebook → Run first cell. Each has an icon, title, and description. Wide cards at x=260 w=1400.

## Chapter 2: Python Basics — Variables and Data Types
  - Description: Covers variables, basic data types, and operations. Uses cyan as brand color.

  - Page 1: Variables and Data Types
    - Layout: Title page
    - Components: radial-gradient bg (brand.secondary), Cardbox bordered (badge), Anim accent line
    - Description: Title page with "Chapter 02" badge and gradient.

  - Page 2: Numbers and Strings
    - Layout: Two-column equal split
    - Components: accent bar (brand.secondary), Cardbox default (two columns)
    - Description: Left card shows number operations (integers, floats, arithmetic). Right card shows string operations (concatenation, slicing, methods). Side-by-side comparison.

  - Page 3: Lists, Tuples, and Dictionaries
    - Layout: Full-width card with Markdown
    - Components: accent bar (brand.secondary), Cardbox default, Markdown
    - Description: Full-width card containing a markdown table comparing list, tuple, and dict with examples. Include a code block with syntax highlighting.

## Chapter 3: Control Flow and Functions
  - Description: Covers conditionals, loops, and functions. Uses amber as brand color.

  - Page 1: Control Flow
    - Layout: Title page
    - Components: radial-gradient bg (brand.accent), Cardbox bordered (badge)

  - Page 2: Conditional Statements
    - Layout: Section with accent bar + Mermaid flowchart
    - Components: accent bar (brand.accent), Cardbox default, Mermaid (flowchart)
    - Description: Full-width card containing a Mermaid flowchart showing if/elif/else branching logic.

  - Page 3: Loops
    - Layout: Section with accent bar + two-column (main + side)
    - Components: accent bar (brand.accent), Cardbox default (main), Cardbox bordered (side)
    - Description: Main card explains for and while loops with code examples via Markdown. Side card summarizes key differences in a table.

  - Page 4: Functions
    - Layout: Continue page (no title/accent bar, content starts at y=80)
    - Components: Cardbox default, Markdown (code blocks)
    - Description: Full-width card showing function definition examples with syntax-highlighted code blocks via Markdown. Continue page — no title since it follows the previous page.

## Chapter 4: Data Structures and Libraries
  - Description: Covers advanced data structures and popular Python libraries. Uses indigo (brand.primary, cycling).

  - Page 1: Advanced Python
    - Layout: Title page

  - Page 2: NumPy Basics
    - Layout: Section with accent bar + two-column equal split
    - Components: accent bar (brand.primary), Cardbox default, Markdown
    - Description: Left card shows NumPy array creation with code examples. Right card shows array operations. Syntax-highlighted code via Markdown.

  - Page 3: Pandas Overview
    - Layout: Section with accent bar + timeline (3 horizontal steps)
    - Components: accent bar (brand.primary), Cardbox default (step), Cardbox bordered (badge)
    - Description: Three steps: Load CSV → Clean data → Analyze. Each step has a numbered badge, title, and brief description of the operation.

  - Page 4: Data Visualization with Matplotlib
    - Layout: Chart + insight card
    - Components: accent bar (brand.primary), Cardbox elevated (chart), LineChart, Cardbox bordered (insight)
    - Description: Line chart showing a sample data series. Right insight card explains the key plotting functions used.

  - Page 5: Real-World Example
    - Layout: Continue page (no title)
    - Components: Mermaid (sequence diagram), Cardbox default
    - Description: A sequence diagram showing a data pipeline: CSV → Pandas → Matplotlib → Report. Left column has the diagram, right column has explanatory notes.

## Chapter 5: Conclusion
  - Description: Wraps up the course with a summary and next steps. Uses cyan (brand.secondary, cycling).

  - Page 1: Course Wrap-Up
    - Layout: Title page

  - Page 2: Key Takeaways
    - Layout: Section with accent bar + checklist
    - Components: accent bar (brand.secondary), Cardbox default, inline SVG icons
    - Description: Four checklist items summarizing the course: Python syntax, data structures, control flow, and libraries. Each card has a checkmark icon and description.

  - Page 3: Next Steps
    - Layout: Full-width card with citation
    - Components: Cardbox default, Text citation
    - Description: Full-width card with recommended next steps and resources. Includes a citation at the bottom-right corner crediting the course materials.
```
