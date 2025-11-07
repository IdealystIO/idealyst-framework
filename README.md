# Idealyst Framework

A highly opinionated cross-platform framework that provides a unified development experience for Mobile and Web, built on React/React Native, and designed to be used with LLMs. Idealyst provides abstractions for **Styles**, **Components** and **Navigation**, which developers may have had difficulty maintaining across various platforms in the past. An MCP server to facilitate use with LLMs, providing key information about the framework's philosophy, and all of its functionality.

### Development Philosophy

Often, developers are stuck maintaining multiple client-side codebases. This is because the requirements of one platform differs from another. iOS and Android both have very different ways of navigating apps from what you would get on the web. iOS, Android, and Web apps are all written in completely different languages. Code resuse becomes a nightmare. Luckily, talented developers have been working on tackling this problem with tools such as Xamarin, React/React Native, Cordova, Flutter, and many more to help bridge the platform differences. Idealyst strives to continue bridging gaps between platforms by providing abstractions to Components and Navigation so that the developer can write code once and deploy everywhere, without having to maintain 2 code bases.

### AI Philosophy

As LLMs begin to play a much more important role in software development, their shortfalls become quickly apparent. Without good structure, LLMs are capable of producing functional results, but the underlying architecture is not well though out. LLMs often struggle to keep styles consistent, opting to user their own colors rather than a pallet. Some components are 1000+ lines of code long when they could be broken into more manageable chunks. LLMs fill their context windows generating long stylesheets, complex components that are not reusable, and as the complexity of the task increases, the output starts to suffer. This project aims to reduce the amount of thinking an LLM really needs to do, so it can focus on what we want it to do - focus on the app structure, business logic and API implementation.

## Installation

```bash
# Install globally
npm install -g @idealyst/cli
# or
yarn global add @idealyst/cli

# Or use directly with npx
npx @idealyst/cli init
```

## Quick Start

```bash
# Initialize a new workspace - includes database, api, mobile app, web app and shared structure.
idealyst init app-name
```
## 

