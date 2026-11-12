import { LateralThinkingContext, getLateralThinkingSystemPrompt } from './lateral-thinking-agent'
import { getSafeErrorMessage, parseJsonWithError } from '../utils/parse'

/**
 * Script Writer with Advanced Lateral Thinking
 */

interface ScriptOutput {
  script: string
  beats: string[]
  cameraLanguage: string
  narrativeStrategy: string
  emotionalTurning: string
  lateralThinkingTechniques: string[]
}


export async function writeScript(concept: any, context?: LateralThinkingContext): Promise<ScriptOutput> {
  let conceptTitle = concept?.title || 'Creative Concept'
  let tagline = concept?.tagline || 'The moment counts'
  let coreIdea = concept?.coreIdea || 'Core strategy'

  const isAr = context?.language === 'ar'

  if (context?.useRealAI && context.provider) {
    const langRule = context?.language === 'ar'
      ? '\n\nاللغة: اكتب كل القيم النصية في JSON باللغة العربية الفصحى المبسطة. أبقِ مفاتيح JSON بالإنجليزية كما هي.'
      : ''
    const prompt = `Concept: ${conceptTitle}
    Tagline: ${tagline}
    Core Idea: ${coreIdea}
    
    Task: Write a 30-second emotional screenplay.
    Structure: Beat 1 (Recognition), Beat 2 (Surrender), Beat 3 (Arrival).
    Return JSON: { 
      "script": "...", 
      "beats": ["...", "...", "..."], 
      "cameraLanguage": "...", 
      "narrativeStrategy": "...", 
      "emotionalTurning": "..." 
    }${langRule}`

    try {
      const response = await context.provider.generateCreativeText(
        prompt,
        getLateralThinkingSystemPrompt(context) + "\n\nSpecific Task: You are now writing a cinematic script. Focus on emotion, pacing, and visual storytelling.",
        context.providerConfig
      );
      if (response.error) console.warn(`[Script] provider fallback: ${getSafeErrorMessage(response.error)}`)
      const result = parseJsonWithError(response.text)
      if (result.error) {
        console.warn(`[Script] JSON parse failed: ${result.error}; rawPreview: ${response.text.slice(0, 300)}`)
      }
      const parsed = result.value;
      if (parsed && parsed.script) {
        return {
          ...parsed,
          lateralThinkingTechniques: ['3-Beat emotional arc', 'Narrative subversion']
        };
      }
    } catch (error) {
      console.warn(`Script AI writing failed, falling back to template: ${getSafeErrorMessage(error)}`)
    }
  }

  // Fallback to Template
  const title = conceptTitle.toUpperCase()

  if (isAr) {
    return {
      script: `المشهد ١: الاكتشاف\n\nنفتح على عالم مليء بالضجيج. توتر. الإيقاع لا يُحتمل.\n\nثم نراه. ${conceptTitle}. مرساة صامتة وسط الفوضى.\n\nالإيقاع ١: التعرّف\nتتوقف الشخصية. الكاميرا تلاحق التفصيل الذي يفوّته الآخرون.\n\nالإيقاع ٢: التحوّل\nنَفَس عميق. قرار يُتَّخذ في صمت. اللون ينتقل من البارد إلى الذهبي الدافئ.\n\nالإيقاع ٣: الوصول\nاللقطة الأخيرة: وضوح تام.\n\nالراوي (صوت خارجي)\n${tagline}\n\nالشعار: ${conceptTitle}`,
      beats: [
        'العالم يتوقف لثانية.',
        'اختيار بين الصاخب والصادق.',
        'الوضوح يستقر كضباب خفيف ينقشع.'
      ],
      cameraLanguage: 'لقطات واسعة سينمائية تنتقل إلى لقطات قريبة حميمة بتفاصيل ملموسة.',
      narrativeStrategy: 'الصمت البصري كعامل تميّز فاخر.',
      emotionalTurning: 'فوضى ← تواصل ← وضوح',
      lateralThinkingTechniques: ['Template Scripting']
    }
  }

  return {
    script: `SCENE 1: THE DISCOVERY\n\nWe open on a world of noise. Tension. The pace is unbearable.\n\nThen, we see it. ${conceptTitle}. A silent anchor in the chaos.\n\nBEAT 1: RECOGNITION\nThe protagonist stops. The camera lingering on the detail that others miss.\n\nBEAT 2: THE SHIFT\nA deep breath. A decision made in silence. The visual tone shifts from cold to warm gold.\n\nBEAT 3: ARRIVAL\nFinal frame: Absolute clarity.\n\nNARRATOR (V.O.)\n${tagline}\n\nLOGO: ${title}`,
    beats: [
      'The world stops for a second.',
      'A choice is made between the loud and the true.',
      'Clarity settles in like a light fog lifting.'
    ],
    cameraLanguage: 'Cinematic wide shots transitioning to intimate, textural macros.',
    narrativeStrategy: 'Visual silence as a premium differentiator.',
    emotionalTurning: 'Chaos → Connection → Clarity',
    lateralThinkingTechniques: ['Template Scripting']
  }
}
