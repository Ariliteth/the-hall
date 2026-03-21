#!/usr/bin/env node
// Pre-commit hook: reminds Claude to update score cards + roadmap
// when score files are staged for commit.

const { execSync } = require('child_process');
let input = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cmd = (data.tool_input && data.tool_input.command) || '';

    if (!/^git commit/.test(cmd)) {
      process.stdout.write('{}');
      return;
    }

    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .split('\n')
      .filter(f => /^scores\/|^neighborhoods\//.test(f));

    if (staged.length === 0) {
      process.stdout.write('{}');
      return;
    }

    const result = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: [
          'DOCUMENTATION HOOK: Score files are staged for commit.',
          'Before committing, update the relevant concessions/score-cards/*.md',
          '(What\'s Built / What\'s Next sections) and concessions/ROADMAP.md',
          '(move completed items to Done) to reflect these changes.',
          '',
          'Staged score files:',
          ...staged.map(f => '  - ' + f)
        ].join('\n')
      }
    };

    process.stdout.write(JSON.stringify(result));
  } catch (e) {
    process.stdout.write('{}');
  }
});
