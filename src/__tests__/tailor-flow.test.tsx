// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TailorFlow } from '@/components/tailor/TailorFlow';
import { parseResume } from '@/lib/parsing/resume-parser';
import { parseJobDescription } from '@/lib/jobs/job-parser';
import { calculateResumeScore } from '@/lib/scoring/scoring-engine';

const RESUME = `Sam Rivera
sam@example.com
EXPERIENCE
Software Engineer | Example Logistics | 2022 - Present
- Built REST APIs in Python for the billing team.
- Developed ML models to forecast shipment delays.
PROJECTS
Inventory tracker
- Developed an inventory dashboard using Django and PostgreSQL.
SKILLS
Python, SQL`;
const JOB = 'Backend Engineer\nRequired: Python, Machine Learning\nPreferred: PostgreSQL, GraphQL';

function renderFlow(onReanalyze = vi.fn(), resume = RESUME, job = JOB) {
  const score = calculateResumeScore(parseResume(resume), parseJobDescription(job), 'job_match', 'experienced');
  render(<TailorFlow resumeText={resume} score={score} onReanalyze={onReanalyze} />);
  return { user: userEvent.setup(), onReanalyze };
}
const card = (name: RegExp) => screen.getByRole('listitem', { name });

afterEach(cleanup);

describe('TailorFlow', () => {
  it('step 1 lists each keyword with its evidence and the honest gap copy', async () => {
    renderFlow();
    expect(screen.getByRole('heading', { name: 'Identify keywords' })).toBeTruthy();
    const table = screen.getByRole('table', { name: /keywords this job asks for/i });
    expect(within(table).getByRole('rowheader', { name: 'GraphQL' })).toBeTruthy();
    expect(within(table).getByText(/Developed ML models/)).toBeTruthy();
    expect(screen.getByText(/Missing evidence does not mean you lack a skill/)).toBeTruthy();
  });

  it('accepts and rejects one at a time, accepts all supported, undoes and resets', async () => {
    const { user } = renderFlow();
    await user.click(screen.getByRole('button', { name: 'Continue to edits' }));
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Optimize resume' }));

    const postgres = card(/PostgreSQL.*Supported by your resume/);
    expect(within(postgres).getByText('Python, SQL')).toBeTruthy();
    expect(within(postgres).getByText('PostgreSQL', { selector: 'ins' })).toBeTruthy();
    expect(within(postgres).getByText(/Developed an inventory dashboard/)).toBeTruthy();
    await user.click(within(postgres).getByRole('button', { name: /^Reject/ }));
    expect(within(postgres).getByRole('button', { name: /^Reject/ }).getAttribute('aria-pressed')).toBe('true');

    await user.click(screen.getByRole('button', { name: /Accept all supported/ }));
    expect(within(postgres).getByRole('button', { name: /^Reject/ }).getAttribute('aria-pressed')).toBe('true');
    const reword = card(/Machine Learning.*Supported by your resume.*Use the job/);
    expect(within(reword).getAllByRole('button', { name: /^Accept/ })[0].getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('status', { name: 'Review progress' }).textContent).toMatch(/accepted/);
    const gap = card(/GraphQL.*No evidence/);
    expect(within(gap).getByText('Add only if this is true for you.')).toBeTruthy();
    expect(within(gap).queryByRole('button', { name: /^Accept/ })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(within(reword).getAllByRole('button', { name: /^Accept/ })[0].getAttribute('aria-pressed')).toBe('false');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(within(postgres).getByRole('button', { name: /^Reject/ }).getAttribute('aria-pressed')).toBe('false');
  });

  it('is keyboard operable', async () => {
    const { user } = renderFlow();
    screen.getByRole('button', { name: 'Continue to edits' }).focus();
    await user.keyboard('{Enter}');
    const accept = within(card(/PostgreSQL.*Supported/)).getByRole('button', { name: /^Accept/ });
    accept.focus();
    await user.keyboard(' ');
    expect(accept.getAttribute('aria-pressed')).toBe('true');
  });

  it('adds a confirmed user-asserted line and shows it in the final checklist', async () => {
    const { user, onReanalyze } = renderFlow();
    await user.click(screen.getByRole('button', { name: 'Continue to edits' }));
    const gap = card(/GraphQL.*No evidence/);
    const add = within(gap).getByRole('button', { name: /Add my line/ });
    await user.type(within(gap).getByRole('textbox', { name: /Your evidence line for GraphQL/ }), 'Designed a GraphQL schema for the parts catalog.');
    expect((add as HTMLButtonElement).disabled).toBe(true);
    await user.click(within(gap).getByRole('checkbox', { name: /This is true for me/ }));
    await user.click(add);
    expect(within(card(/GraphQL.*user-asserted/)).getByText(/Designed a GraphQL schema/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Continue to final check' }));
    expect(screen.getByRole('heading', { name: 'Apply with confidence' })).toBeTruthy();
    expect(screen.getByText(/Job terminology alignment/)).toBeTruthy();
    expect(screen.getByText(/not hiring predictions or ATS certification/)).toBeTruthy();
    const asserted = screen.getByRole('list', { name: 'Lines you added' });
    expect(within(asserted).getByText(/Designed a GraphQL schema/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download DOCX' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Re-analyze tailored version' }));
    expect(onReanalyze).toHaveBeenCalledWith(expect.stringContaining('- Designed a GraphQL schema for the parts catalog.'));
  });

  it('prefills an editable draft from the related line for a transferable skill', async () => {
    const resume = RESUME.replace(' in Python', '').replace('Python, SQL', 'SQL');
    const { user } = renderFlow(vi.fn(), resume, 'Data Engineer\nRequired: Python');
    await user.click(screen.getByRole('button', { name: 'Continue to edits' }));
    const item = card(/Python.*Transferable, review wording/);
    const box = within(item).getByRole('textbox', { name: /Your evidence line for Python/ }) as HTMLTextAreaElement;
    expect(box.value).toBe('Developed an inventory dashboard using Django and PostgreSQL.');
    await user.click(within(item).getByRole('checkbox', { name: /This is true for me/ }));
    await user.click(within(item).getByRole('button', { name: /Add my line/ }));
    expect(within(item).getByRole('alert').textContent).toMatch(/Mention Python/);
    await user.clear(box);
    await user.type(box, 'Developed an inventory dashboard in Python using Django and PostgreSQL.');
    await user.click(within(item).getByRole('button', { name: /Add my line/ }));
    expect(within(card(/Python.*user-asserted/)).getByText(/dashboard in Python using Django/)).toBeTruthy();
  });

  it('blocks a user line that does not mention the keyword', async () => {
    const { user } = renderFlow();
    await user.click(screen.getByRole('button', { name: 'Continue to edits' }));
    const gap = card(/GraphQL.*No evidence/);
    await user.type(within(gap).getByRole('textbox', { name: /Your evidence line/ }), 'Designed a schema for parts.');
    await user.click(within(gap).getByRole('checkbox', { name: /This is true for me/ }));
    await user.click(within(gap).getByRole('button', { name: /Add my line/ }));
    expect(within(gap).getByRole('alert').textContent).toMatch(/Mention GraphQL/);
  });
});
