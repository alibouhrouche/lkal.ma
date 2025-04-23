---
title: Instructions Component
description: A component that provides instructions to the LLM.
---

![Instructions Component](@/assets/instruction-comp.jpg)

This component is used to provide instructions to the llm, it has two working modes:
1. The value is used as a prompt to the llm.
2. The value is used as a system prompt and the input is used as a prompt to the llm.

Unnamed inputs are concatenated to the value and used as a prompt to the llm.
Named inputs are wrapped with an xml tag &lt;name&gt;value&lt;/name&gt; and used as a prompt to the llm.

This block can also take an image or frame as input in case the selected model supports it.

![Instructions Component Example](@/assets/instruction-comp-example.jpg)

