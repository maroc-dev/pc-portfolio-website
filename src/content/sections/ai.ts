import { photoSlot } from "../photos";
import type { AiSection } from "../types";

/*
 * Written from Marco's notes and résumé (November 2026). Every fact is his; flows describe what
 * each system does, not internal details. The network diagram sample is made-up data.
 */
export const ai: AiSection = {
  kind: "ai",
  professional: {
    intro: [
      "Artificial intelligence is what I specialize in as a software engineer. I've been building with large language models since they first took off, and today most of my work is the infrastructure that lets agents do real jobs securely.",
      "Open any project to see how it works.",
    ],
    projects: [
      {
        id: "network-diagrams",
        name: "Network diagram generator",
        org: "AT&T Labs",
        summary:
          "Turns a prompt or a router configuration into a network diagram. Built for Cisco and Juniper routers and networks.",
        points: [
          "Built for Cisco and Juniper routers and networks: it reads their configurations, or a plain-language prompt, and draws the topology.",
          "Produces editable Draw.io diagrams with both Layer 2 and Layer 3 connections, and now handles more than 100 nodes.",
          "Started as my internship project, and getting it right meant working closely with network engineers.",
          "Generated thousands of diagrams to fine-tune a multimodal model to read network diagrams better, and made the diagram workflow about 500% more efficient.",
        ],
        stack: ["LLMs", "Agentic workflow", "Draw.io"],
        flow: [
          {
            label: "Prompt or config",
            detail: "A plain-language request, or Cisco and Juniper configs",
          },
          {
            label: "Agentic workflow",
            detail: "An LLM works out the devices, interfaces and links",
          },
          { label: "Topology", detail: "Nodes with Layer 2 and Layer 3 connections" },
          { label: "Draw.io diagram", detail: "Editable, more than 100 nodes" },
          { label: "Training data", detail: "Thousands of diagrams for a multimodal model" },
        ],
        sample: "network-diagram",
      },
      {
        id: "agent-platform",
        name: "Agent platform and registry",
        org: "HCLTech at AT&T Labs",
        summary:
          "Lets people create their own agents, and lets agents find each other and work together.",
        points: [
          "People create their own personalized agents, and the platform runs them across a distributed system built to scale.",
          "Agents register themselves, collaborate, and respond to people's tasks on their own, talking to each other over A2A (agent-to-agent) communication.",
          "A registry of MCP servers and skills gives them more than 10,000 skills to work with.",
        ],
        stack: ["A2A", "MCP", "Distributed systems"],
        flow: [
          { label: "Person", detail: "Creates a personalized agent" },
          { label: "Agent registry", detail: "Agents register and find each other" },
          { label: "Skills registry", detail: "More than 10,000 skills and MCP servers" },
          { label: "A2A collaboration", detail: "Agents hand work to each other" },
          { label: "Task done", detail: "The result comes back to the person" },
        ],
      },
      {
        id: "mcp-gateway",
        name: "MCP gateway",
        org: "HCLTech at AT&T Labs",
        summary: "One secure front door for MCP servers, with sign-in, telemetry and sharing.",
        points: [
          "Signs people in with OAuth and collects telemetry on the traffic that passes through.",
          "People can share their MCP servers with each other.",
          "Turns existing REST APIs into new, custom MCP servers.",
        ],
        stack: ["MCP", "OAuth", "Telemetry"],
        flow: [
          { label: "Agent or app", detail: "Calls a tool" },
          { label: "MCP gateway", detail: "OAuth sign-in and telemetry" },
          { label: "MCP servers", detail: "Shared by their owners, or generated from REST APIs" },
          { label: "Result", detail: "Returned to the caller" },
        ],
      },
      {
        id: "agent-gateway",
        name: "Agent gateway",
        org: "HCLTech at AT&T Labs",
        summary: "Secures every agent, and shows who uses it and what it costs.",
        points: [
          "Secures every agent with OAuth.",
          "Collects telemetry on agent activity: who is using each agent, and what it costs.",
          "Lets people share their agents, for a large number of users.",
        ],
        stack: ["OAuth", "Telemetry", "Cost tracking"],
        flow: [
          { label: "Person", detail: "Asks an agent for help" },
          { label: "Agent gateway", detail: "OAuth, usage and cost tracking" },
          { label: "Agent", detail: "Their own, or one shared with them" },
          { label: "Telemetry", detail: "Activity, users and cost" },
        ],
      },
      {
        id: "multimodal-search",
        name: "Multimodal AI platform",
        org: "Externetworks at AT&T Labs",
        summary: "Analyzes video, images and audio, and makes them searchable across the company.",
        points: [
          "A scalable full-stack platform for analyzing and understanding videos, images and audio.",
          "Integrated ImageBind and Weaviate for company-wide retrieval and vector search.",
        ],
        stack: ["React", "FastAPI", "Node.js", "PyTorch", "Transformers", "ImageBind", "Weaviate"],
        flow: [
          { label: "Media", detail: "Videos, images and audio" },
          { label: "ImageBind", detail: "Embeds every kind of media" },
          { label: "Weaviate", detail: "Vector search across the company" },
          { label: "React app", detail: "Search and analysis, through FastAPI" },
        ],
      },
      {
        id: "accessibility-app",
        name: "Camera assistant for accessibility",
        org: "Externetworks at AT&T Labs",
        summary:
          "A real-time Android app for disabled people: point the camera, then chat and ask.",
        points: [
          "A real-time Android app that lets disabled people chat and ask questions about what their camera sees.",
          "React Native on the phone, with FastAPI, Transformers and PyTorch behind it.",
        ],
        stack: ["React Native", "FastAPI", "Transformers", "PyTorch"],
        flow: [
          { label: "Camera", detail: "What the person is looking at" },
          { label: "Android app", detail: "A question, by chat" },
          { label: "FastAPI", detail: "Runs the models" },
          { label: "Answer", detail: "In real time" },
        ],
      },
      {
        id: "jbmdl-assistant",
        name: "Private assistant for Joint Base McGuire-Dix-Lakehurst",
        org: "Ocean County College",
        summary:
          "A completely private assistant that answers from more than 1,000 PDFs of manuals and regulations, and cites its sources.",
        points: [
          "Led a team of five developers building it for the base.",
          "Understands text and voice, with web search, PDF querying and table extraction.",
          "LlamaIndex and PostgreSQL search more than 10,000 pages and cite where each answer came from.",
          "Runs locally, so it stays completely private.",
          "The work grew into a continuing relationship between the college and the base.",
        ],
        stack: ["FastAPI", "Streamlit", "LlamaIndex", "PostgreSQL", "Speech-to-text"],
        flow: [
          { label: "Question", detail: "Typed or spoken" },
          { label: "Speech-to-text", detail: "For spoken questions" },
          { label: "Retrieval", detail: "LlamaIndex over PostgreSQL" },
          { label: "Local model", detail: "Answers privately" },
          { label: "Cited answer", detail: "Plus web search when needed" },
        ],
      },
    ],
  },
  personal: {
    intro: [
      "Outside work, I test local models on my own computers to see what they can do.",
      "It started on a GTX 1080 system running a quantized Mistral 7B. Now an RTX 5080 system handles far more capable models, so I can run RAG and experiment with speech-to-text and text-to-speech models too.",
    ],
    rigs: [
      {
        name: "The GTX 1080 system",
        detail: "Where it started: Mistral 7B, quantized.",
        photo: photoSlot("My GTX 1080 system"),
      },
      {
        name: "The RTX 5080 system",
        detail: "Bigger models, RAG, and speech-to-text and text-to-speech experiments.",
        photo: photoSlot("My RTX 5080 system"),
      },
    ],
  },
  placeholder: false,
};
