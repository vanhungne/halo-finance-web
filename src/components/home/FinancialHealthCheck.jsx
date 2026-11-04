import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ADVICE, BANDS, MAINTENANCE, OPTIONS, QUESTIONS, STRENGTHS, evaluateSurvey,
} from './financialWellbeing.mjs';
import './financialHealthCheck.css';

const COPY = {
  vi: {
    title: 'Hiểu sức khỏe tài chính của bạn',
    intro: 'Không chỉ là thu nhập. Cùng nhìn lại mức độ an tâm, khả năng xoay xở và cảm giác kiểm soát tiền bạc của bạn qua 10 câu hỏi.',
    instruction: 'Chọn câu trả lời sát với hoàn cảnh hiện tại của bạn. Không có câu trả lời đúng hay sai.',
    steps: ['Cảm nhận về tài chính', 'Thói quen & trải nghiệm'],
    partTitles: ['Phần 1: Những nhận định này mô tả bạn đến mức nào?', 'Phần 2: Những điều này xảy ra với bạn thường xuyên thế nào?'],
    answered: 'Đã trả lời', question: 'Câu', completed: 'câu',
    next: 'Tiếp tục phần 2', back: 'Quay lại phần 1', submit: 'Xem kết quả',
    missing: 'Bạn còn câu chưa trả lời. Hãy hoàn tất các mục được đánh dấu bên dưới.',
    required: 'Vui lòng chọn một câu trả lời.',
    about: 'Một chút thông tin để quy đổi điểm',
    aboutHint: 'Độ tuổi và cách hoàn thành khảo sát quyết định cột quy đổi điểm. Hai mục này không cộng thêm điểm.',
    age: 'Bạn thuộc nhóm tuổi nào?', ages: ['18–61 tuổi', 'Từ 62 tuổi'],
    mode: 'Bạn đã hoàn thành khảo sát như thế nào?',
    modes: ['Tôi tự đọc và trả lời', 'Có người đọc câu hỏi cho tôi trả lời'],
    caveat: 'Kết quả chỉ mang tính tự đánh giá, không phải điểm tín dụng hay tư vấn tài chính cá nhân.',
    resultTitle: 'Kết quả tự đánh giá của bạn', score: 'Điểm tham khảo',
    band: 'Mức đánh giá', pointUnit: 'điểm',
    resultIntro: 'Đây là ảnh chụp cảm nhận hiện tại, không phải kết luận về năng lực hay giá trị của bạn. Hãy ưu tiên bước phù hợp với hoàn cảnh thực tế.',
    strengths: 'Điều đang hỗ trợ bạn', nextSteps: 'Bước tiếp theo dành cho bạn',
    answerReason: 'Dựa trên câu', maintenance: 'Gợi ý duy trì',
    noStrength: 'Bạn đã dành thời gian nhìn lại tiền bạc. Bắt đầu từ một việc nhỏ dưới đây là đủ; không cần thay đổi tất cả cùng lúc.',
    noPriority: 'Các câu trả lời cho thấy bạn ít gặp khó khăn ở những khía cạnh được hỏi. Bạn có thể tập trung duy trì và rà soát định kỳ.',
    editorial: 'Các bước gợi ý được tổng hợp từ câu trả lời của bạn và chỉ mang tính tham khảo.',
    edit: 'Xem lại câu trả lời', reset: 'Làm lại', app: 'Ghi chép thu chi cùng ứng dụng',
  },
  en: {
    title: 'Understand your financial well-being',
    intro: 'It is about more than income. Reflect on your sense of security, ability to cope and control over money with 10 questions.',
    instruction: 'Choose the answer closest to your current situation. There are no right or wrong answers.',
    steps: ['How things feel', 'Habits & experiences'],
    partTitles: ['Part 1: How well does this statement describe you or your situation?', 'Part 2: How often does this statement apply to you?'],
    answered: 'Answered', question: 'Question', completed: 'questions',
    next: 'Continue to part 2', back: 'Back to part 1', submit: 'See my results',
    missing: 'Some answers are missing. Please complete the marked items below.',
    required: 'Please select an answer.',
    about: 'A little information for scoring',
    aboutHint: 'Age and administration method determine the score conversion column. These two items do not add points.',
    age: 'How old are you?', ages: ['18–61', '62+'],
    mode: 'How did you take the questionnaire?',
    modes: ['I read the questions myself', 'Someone read the questions to me'],
    caveat: 'This is a self-assessment for reference, not a credit score or personal financial advice.',
    resultTitle: 'Your self-assessment results', score: 'Reference score', band: 'Assessment level', pointUnit: 'points',
    resultIntro: 'This is a snapshot of how things feel now, not a judgment of your ability or worth. Choose the steps that fit your actual circumstances.',
    strengths: 'What is supporting you', nextSteps: 'Next steps for you', answerReason: 'Based on question', maintenance: 'To keep things on track',
    noStrength: 'You have taken time to reflect on money. One small step below is enough to start; you do not need to change everything at once.',
    noPriority: 'Your answers suggest fewer difficulties in the areas covered. You can focus on maintaining progress and reviewing regularly.',
    editorial: 'These suggestions are based on your answers and are for reference only.',
    edit: 'Review my answers', reset: 'Start again', app: 'Track money with the app',
  },
};

export default function FinancialHealthCheck() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? 'en' : 'vi';
  const copy = COPY[lang];
  const [part, setPart] = useState(0);
  const [answers, setAnswers] = useState({});
  const [age, setAge] = useState('');
  const [mode, setMode] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [complete, setComplete] = useState(false);
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const visibleQuestions = part === 0 ? QUESTIONS.slice(0, 6) : QUESTIONS.slice(6);
  const answered = QUESTIONS.filter((question) => Number.isInteger(answers[question.id])).length;
  const missingIds = visibleQuestions.filter((question) => !Number.isInteger(answers[question.id])).map((question) => String(question.id));
  if (part === 1) {
    if (!age) missingIds.push('age');
    if (!mode) missingIds.push('mode');
  }
  const result = complete ? evaluateSurvey(answers, age, mode) : null;

  function focusHeading() {
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      panelRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (missingIds.length) {
      setAttempted(true);
      requestAnimationFrame(() => {
        const field = panelRef.current?.querySelector(`[data-question="${missingIds[0]}"]`);
        field?.scrollIntoView({ block: 'center', behavior: 'instant' });
        field?.querySelector('input')?.focus({ preventScroll: true });
      });
      return;
    }
    setAttempted(false);
    if (part === 0) setPart(1);
    else setComplete(true);
    focusHeading();
  }

  function navigateBack() {
    setPart(0);
    setComplete(false);
    setAttempted(false);
    focusHeading();
  }

  function reset() {
    setAnswers({});
    setAge('');
    setMode('');
    navigateBack();
  }

  function aboutField(field, title, values, labels, selected, setSelected) {
    const invalid = attempted && missingIds.includes(field);
    return (
      <fieldset className="financial-survey__about-field" data-question={field} aria-describedby={invalid ? `survey-error-${field}` : undefined}>
        <legend>{title}</legend>
        <div className="financial-survey__about-options">
          {values.map((value, index) => (
            <label key={value} className={selected === value ? 'is-selected' : ''}>
              <input type="radio" name={`wellbeing-${field}`} value={value} checked={selected === value} onChange={() => setSelected(value)} required />
              <span>{labels[index]}</span>
            </label>
          ))}
        </div>
        {invalid && <span id={`survey-error-${field}`} className="financial-survey__error">{copy.required}</span>}
      </fieldset>
    );
  }

  return (
    <section id="health-check" className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80" aria-labelledby="health-check-title">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="financial-survey__intro">
          <h2 id="health-check-title" className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-950 title-3d">
            {copy.title}
          </h2>
          <p>{copy.intro}</p>
        </div>
        <div className="financial-survey" ref={panelRef}>
          {!result ? (
            <form noValidate onSubmit={handleSubmit}>
              <ol className="financial-survey__steps" aria-label={isEnglish ? 'Survey progress' : 'Tiến trình khảo sát'}>
                {copy.steps.map((label, index) => (
                  <li key={index} aria-current={part === index ? 'step' : undefined} className={part === index ? 'is-current' : part > index ? 'is-done' : ''}>
                    <span>{part > index ? <Check size={16} aria-hidden="true" /> : index + 1}</span>{label}
                  </li>
                ))}
              </ol>
              <div className="financial-survey__progress-label" role="status">{copy.answered} <strong>{answered}/10</strong> {copy.completed}</div>
              <progress className="financial-survey__progress" value={answered} max="10" aria-label={`${copy.answered} ${answered}/10`} />
              <div className="financial-survey__part-heading">
                <h3 ref={headingRef} tabIndex={-1}>{copy.partTitles[part]}</h3>
                <p>{copy.instruction}</p>
              </div>
              {attempted && missingIds.length > 0 && <p className="financial-survey__error-summary" role="alert">{copy.missing}</p>}
              <div className="financial-survey__questions">
                {visibleQuestions.map((question) => {
                  const invalid = attempted && missingIds.includes(String(question.id));
                  return (
                    <fieldset key={question.id} data-question={question.id} className="financial-survey__question" aria-describedby={invalid ? `survey-error-${question.id}` : undefined}>
                      <legend><span className="financial-survey__number">{String(question.id).padStart(2, '0')}.</span>{question[lang]}</legend>
                      <div className="financial-survey__scale">
                        {OPTIONS[lang][part].map((label, index) => (
                          <label key={index} className={answers[question.id] === index ? 'is-selected' : ''}>
                            <input type="radio" name={`wellbeing-${question.id}`} value={index} checked={answers[question.id] === index} onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: index }))} required />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                      {invalid && <span id={`survey-error-${question.id}`} className="financial-survey__error">{copy.required}</span>}
                    </fieldset>
                  );
                })}
              </div>
              {part === 1 && (
                <div className="financial-survey__about">
                  <h4>{copy.about}</h4>
                  <p>{copy.aboutHint}</p>
                  {aboutField('age', copy.age, ['18-61', '62+'], copy.ages, age, setAge)}
                  {aboutField('mode', copy.mode, ['self', 'assisted'], copy.modes, mode, setMode)}
                </div>
              )}
              <div className="financial-survey__actions">
                {part === 1 && <button className="financial-survey__button financial-survey__button--secondary" type="button" onClick={navigateBack}><ArrowLeft size={17} aria-hidden="true" />{copy.back}</button>}
                <button className="financial-survey__button financial-survey__button--primary" type="submit">{part === 0 ? copy.next : copy.submit}<ArrowRight size={17} aria-hidden="true" /></button>
              </div>
            </form>
          ) : (
            <div className="financial-survey__result" data-score-band={result.band.min}>
              <div className="financial-survey__result-summary">
                <h3 ref={headingRef} tabIndex={-1}>{copy.resultTitle}</h3>
                <div className="financial-survey__score-row">
                  <div><span className="financial-survey__small-label">{copy.score}</span><div className="financial-survey__score"><strong className="financial-survey__status-value">{result.score}</strong><span>/ 100</span></div></div>
                  <div className="financial-survey__band"><span className="financial-survey__small-label">{copy.band}</span><strong className="financial-survey__status-value">{result.band[lang]}</strong><span>{result.band.min}–{result.band.max} {copy.pointUnit}</span></div>
                </div>
                <div className="financial-survey__score-scale" role="img" aria-label={`${copy.score}: ${result.score}/100. ${copy.band}: ${result.band[lang]}.`}>
                  <div className="financial-survey__score-track" aria-hidden="true">
                    {BANDS.map((band) => <span key={band.min} className={band.min === result.band.min ? 'is-current' : ''} style={{ width: `${(band.max === 100 ? 100 : band.max + 1) - band.min}%` }} />)}
                    <i className="financial-survey__score-marker" style={{ left: `${result.score}%` }} />
                  </div>
                  <div className="financial-survey__score-endpoints" aria-hidden="true"><span>0 {copy.pointUnit}</span><span>100 {copy.pointUnit}</span></div>
                </div>
              </div>
              <p>{copy.resultIntro}</p>
              <p className="financial-survey__caveat">{copy.caveat}</p>
              <div className="financial-survey__strengths">
                <h4>{copy.strengths}</h4>
                {result.strengths.length ? <ul>{result.strengths.map((key) => <li key={key}><Check size={17} aria-hidden="true" /><span>{STRENGTHS[key][lang]}</span></li>)}</ul> : <p>{copy.noStrength}</p>}
              </div>
              <div className="financial-survey__recommendations">
                <h4>{copy.nextSteps}</h4>
                {result.priorities.length === 0 && <p>{copy.noPriority}</p>}
                <ol>
                  {result.priorities.map((priority) => (
                    <li key={priority.key}>
                      <strong>{ADVICE[priority.key][lang][0]}</strong>
                      <p>{ADVICE[priority.key][lang][1]}</p>
                      <small>{copy.answerReason} {priority.questionId}: “{QUESTIONS[priority.questionId - 1][lang]}” — {OPTIONS[lang][priority.questionId <= 6 ? 0 : 1][answers[priority.questionId]]}.</small>
                    </li>
                  ))}
                  {MAINTENANCE[lang].slice(0, 3 - result.priorities.length).map(([title, description]) => <li key={title}><strong>{title}</strong><p>{description}</p><small>{copy.maintenance}</small></li>)}
                </ol>
                <p className="financial-survey__editorial">{copy.editorial}</p>
              </div>
              <div className="financial-survey__actions financial-survey__actions--result">
                <button type="button" className="financial-survey__button financial-survey__button--secondary" onClick={navigateBack}>{copy.edit}</button>
                <button type="button" className="financial-survey__button financial-survey__button--text" onClick={reset}><RotateCcw size={16} aria-hidden="true" />{copy.reset}</button>
                <a href="#download" className="financial-survey__button financial-survey__button--primary financial-survey__app-link">{copy.app}<ArrowRight size={17} aria-hidden="true" /></a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
