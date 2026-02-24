import type { ComponentScenario } from "../types.js";

export const noContextAudioScenario: ComponentScenario = {
  type: "component",
  id: "no-context-audio",
  name: "No-Context Audio Recording",
  description:
    "Tests a no-context agent discovering the microphone package and building an audio recorder",
  systemPrompt: `You are a React developer. You have access to MCP tools that provide documentation about a component framework. Use them to discover what is available.`,
  taskPrompt: `Build a cross-platform audio recording screen. The user should be able to:
- Start/stop recording with a button
- See recording duration while recording
- Play back the last recording
- Save recordings to local storage

Use any available framework components and packages.`,
  expectedToolUsage: [
    "search_packages",
    "get_package_docs",
    "list_components",
    "get_component_docs",
  ],
  expectedOutputPatterns: [
    /@idealyst\/microphone|@idealyst\/audio/,
    /Button/,
    /record|Record/i,
  ],
  expectedFiles: {
    "AudioRecorder.tsx":
      "Audio recording screen with record, playback, and save functionality",
  },
  maxTurns: 50,
  difficulty: "advanced",
  tags: ["no-context", "packages", "audio", "cross-platform"],
};
