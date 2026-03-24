// VSL Script Generator - BerkahKarya Ads Framework

const SYSTEM_PROMPT_VSL = `Kamu adalah AI VSL Script Generator dari BerkahKarya.

VSL STRUCTURE (6 SCENES):

SCENE 1: HOOK (0-3s)
- Curiosity hook / bold claim
- Stop scrolling moment
- Emotion: curiosity/shock

SCENE 2: PROBLEM (3-15s)
- Identify specific pain
- Amplify frustration
- "Kamu pernah ngerasa..."
- Emotion: frustration/pain

SCENE 3: AGITATE (15-30s)
- Make pain worse
- Show consequences
- "Kalau dibiarkan..."
- Emotion: fear/urgency

SCENE 4: SOLUTION (30-45s)
- Introduce product
- How it solves problem
- Unique mechanism
- Emotion: hope/relief

SCENE 5: PROOF (45-55s)
- Social proof
- Results/testimonials
- Stats with context
- Emotion: trust/desire

SCENE 6: CTA (55-60s)
- Clear action step
- Urgency/scarcity
- Risk reversal
- Emotion: action/excitement

EACH SCENE OUTPUT:
{
  "scene_num": 1,
  "name": "HOOK",
  "duration": "0-3s",
  "voiceover": "exact script for dubbing",
  "visual": "specific visual direction",
  "text_overlay": "max 4 words on screen",
  "emotion_trigger": "curiosity"
}

ALSO INCLUDE:
- full_script: all scenes combined for dubbing
- production_notes: camera angles, transitions, music cues
- canva_json: video editing template

OUTPUT: Complete VSL script ready for production.`;

async function generateVSL(body) {
  const { produk, target, keunggulan, tone } = body;

  const userPrompt = `Generate VSL script untuk:

PRODUK: ${produk}
TARGET AUDIENCE: ${target}
KEUNGGULAN: ${keunggulan}
TONE: ${tone || 'santai'}

Generate 6 scenes (HOOK/PROBLEM/AGITATE/SOLUTION/PROOF/CTA) dengan voiceover, visual direction, text overlay, dan emotion trigger per scene.
Total duration: 60 seconds.
Output dalam format JSON.`;

  const response = await fetch('https://ai.aitradepulse.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'auto/pro-fast',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_VSL },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`OmniRoute API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse JSON from response
  let vslData;
  try {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      vslData = JSON.parse(jsonMatch[1]);
    } else {
      vslData = JSON.parse(content);
    }
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    return {
      vsl: {
        scenes: [],
        full_script: content,
        production_notes: 'Parse error - raw content returned',
        canva_json: {}
      }
    };
  }

  return { vsl: vslData };
}

module.exports = { generateVSL };
