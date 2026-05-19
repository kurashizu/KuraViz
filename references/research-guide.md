# Research Guide

## Step 1: Conduct Web Search

### 1. Understand the Goal First

Before searching, do NOT directly query keywords.

You must first transform the user request into:

* **Topic**: what the content is about
* **Angle**: explanation, comparison, tutorial, deep dive
* **Format**: blog, lecture, slides, documentation
* **Depth**: beginner / intermediate / advanced

Bad:
```text
"search nextjs video"
```

Good:
```text
nextjs architecture explained beginner tutorial blog slides
```

### 2. Use High-Information Keywords

Prefer keywords that lead to educational or structured content:

Core keywords:
* explained
* overview
* tutorial
* guide
* deep dive
* fundamentals
* how it works
* architecture

Comparison keywords:
* vs
* comparison
* tradeoffs

Academic/material keywords:
* lecture
* slides
* notes
* pdf
* course

### 3. Convert Topics into Search Queries

Example 1: Web Framework

User goal: “Explain Next.js”

Generate:
```text
nextjs architecture explained
nextjs app router deep dive
nextjs server components tutorial
nextjs rendering model how it works
```

Example 2: Networking

User goal: “Explain HTTP”

Generate:
```text
http protocol how it works lecture
http request response model explained
tcp vs udp comparison guide
http fundamentals pdf
```

### 4. Use Search Operators When Possible

Improve precision using:

* `site:`
* `filetype:`
* `intitle:`

Examples:
```text
site:edu distributed systems lecture
filetype:pdf machine learning notes
intitle:architecture react internals
```

### 5. Prefer High-Density Sources

Prioritize:

* University lectures (.edu)
* Technical blogs (engineering blogs)
* Documentation sites
* PDF slides / course notes
* Developer platforms (e.g., dev.to, medium)

A good search query should look like:

```text
[topic] + (architecture | explained | deep dive | tutorial | lecture | pdf) + (comparison / how it works)
```

Once you have a refined search query, use `mmx search web "QUERY STRING"` to find relevant information on the web. Replace "QUERY STRING" with your refined search query. This will return URLs that are likely to contain high-quality, educational content related to the topic you are researching.

## Step 2: Convert URLs to Markdown

After obtaining URLs from the web search, convert them into markdown by using `curl https://r.jina.ai/URL -o /path/to/output.md` where `URL` is the link you want to convert. If failed, you should invoke subagents to fetch the content and convert URLs to markdown as this saves your context.

Example:
```bash
curl https://r.jina.ai/https://www.example.com/article -o WORKSPACE/sources/article.md
```

This command will fetch the content of the URL and save it as a markdown file in the specified path. Convert all URLs iteratively (1 at a time) to build a collection of markdown files that contain the information you need for your research. After converting, check the markdown files for relevance and quality, you may repeat the search and conversion process if necessary to gather more or better information.
