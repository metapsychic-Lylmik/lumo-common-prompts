// ==UserScript==
// @name         Lumo Common Prompts
// @namespace    lumo-common-prompts
// @version      1.0
// @description  A small built-in library of reusable prompts for Lumo.
// @match        https://lumo.proton.me/*
// @run-at       document-end
// @grant        none
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Lumo Common Prompts] Initializing v1.0');

    var PROMPTS = {
        Writing: [
            ['Improve Writing', 'Improve the writing below for clarity, flow, and readability while preserving my meaning and voice.'],
            ['Make Concise', 'Make the following more concise without removing important information or changing the meaning.'],
            ['Proofread', 'Proofread the following for grammar, spelling, punctuation, and awkward wording. Preserve my meaning and voice.'],
            ['Summarize', 'Summarize the following, focusing on the most important points and omitting repetition and minor details.'],
            ['Email Draft', 'Draft an email based on the notes below, matching the tone to the recipient relationship. Match the length to the content — do not pad it.'],
            ['Translate & Localize', 'Translate the following text into [target language], adapting idioms and cultural references naturally for that audience. If the target language is not specified, ask before translating.'],
        ],

        Analysis: [
            ['Critical Analysis', 'Analyze the following carefully. Separate facts from assumptions, identify uncertainty, and explain the reasoning behind your conclusions.'],
            ['Check Assumptions', 'Examine the following for hidden or questionable assumptions. Identify them and explain how they affect the conclusion.'],
            ['Fact vs. Inference', 'Separate the claims below into established facts, reasonable inferences, speculation, and unknowns. Do not present inference as fact.'],
            ['Find Weaknesses', 'Look for weaknesses, gaps, contradictions, or unsupported claims in the following. Explain each issue and how significant it is.'],
            ['Steelman', 'Present the strongest reasonable version of the opposing position before evaluating which position is better supported.'],
            ['Challenge My Thinking', 'Challenge my reasoning constructively. Look for things I may be overlooking, alternative explanations, and evidence that could change the conclusion.'],
            ['Context Handoff', 'Write a self-contained summary of this conversation that can be pasted into a new chat with no other context. Include: the original goal, the key decisions and conclusions reached, important facts and constraints, any corrections that supersede earlier statements (report the corrected version only, not the error), and remaining open questions or unresolved disagreements. Exclude abandoned tangents, superseded content, and any pasted material that is no longer needed. Write it as a briefing document, not a narrative of how the conversation unfolded.']
        ],

        Research: [
            ['Evidence Quality', 'Evaluate the evidence and sources supporting the claims below. Distinguish strong evidence from weak, indirect, or missing evidence, and whether the sources actually support the conclusions.'],
            ['Alternative Explanations', 'Identify plausible alternative explanations for the situation below and compare them with the leading explanation.'],
            ['Research Plan', 'Create a practical research plan for answering the following question. Prioritize the most important information to establish first.'],
            ['What Would Change It?', 'Identify what additional evidence or information would most likely change the conclusion reached below.'],
            ['Plan a Trip', 'Create a practical itinerary for [destination] with [duration], balancing activities by type and respecting a [budget] constraint.']
        ],

        Coding: [
            ['Explain Code', 'Explain the following code clearly. Describe what it does, how the important parts work, and any non-obvious behavior.'],
            ['Find Bugs', 'Review the following code for bugs, incorrect assumptions, edge cases, and likely runtime problems. Explain each issue before suggesting a fix.'],
            ['Improve Code', 'Review the following code for correctness, maintainability, and unnecessary complexity. Simplify where possible. Suggest changes only where they provide a meaningful benefit.'],
            ['Security Review', 'Review the following code for meaningful security or privacy risks. Focus on realistic risks rather than hypothetical or trivial concerns.'],
            ['Minimal Change', 'Modify the following code to accomplish the requested change while making the smallest reasonable number of changes and preserving existing behavior.']
        ],

        Learning: [
            ['Study Notes', 'Transform the following text into organized study notes with key concepts, examples, and potential quiz questions.'],
            ['Explain Concept', 'Explain the following concept clearly and progressively. Start with intuition, then add precision and examples.'],
            ['Quiz Me', 'Test my understanding of the following topic with progressive questions, adjusting difficulty based on my answers.']
        ]
    };

    var BUTTON_ID = 'lumo-common-prompts-button';
    var MENU_ID = 'lumo-common-prompts-menu';
    var DEBOUNCE_DELAY = 300;
    var observerDebounceTimer = null;

    // Dark theme colors
    var COLORS = {
        menuBg: '#1a1a2e',
        menuBorder: '#3d3d5c',
        menuText: '#ffffff',
        headingText: '#e0e0e0',
        buttonBg: '#252542',
        buttonHover: '#3a3a6a'
    };

    function insertPrompt(promptText) {
        var composer = document.querySelector(
            'textarea.tiptap.ProseMirror.composer'
        );

        if (!composer) {
            console.error('[Lumo Common Prompts] Composer textarea not found');
            return;
        }

        var existingText = composer.value;
        var newText;

        if (existingText.trim()) {
            newText = promptText + '\n\n' + existingText;
        } else {
            newText = promptText + '\n\n';
        }

        var setter = Object.getOwnPropertyDescriptor(
            HTMLTextAreaElement.prototype,
            'value'
        ).set;

        setter.call(composer, newText);

        composer.dispatchEvent(
            new InputEvent('input', {
                bubbles: true,
                inputType: 'insertText',
                data: newText
            })
        );

        composer.focus();

        var cursorPosition = promptText.length + 2;

        composer.setSelectionRange(
            cursorPosition,
            cursorPosition
        );

        console.log('[Lumo Common Prompts] Prompt inserted:', promptText.substring(0, 50) + '...');
    }

    function closeMenu() {
        var menu = document.getElementById(MENU_ID);

        if (menu) {
            menu.remove();
            console.log('[Lumo Common Prompts] Menu closed');
        }
    }

    function createPromptMenu(button) {
        closeMenu();

        var menu = document.createElement('div');
        menu.id = MENU_ID;
        menu.style.position = 'fixed';
        menu.style.zIndex = '999999';
        menu.style.width = '280px';
        menu.style.overflowY = 'auto';
        menu.style.padding = '8px';
        menu.style.borderRadius = '12px';
        menu.style.backgroundColor = COLORS.menuBg;
        menu.style.setProperty('color', COLORS.menuText, 'important');
        menu.style.border = '1px solid ' + COLORS.menuBorder;
        menu.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';

        var rect = button.getBoundingClientRect();
        var viewportHeight = window.innerHeight;
        var menuEstHeight = 450;

        var spaceBelow = viewportHeight - rect.bottom;
        var spaceAbove = rect.top;

        if (spaceBelow < menuEstHeight && spaceAbove > spaceBelow) {
            // Position above the button — preserve horizontal alignment
            menu.style.left = rect.left + 'px';
            menu.style.top = 'auto';
            menu.style.bottom = (viewportHeight - rect.top) + 'px';
        } else {
            // Position below the button
            menu.style.left = rect.left + 'px';
            menu.style.top = (rect.bottom + 6) + 'px';
            menu.style.bottom = 'auto';
        }

        // Clamp menu height so it never runs past the top of the viewport
        var usableAbove = Math.max(spaceAbove - 18, 0);
        var usableBelow = Math.max(spaceBelow - 18, 0);
        var available = Math.max(usableAbove, usableBelow);

        menu.style.maxHeight = Math.min(400, available) + 'px';

        var categories = Object.keys(PROMPTS);

        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];

            var heading = document.createElement('div');
            heading.textContent = category;
            heading.style.fontWeight = '600';
            heading.style.fontSize = '13px';
            heading.style.padding = '7px 8px 4px';
            heading.style.setProperty('color', COLORS.headingText, 'important');
            menu.appendChild(heading);

            var categoryPrompts = PROMPTS[category];

            for (var j = 0; j < categoryPrompts.length; j++) {
                var item = categoryPrompts[j];

                var promptButton = document.createElement('button');
                promptButton.type = 'button';
                promptButton.textContent = item[0];
                promptButton.title = item[1];

                promptButton.style.display = 'block';
                promptButton.style.width = '100%';
                promptButton.style.padding = '7px 8px';
                promptButton.style.paddingLeft = '20px';
                promptButton.style.margin = '1px 0';
                promptButton.style.border = '0';
                promptButton.style.borderRadius = '7px';
                promptButton.style.backgroundColor = COLORS.buttonBg;
                promptButton.style.setProperty('color', COLORS.menuText, 'important');
                promptButton.style.textAlign = 'left';
                promptButton.style.cursor = 'pointer';
                promptButton.style.fontSize = '14px';
                promptButton.style.whiteSpace = 'normal';
                promptButton.style.lineHeight = '1.3';

                // Hover effect
                (function (btn) {
                    btn.addEventListener('mouseenter', function () {
                        btn.style.backgroundColor = COLORS.buttonHover;
                    });
                    btn.addEventListener('mouseleave', function () {
                        btn.style.backgroundColor = COLORS.buttonBg;
                    });
                })(promptButton);

                (function (prompt) {
                    promptButton.addEventListener('click', function () {
                        insertPrompt(prompt);
                        closeMenu();
                    });
                })(item[1]);

                menu.appendChild(promptButton);
            }
        }

        document.body.appendChild(menu);
        console.log('[Lumo Common Prompts] Menu created, positioned based on viewport');
    }

    function addButton() {
        var composer = document.querySelector(
            'textarea.tiptap.ProseMirror.composer'
        );

        if (!composer) {
            console.debug('[Lumo Common Prompts] Composer not yet found, retrying');
            return false;
        }

        var container = composer.closest('.lumo-input-container');

        if (!container) {
            console.error('[Lumo Common Prompts] lumo-input-container not found');
            return false;
        }

        if (container.querySelector('#' + BUTTON_ID)) {
            return true;
        }

        var buttons = container.querySelectorAll('button');

        if (buttons.length < 2) {
            console.error('[Lumo Common Prompts] Not enough buttons in container');
            return false;
        }

        var toolsButton = buttons[1];

        var commonButton = document.createElement('button');
        commonButton.id = BUTTON_ID;
        commonButton.type = 'button';
        commonButton.textContent = 'Common Prompts';
        commonButton.className = toolsButton.className;
        commonButton.title = 'Common Prompts';

        commonButton.addEventListener('click', function (event) {
            event.stopPropagation();
            createPromptMenu(commonButton);
        });

        toolsButton.parentElement.insertBefore(
            commonButton,
            toolsButton.nextSibling
        );

        console.log('[Lumo Common Prompts] Button added successfully');
        return true;
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    document.addEventListener('click', function (event) {
        var menu = document.getElementById(MENU_ID);

        if (!menu) {
            return;
        }

        if (
            !menu.contains(event.target) &&
            event.target.id !== BUTTON_ID
        ) {
            closeMenu();
        }
    });

    function waitForLumo() {
        if (!addButton()) {
            setTimeout(waitForLumo, 500);
        }
    }

    waitForLumo();

    // Debounced MutationObserver — restores the button when Lumo rebuilds the composer
    var observer = new MutationObserver(function () {
        if (observerDebounceTimer) {
            clearTimeout(observerDebounceTimer);
        }

        observerDebounceTimer = setTimeout(function () {
            if (!document.getElementById(BUTTON_ID)) {
                console.log('[Lumo Common Prompts] DOM changed, re-checking for button');
                addButton();
            }
        }, DEBOUNCE_DELAY);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[Lumo Common Prompts] MutationObserver attached');
})();
