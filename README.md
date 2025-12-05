<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://i.imgur.com/lOkx9SB.png" />
</div>
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://i.imgur.com/HDxuaRg.png" />
</div>
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1e3eNS0MG39hLUU5nT6WfgB9561egXvFo

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# XeXTool: Advanced Xbox 360 Decompiler & Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-9bf00b.svg)](https://github.com/SleepTheGod/XeXTool)
[![Platform](https://img.shields.io/badge/Platform-Xbox_360-107C10.svg)]()

> **The ultimate development utility for converting and reverse-engineering Xbox 360 executables.**

**XeXTool** is a powerful web-based utility designed for Xbox 360 homebrew developers and reverse engineers. It serves two primary functions: converting binary `.XEX` files into embeddable C byte arrays and performing AI-assisted decompilation to reconstruct source code from compiled binaries.

---

## 🚀 Features

### 1. Binary to C Converter (Array Mode)
- **Embed executables directly into your source code.**
- Converts `.xex`, `.bin`, or `.rom` files into C/C++ header-ready byte arrays.
- Configurable output:
  - Custom variable naming.
  - Hex (`0xFF`) vs Decimal formatting.
  - Adjustable memory width (bytes per row).
  - `const` / `static` qualifiers.
  - Automatic size variable generation.

### 2. AI Decompiler (Decompile Mode)
- **World-First AI-Powered XEX Analysis.**
- Utilizes **Google Gemini 2.5 Flash** with extended thinking budget to analyze PowerPC (Xenon) machine code.
- **Features:**
  - **Header Analysis:** Automatically parses XEX2 headers, extracting Entry Points, Image Base, Title IDs, and Media IDs.
  - **Import Detection:** Scans for linked libraries (`xboxkrnl.exe`, `xam.xex`, `d3d9.dll`).
  - **Logic Reconstruction:** Attempts to reverse-engineer C logic from raw hex dumps and string artifacts.
  - **XDK Compliance:** Generates output using standard `<xtl.h>` types and Hungarian notation.

### 3. Xbox 360 Aesthetic
- Fully themed UI mimicking the Xbox 360 Dashboard and DevKit environment.
- Responsive, dark-mode interface built with Tailwind CSS.

---

## 🛠 Usage

### Online App
Access the tool locally or host it yourself.

1. **Upload File:** Drag and drop your `.xex` file onto the "LOAD EXECUTABLE" zone.
2. **Select Mode:**
   - **Byte Array:** For converting the file to a C header.
   - **Decompile:** For attempting to recover source code.
3. **Configure:** Adjust output settings in the `SYSTEM_CONFIG` panel.
4. **Export:** Click "COPY" or "SAVE" to get your code.

### Decompilation Note
The decompilation feature is **experimental**. It uses heuristic analysis and AI pattern matching. While it can accurately identify libraries, strings, and high-level structure, 100% accurate decompilation of encrypted or compressed XEX files is mathematically impossible without keys. This tool provides the *best possible reconstruction* based on available metadata.

---

## 📦 Installation (Local Development)

```bash
# Clone the repository
git clone https://github.com/SleepTheGod/XeXTool.git

# Navigate to directory
cd XeXTool

# Install dependencies
npm install

# Set up API Key
export API_KEY="your_google_gemini_api_key"

# Run development server
npm start
```

---

## 🔧 Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **AI Core:** Google Gemini 2.5 Flash (`@google/genai` SDK)
- **Binary Analysis:** Custom `XexParser` TypeScript engine
- **UI Icons:** Lucide React

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed by [SleepTheGod](https://github.com/SleepTheGod)**  
*Keep the 360 scene alive.*
