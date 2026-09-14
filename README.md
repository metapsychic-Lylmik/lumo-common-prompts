# Lumo Common Prompts

> **Stop retyping the same instructions.** Adds a one-click prompt library to Lumo — 26 curated prompts for writing, analysis, research, coding, and learning.

A browser userscript that adds a **"Common Prompts"** button to Lumo conversations. Instead of retyping the same instructions, click a button and select a pre-written prompt.

The script operates at the webpage level, after the browser has handled its normal communication with Lumo. It does not interfere with the encryption used for that communication.

The complete source code is available in this repository, so you can inspect exactly what the script does before installing it.

---

## 📋 Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Browser and Platform Compatibility](#browser-and-platform-compatibility)
- [Recommended Userscript Manager](#recommended-userscript-manager)
- [Installing the Script](#installing-the-script)
- [Usage](#usage)
- [Limitations](#limitations)
- [Disclaimer](#disclaimer)
- [Privacy and Security](#privacy-and-security)
- [How It Works](#how-it-works)
- [Overall Risk](#overall-risk)
- [Version History](#version-history)
- [License](#license)

---

## Features

**26 curated prompts** organized into five categories:

| Category | Count | Includes |
|----------|-------|----------|
| ✍️ **Writing** | 6 | Improve Writing, Make Concise, Proofread, Summarize, Email Draft, Translate & Localize |
| 🔍 **Analysis** | 7 | Critical Analysis, Check Assumptions, Fact vs. Inference, Find Weaknesses, Steelman, Challenge My Thinking, Context Handoff |
| 📚 **Research** | 5 | Evidence Quality, Alternative Explanations, Research Plan, What Would Change It?, Plan a Trip |
| 💻 **Coding** | 5 | Explain Code, Find Bugs, Improve Code, Security Review, Minimal Change |
| 🎓 **Learning** | 3 | Study Notes, Explain Concept, Quiz Me |

**Highlights:**

- 🔄 **Context Handoff** — generates a self-contained summary of any conversation for clean handoffs to new chats
- ⚡ **One-click insertion** — prompts are placed at the top of your message box, preserving any existing text
- 🌙 **Dark theme menu** that matches Lumo's interface
- 📐 **Viewport-aware positioning** — menu opens above or below the button depending on available screen space
- ♻️ **Survives UI reloads** — the button is automatically restored when Lumo rebuilds the composer
- 🔒 **Zero external dependencies** — runs entirely in your browser

---

## Requirements

- A web browser with userscript support (see [compatibility](#browser-and-platform-compatibility))
- A userscript manager installed (see [recommendations](#recommended-userscript-manager))
- Access to [lumo.proton.me](https://lumo.proton.me) with a valid Proton account

---

## Browser and Platform Compatibility

| Browser | Compatible | Notes |
|---------|:----------:|-------|
| Chrome | ✅ Yes | Requires userscript manager extension |
| Edge | ✅ Yes | Requires userscript manager extension |
| Firefox | ✅ Yes | Violentmonkey, Tampermonkey, or Greasemonkey |
| Safari | ✅ Yes | Requires userscript manager extension |
| Brave | ✅ Yes | Requires userscript manager extension |
| Opera | ✅ Yes | Requires userscript manager extension |
| Mobile browsers | ❌ No | Lumo mobile apps do not support userscripts |

> Userscripts operate at the browser level, not the operating system level. Any browser that supports userscript managers can run this script.

---

## Recommended Userscript Manager

### Violentmonkey (Recommended)

- **Open-source** and actively maintained
- **No telemetry** or analytics
- **Cross-browser** compatibility
- **Lightweight** footprint

*Alternatives: Tampermonkey and Greasemonkey also work well.*

### Installing Violentmonkey

1. Go to the [Violentmonkey extensions page](https://violentmonkey.github.io/get-it-on/)
2. Click **"Add to Chrome"** (or the equivalent for your browser)
3. Confirm the extension installation when prompted
4. Pin the Violentmonkey icon to your toolbar for easy access

---

## Installing the Script

### Standard Installation

1. Open this repository in your browser
2. Click the `lumo-common-prompts.user.js` file
3. Click the **Raw** button to view the script source
4. Your userscript manager will detect the userscript and offer to install it
5. Click **Install** to confirm
6. Navigate to [lumo.proton.me](https://lumo.proton.me) — the **"Common Prompts"** button appears next to the tools button in the composer

### Manual Installation (if automatic detection fails)

1. Copy all text from the raw script view
2. Open your userscript manager's dashboard
3. Create a new userscript
4. Paste the entire script contents
5. Save and refresh `lumo.proton.me`

---

## Usage

1. Click the **Common Prompts** button that appears next to the tools button in Lumo's composer
2. A dropdown menu displays the available prompts, organized by category
3. **Hover** any item to preview its full prompt text
4. **Click** an item to insert the prompt at the top of your message box
5. Add your content after the prompt text and send as usual

> Press `Escape` or click outside the menu to dismiss it without selecting anything.

---

## Privacy and Security

Lumo Common Prompts is distributed as plain-text JavaScript source code. You can read and inspect the complete script before installing or using it.

The script is designed to perform its functions **locally in your browser**. It needs access to the Lumo conversation interface because that is where it adds prompts.

### The script does not:

- ❌ Send your conversations or prompts to an external server
- ❌ Download or execute additional code
- ❌ Install software on your computer
- ❌ Require an account or external database
- ❌ Collect analytics or usage information
- ❌ Modify or interfere with Lumo's encryption
- ❌ Access Lumo's encryption keys or bypass Lumo's encryption
- ❌ Intercept encrypted network traffic

### If privacy is a primary concern, review both:

- The **source code** of this userscript
- The **permissions and privacy information** for the userscript manager you choose

You can also inspect the browser's developer tools and network activity if you want to verify whether a script is making external requests.

---

## How It Works

The script runs in the Lumo page and observes the conversation interface as it loads.

It adds a **"Common Prompts"** button next to the existing tools button. When clicked, a menu displays the available prompts organized by category. Selecting a prompt inserts it into the message box, ready for you to add content.

---

## Overall Risk

For this particular script, the additional privacy and security risk is **relatively small**, provided that the source code is trusted and the script is not modified to add network requests or other data collection.  (I can't just say trust me)

---

## Limitations

- The script relies on Lumo's current interface structure. If Lumo updates its interface, the button may stop appearing until the script is updated.
- Works only with the Lumo web app at `lumo.proton.me` ,not the mobile applications.
- Some prompts contain placeholders like `[target language]` or `[destination]` — replace these with your specifics before sending, or Lumo will ask for clarification.
- On very narrow screens, the menu may extend partially off-screen.

---

## Disclaimer

This script is created independently and is **not affiliated with, endorsed by, or supported by** Proton or the Lumo development team.

By using this script, you acknowledge that:

- The script is provided **as-is** without warranty of any kind
- The author is not responsible for any disruption to your Lumo usage
- You should review the source code before installing
- Userscript managers require certain permissions, understand their privacy implications before use

For official Lumo support, visit [Proton Support](https://proton.me/support/lumo).


## Version History

| Version | Changes |
|---------|---------|
| **v1.0** | Added "Context Handoff" prompt, refined dark theme colors, improved viewport-aware positioning |

---

## License

**MIT License** — see [LICENSE](LICENSE) for details.
