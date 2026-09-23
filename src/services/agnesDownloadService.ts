import { AgnesVideo } from '../types/agnesVideo';

/**
 * Downloads a self-contained, beautifully styled offline HTML study packet
 * containing the entire Dr. Agnes video lecture, chalkboard derivations,
 * key formulas, scene transcripts, checkpoints, and exam tips.
 */
export function downloadAgnesStudyPackHtml(video: AgnesVideo): void {
  const scenesHtml = video.scenes
    .map(
      (s, idx) => `
      <section class="scene-card">
        <div class="scene-header">
          <span class="scene-badge">SCENE ${idx + 1} (${s.durationSeconds}s)</span>
          <h3>${escapeHtml(s.title)}</h3>
        </div>
        
        <div class="chalkboard-box">
          <div class="board-header">
            <span class="board-dot red"></span>
            <span class="board-dot yellow"></span>
            <span class="board-dot green"></span>
            <span class="board-title">Chalkboard Derivation & Concept</span>
          </div>
          <div class="formula-banner">
            <code>${escapeHtml(s.keyFormulaOrConcept)}</code>
          </div>
          <ul class="points-list">
            ${s.chalkboardPoints.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}
          </ul>
        </div>

        <div class="narration-box">
          <div class="avatar-tag">
            <strong>Dr. Agnes Vance:</strong>
          </div>
          <p class="narration-text">"${escapeHtml(s.agnesNarration)}"</p>
        </div>

        ${
          s.callout
            ? `
          <div class="callout-box ${s.callout.type || 'intuition'}">
            <span class="callout-label">${escapeHtml(s.callout.title)}:</span>
            <p>${escapeHtml(s.callout.text)}</p>
          </div>
        `
            : ''
        }

        ${
          s.quizCheckpoint
            ? `
          <div class="quiz-box">
            <span class="quiz-badge">Interactive Checkpoint</span>
            <p class="quiz-q">${escapeHtml(s.quizCheckpoint.question)}</p>
            <div class="quiz-options">
              ${s.quizCheckpoint.options
                .map(
                  (opt, oIdx) => `
                <div class="quiz-opt ${oIdx === s.quizCheckpoint!.correctIndex ? 'correct' : ''}">
                  <span class="opt-letter">${String.fromCharCode(65 + oIdx)}:</span>
                  <span>${escapeHtml(opt)}</span>
                  ${oIdx === s.quizCheckpoint!.correctIndex ? '<span class="correct-tag">✓ Correct Answer</span>' : ''}
                </div>
              `
                )
                .join('')}
            </div>
            <div class="quiz-expl">
              <strong>Agnes Explanation:</strong> ${escapeHtml(s.quizCheckpoint.explanation)}
            </div>
          </div>
        `
            : ''
        }
      </section>
    `
    )
    .join('');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(video.title)} - Dr. Agnes Masterclass Study Pack</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --board-bg: #061e14;
      --border: #1f2937;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --rose: #f43f5e;
      --amber: #f59e0b;
      --emerald: #10b981;
      --sky: #0ea5e9;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      padding: 30px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .hero {
      background: linear-gradient(135deg, rgba(244,63,94,0.15), rgba(15,23,42,0.95));
      border: 1px solid rgba(244,63,94,0.3);
      padding: 30px;
      border-radius: 20px;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: rgba(244,63,94,0.2);
      color: #fda4af;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .hook {
      font-size: 16px;
      color: #cbd5e1;
      font-style: italic;
      margin-bottom: 16px;
    }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 12px;
    }
    .summary-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--amber);
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .takeaways-list {
      list-style: none;
      display: grid;
      gap: 10px;
    }
    .takeaways-list li {
      background: rgba(0,0,0,0.3);
      padding: 12px 16px;
      border-radius: 10px;
      border-left: 4px solid var(--amber);
      font-size: 14px;
    }
    .exam-tip-box {
      margin-top: 16px;
      background: rgba(244,63,94,0.1);
      border: 1px solid rgba(244,63,94,0.3);
      padding: 16px;
      border-radius: 12px;
      color: #fecdd3;
      font-size: 13px;
    }
    .scene-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .scene-header {
      margin-bottom: 16px;
    }
    .scene-badge {
      font-size: 10px;
      font-family: monospace;
      font-weight: bold;
      color: var(--rose);
      display: block;
      margin-bottom: 4px;
    }
    .scene-header h3 {
      font-size: 18px;
      color: #ffffff;
    }
    .chalkboard-box {
      background: var(--board-bg);
      border: 1px solid #10b98140;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 16px;
    }
    .board-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
    }
    .board-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .board-dot.red { background: #ef4444; }
    .board-dot.yellow { background: #eab308; }
    .board-dot.green { background: #22c55e; }
    .board-title {
      font-size: 11px;
      color: #6ee7b7;
      margin-left: 6px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .formula-banner {
      background: rgba(0,0,0,0.5);
      border: 1px dashed #10b98160;
      padding: 10px 14px;
      border-radius: 8px;
      color: #a7f3d0;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .points-list {
      list-style-type: disc;
      padding-left: 20px;
      font-size: 13px;
      color: #e2e8f0;
    }
    .points-list li { margin-bottom: 6px; }
    .narration-box {
      background: rgba(15,23,42,0.6);
      border-left: 3px solid var(--sky);
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 14px;
    }
    .avatar-tag {
      font-size: 11px;
      color: #38bdf8;
      margin-bottom: 4px;
    }
    .narration-text {
      font-size: 13px;
      color: #e2e8f0;
      font-style: italic;
    }
    .callout-box {
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 14px;
      font-size: 12px;
    }
    .callout-box.warning {
      background: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
    }
    .callout-box.intuition, .callout-box.tip {
      background: rgba(245,158,11,0.15);
      border: 1px solid rgba(245,158,11,0.3);
      color: #fde68a;
    }
    .callout-label { font-weight: bold; margin-right: 6px; }
    .quiz-box {
      background: rgba(124,58,237,0.1);
      border: 1px solid rgba(124,58,237,0.3);
      padding: 16px;
      border-radius: 12px;
      margin-top: 14px;
    }
    .quiz-badge {
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      color: #c4b5fd;
      display: inline-block;
      margin-bottom: 8px;
    }
    .quiz-q {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 10px;
    }
    .quiz-options {
      display: grid;
      gap: 6px;
      margin-bottom: 10px;
    }
    .quiz-opt {
      background: rgba(0,0,0,0.3);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quiz-opt.correct {
      border: 1px solid #10b981;
      background: rgba(16,185,129,0.15);
      color: #a7f3d0;
      font-weight: bold;
    }
    .correct-tag {
      margin-left: auto;
      font-size: 10px;
      color: #34d399;
    }
    .quiz-expl {
      font-size: 12px;
      color: #cbd5e1;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #64748b;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    @media print {
      body { background: #fff; color: #000; }
      .hero, .summary-card, .scene-card, .chalkboard-box {
        background: #fff !important;
        color: #000 !important;
        border: 1px solid #ccc !important;
      }
      h1, h3, .board-title, .narration-text { color: #000 !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <span class="badge">${escapeHtml(video.subject)} • ${escapeHtml(video.difficulty)}</span>
      <h1>${escapeHtml(video.title)}</h1>
      <p class="hook">"${escapeHtml(video.hookSentence)}"</p>
      <div class="meta-bar">
        <span>Instructor: Dr. Agnes Vance (AI STEM Chair)</span>
        <span>•</span>
        <span>Duration: ${escapeHtml(video.estimatedDuration)}</span>
        <span>•</span>
        <span>Total Scenes: ${video.scenes.length}</span>
        <span>•</span>
        <span>Generated: ${new Date().toLocaleDateString()}</span>
      </div>
    </div>

    <div class="summary-card">
      <h2 class="section-title">🌟 Key Foundational Takeaways</h2>
      <ul class="takeaways-list">
        ${video.summaryTakeaways.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
      </ul>

      <div class="exam-tip-box">
        <strong>🔥 Agnes Golden Exam Tip:</strong> ${escapeHtml(video.examTip)}
      </div>
    </div>

    <div class="scenes-wrapper">
      <h2 class="section-title" style="margin-bottom: 20px;">🎬 Full Blackboard Lecture Breakdown</h2>
      ${scenesHtml}
    </div>

    <div class="footer">
      <p>LumoraAI Agnes Video AI Masterclass • Offline Study Pack</p>
      <p>Studied with Dr. Agnes Vance. Keep practicing and mastering tough STEM concepts!</p>
    </div>
  </div>
</body>
</html>`;

  triggerFileDownload(
    `${slugify(video.topic)}_agnes_study_pack.html`,
    fullHtml,
    'text/html;charset=utf-8'
  );
}

/**
 * Downloads a clean Markdown study sheet suitable for Obsidian, Notion, or text notes
 */
export function downloadAgnesStudyPackMarkdown(video: AgnesVideo): void {
  const scenesMd = video.scenes
    .map(
      (s, idx) => `### Scene ${idx + 1}: ${s.title} (${s.durationSeconds}s)
**Key Formula / Concept**: \`${s.keyFormulaOrConcept}\`

**Chalkboard Derivations**:
${s.chalkboardPoints.map((p) => `- ${p}`).join('\n')}

**Dr. Agnes Narration**:
> "${s.agnesNarration}"

${s.callout ? `**${s.callout.title}**: ${s.callout.text}\n` : ''}
${
  s.quizCheckpoint
    ? `**Checkpoint Question**: ${s.quizCheckpoint.question}
${s.quizCheckpoint.options.map((opt, i) => `  ${String.fromCharCode(65 + i)}. ${opt}${i === s.quizCheckpoint!.correctIndex ? ' (CORRECT)' : ''}`).join('\n')}
*Explanation*: ${s.quizCheckpoint.explanation}
`
    : ''
}
`
    )
    .join('\n---\n\n');

  const content = `# ${video.title}
**Subject**: ${video.subject} | **Difficulty**: ${video.difficulty} | **Duration**: ${video.estimatedDuration}
**Instructor**: Dr. Agnes Vance, AI STEM Chair

> *"${video.hookSentence}"*

---

## 🌟 Foundational Takeaways
${video.summaryTakeaways.map((t) => `- ${t}`).join('\n')}

## 🔥 Golden Exam Tip
> **${video.examTip}**

## ⚠️ Common Student Pitfalls
${video.commonPitfalls.map((p) => `- ${p}`).join('\n')}

---

## 🎬 Chalkboard Scenes Breakdown

${scenesMd}

---
*Generated by LumoraAI - Agnes Video AI Engine*
`;

  triggerFileDownload(
    `${slugify(video.topic)}_agnes_notes.md`,
    content,
    'text/markdown;charset=utf-8'
  );
}

function triggerFileDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(text: string): string {
  return (text || 'agnes_video')
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '_');
}
