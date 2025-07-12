/**
 * ARTBRAND - Artist Branding Tool
 * This script handles the multi-step form for creating an artist brand identity
 */

// ======================
// CONSTANTS & CONFIGURATION
// ======================

/**
 * Word bank for brand voice selection
 * @constant {Array<string>}
 */
const WORD_BANK = [
    "Witty", "Bold", "Cheeky", "Unapologetic", "Supportive", 
    "Reassuring", "Nurturing", "Energetic", "Fun", "Casual", 
    "Elegant", "Refined", "Confident", "Knowledgeable", "Structured", 
    "Edgy", "Defiant", "Visionary", "Unpredictable", "Weird", 
    "Motivational", "Purposeful", "Real", "Relatable", "No-frills", 
    "Alluring", "Elevated", "Exclusive", "Playful", "Rebellious"
];

/**
 * Brand personality definitions with traits, descriptions and examples
 * @constant {Object}
 */
const BRAND_PERSONALITIES = {
    "Sassy & Bold": {
        traits: ["Witty", "Bold", "Cheeky", "Unapologetic"],
        description: "Unapologetic rule-breaker with flair.",
        example: "Wendy's on Twitter"
    },
    // [Other brand personalities remain the same...]
};

// ======================
// APPLICATION STATE
// ======================

/**
 * Current form step (1-10)
 * @type {number}
 */
let currentStep = 1;

/**
 * Words selected by user for brand voice
 * @type {Array<string>}
 */
let selectedWords = [];

/**
 * Determined brand voice based on selected words
 * @type {string}
 */
let brandVoice = "";

/**
 * Selected voiceover option
 * @type {string}
 */
let selectedVoice = "";

/**
 * History of visited steps for back navigation
 * @type {Array<number>}
 */
let stepHistory = [];

// ======================
// DOM INITIALIZATION
// ======================

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeWordGrid();
    setupFileUploads();
    setupVoiceOptionKeyboardSupport();
    updateProgress();
});

/**
 * Populates the word selection grid with options
 */
function initializeWordGrid() {
    const wordGrid = document.getElementById('wordGrid');
    
    WORD_BANK.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-option';
        wordElement.textContent = word;
        wordElement.onclick = () => selectWord(wordElement, word);
        wordElement.setAttribute('role', 'gridcell');
        wordGrid.appendChild(wordElement);
    });
}

/**
 * Sets up event listeners for file upload previews
 */
function setupFileUploads() {
    document.getElementById('logoUpload').addEventListener('change', function(e) {
        document.getElementById('logoUploadError').style.display = 'none';
        previewImage(e.target.files[0], 'logoPreview');
    });
    
    document.getElementById('artworkUpload').addEventListener('change', function(e) {
        document.getElementById('artworkUploadError').style.display = 'none';
        previewImage(e.target.files[0], 'artworkPreview');
    });
}

/**
 * Adds keyboard support for voice option selection
 */
function setupVoiceOptionKeyboardSupport() {
    document.querySelectorAll('.voice-option').forEach(option => {
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                selectVoice(this);
            }
        });
    });
}

// ======================
// NAVIGATION & PROGRESS
// ======================

/**
 * Advances to the next step in the form
 * @param {number} stepNumber - Current step number
 */
function nextStep(stepNumber) {
    stepHistory.push(currentStep);
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep = stepNumber + 1;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
    window.scrollTo(0, 0);
}

/**
 * Returns to the previous step in the form
 */
function prevStep() {
    if (stepHistory.length > 0) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep = stepHistory.pop();
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgress();
        window.scrollTo(0, 0);
    }
}

/**
 * Updates the progress bar based on current step
 */
function updateProgress() {
    const TOTAL_STEPS = 10;
    const progress = (currentStep / TOTAL_STEPS) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

// ======================
// BRAND VOICE SELECTION
// ======================

/**
 * Handles word selection for brand voice
 * @param {HTMLElement} element - The clicked word element
 * @param {string} word - The selected word
 */
function selectWord(element, word) {
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedWords = selectedWords.filter(w => w !== word);
    } else if (selectedWords.length < 10) {
        element.classList.add('selected');
        selectedWords.push(word);
    }
    
    updateWordCounter();
}

/**
 * Updates the word counter display
 */
function updateWordCounter() {
    const counter = document.getElementById('wordCounter');
    counter.textContent = `${selectedWords.length}/10 words selected`;
    document.getElementById('analyzeBtn').disabled = selectedWords.length !== 10;
}

/**
 * Analyzes selected words to determine brand voice
 */
function analyzeBrandVoice() {
    brandVoice = determineBrandVoice();
    displaySelectedWords();
    nextStep(3); // Move to selected words review step
}

/**
 * Determines brand voice based on selected words
 * @returns {string} The matched brand voice
 */
function determineBrandVoice() {
    let bestMatch = "";
    let bestScore = 0;
    
    for (const [personality, data] of Object.entries(BRAND_PERSONALITIES)) {
        const score = data.traits.filter(trait => 
            selectedWords.includes(trait)
        ).length;
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = personality;
        }
    }
    
    return bestMatch;
}

/**
 * Displays the selected words in the review step
 */
function displaySelectedWords() {
    const container = document.getElementById('selectedWordsDisplay');
    container.innerHTML = '';
    
    selectedWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'selected-word';
        wordElement.textContent = word;
        wordElement.setAttribute('role', 'listitem');
        container.appendChild(wordElement);
    });
}

// [Continue with the rest of the functions following the same pattern...]

// ======================
// UTILITY FUNCTIONS
// ======================

/**
 * Previews an uploaded image
 * @param {File} file - The image file to preview
 * @param {string} previewId - ID of the preview container
 */
function previewImage(file, previewId) {
    const reader = new FileReader();
    const preview = document.getElementById(previewId);
    
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    }
    
    if (file) {
        reader.readAsDataURL(file);
    }
}

// ======================
// FORM VALIDATION
// ======================

/**
 * Validates step 1 (Company Name) before proceeding
 */
function validateStep1() {
    const companyName = document.getElementById('companyName').value.trim();
    const errorElement = document.getElementById('companyNameError');
    
    if (!companyName) {
        errorElement.style.display = 'block';
        return;
    }
    
    errorElement.style.display = 'none';
    nextStep(1);
}

// [Other validation functions follow the same pattern...]

// ======================
// INITIALIZATION
// ======================

// Make functions available globally for HTML onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
window.validateStep1 = validateStep1;
// [Add other functions that need to be called from HTML...]// JavaScript Document

async function processArtwork(artworkFile) {
    try {
        // 1. Get image analysis from AI
        const description = await generateArtworkDescription(artworkFile);
        
        // 2. Generate framed visualizations
        const visualizations = await generateArtworkVisualizations(artworkFile);
        
        // 3. Update UI
        displayAIResults(description, visualizations);
        
    } catch (error) {
        console.error("AI processing failed:", error);
        showError("AI service is currently unavailable. Please try again later.");
    }
}

// In your app.js - Add these new functions:

/**
 * Analyze artwork and generate description/visualizations
 * @param {File} artworkFile - The uploaded artwork file
 */
async function processArtwork(artworkFile) {
    try {
        // 1. Get image analysis from AI
        const description = await generateArtworkDescription(artworkFile);
        
        // 2. Generate framed visualizations
        const visualizations = await generateArtworkVisualizations(artworkFile);
        
        // 3. Update UI
        displayAIResults(description, visualizations);
        
    } catch (error) {
        console.error("AI processing failed:", error);
        showError("AI service is currently unavailable. Please try again later.");
    }
}

/**
 * Generate detailed artwork description using AI
 */
async function generateArtworkDescription(imageFile) {
    const API_KEY = "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"; // Store securely in environment variables
    const endpoint = "https://api.openai.com/v1/chat/completions";
    
    // Convert image to base64
    const base64Image = await toBase64(imageFile);
    
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4-vision-preview",
            messages: [{
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Create an inspiring, thought-provoking description for this artwork suitable for an artist's portfolio. Consider: artistic style, emotional impact, technical execution, and potential interpretations. Respond in 3 paragraphs."
                    },
                    {
                        type: "image_url",
                        image_url: `data:image/jpeg;base64,${base64Image}`
                    }
                ]
            }],
            max_tokens: 1000
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Generate framed artwork visualizations
 */
async function generateArtworkVisualizations(imageFile) {
    const API_KEY = "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";
    const endpoint = "https://api.openai.com/v1/images/generations";
    
    const base64Image = await toBase64(imageFile);
    const prompts = [
        "A modern white gallery wall with dramatic lighting, featuring this artwork in a sleek black frame",
        "A cozy living room setting with this artwork in an ornate gold frame above a fireplace",
        "A minimalist office space with this artwork in a natural wood floating frame"
    ];

    const visualizations = [];
    
    for (const prompt of prompts) {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: `${prompt}. The artwork should maintain its original colors and style.`,
                image: base64Image,
                n: 1,
                size: "1024x1024",
                quality: "hd"
            })
        });

        const data = await response.json();
        visualizations.push(data.data[0].url);
    }

    return visualizations;
}

/**
 * Convert file to base64 for API upload
 */
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

/**
 * Display AI-generated results in UI
 */
function displayAIResults(description, visualizations) {
    // Update description
    document.getElementById('aiDescription').innerHTML = formatDescription(description);
    document.getElementById('descriptionEdit').value = description;
    
    // Create visualization gallery
    const gallery = document.createElement('div');
    gallery.className = 'visualization-gallery';
    
    visualizations.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Artwork visualization ${index+1}`;
        img.className = 'visualization';
        gallery.appendChild(img);
    });
    
    document.getElementById('finalPreview').appendChild(gallery);
}

// Add to your existing generateDescription function:
function generateDescription() {
    const artworkFile = document.getElementById('artworkUpload').files[0];
    if (artworkFile) {
        showLoadingState();
        processArtwork(artworkFile).then(() => {
            nextStep(6); // Proceed to next step
        });
    }
}